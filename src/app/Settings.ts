import { DEFAULT_TAGS } from '@features/AutoTag/Constants';
import { SettingsUpdate } from './types';
import { postBridgeMessage } from './Bridge';
import { normalizeActionNameRules } from '@features/FixActionNames/rules';
import { normalizeModules } from './ModuleSettings';

export const Settings = {
  lastGlobalInactivityTime: '5',
  lastGlobalTrackings: [],
  lastRemovedGlobalTrackings: [],
  actionNameRules: normalizeActionNameRules(null),
  actionNameSimplifyVariables: true,
  isCleanEnviroment: false,
  prodKey: ['prd', 'prod'],
  hmgKey: ['hmg'],
  betaKey: ['beta'],
  devKey: ['dev'],
  personalSnippets: [],
  personalTags: DEFAULT_TAGS,
  isAutoTagActive: false,
  language: 'ptbr',
  modules: normalizeModules(null),
  devMode: {
    onlyRouters: false,
    paintRoutersByAmbient: false,
    changeBeholderPaddingRight: false,
    cleanHeaderOnHome: false,
    actionAndOutputTips: false,
    hideLibraryFunction: false,
  },
};

export type DevModeKeys = keyof typeof Settings.devMode;

const subscribers = new Set<() => void>();
export const subscribeSettings = (callback: () => void): (() => void) => {
  subscribers.add(callback);
  return () => { subscribers.delete(callback); };
};

export const mergeSettings = (newSettings: Partial<typeof Settings>): void => {
  if (!newSettings || typeof newSettings !== 'object') return;
  const previousModules = JSON.stringify(Settings.modules);
  const previousLanguage = Settings.language;
  const previousActionRules = JSON.stringify(Settings.actionNameRules);
  const previousSimplify = Settings.actionNameSimplifyVariables;
  for (const key of Object.keys(Settings)) {
    const value = newSettings[key];
    if (key === 'modules') {
      Settings.modules = normalizeModules(value, Settings.modules);
      continue;
    }
    if (key === 'actionNameRules') {
      if (Array.isArray(value)) Settings.actionNameRules = normalizeActionNameRules(value);
      continue;
    }
    if (key === 'devMode') {
      if (value && typeof value === 'object') {
        for (const setting of Object.keys(Settings.devMode)) {
          if (typeof value[setting] === 'boolean') Settings.devMode[setting] = value[setting];
        }
      }
      continue;
    }
    if (key === 'language' && !['ptbr', 'en', 'es'].includes(value)) continue;
    if (Array.isArray(Settings[key]) ? Array.isArray(value) : typeof value === typeof Settings[key]) {
      Settings[key] = value;
    }
  }
  if (previousModules !== JSON.stringify(Settings.modules) || previousLanguage !== Settings.language ||
      previousActionRules !== JSON.stringify(Settings.actionNameRules) || previousSimplify !== Settings.actionNameSimplifyVariables) {
    subscribers.forEach(callback => callback());
  }
};

export const setDevModeSettings = (
  devModeSetting: DevModeKeys,
  newDevModeValue: boolean
): void => {
  if (!(devModeSetting in Settings.devMode) || typeof newDevModeValue !== 'boolean') return;
  Settings.devMode[devModeSetting] = newDevModeValue;
  setSettings(Settings);
};

export const setSettings = (newSettings: Partial<typeof Settings>): void => {
  mergeSettings(newSettings);

  const isFromServer = typeof chrome !== 'undefined' && Boolean(chrome.storage);

  const settingsUpdate: SettingsUpdate = {
    isSettingsUpdate: true,
    newSettings: Settings,
    isFromClient: !isFromServer,
  };

  if (isFromServer) {
    chrome.storage.sync.set({ settings: Settings });
  }

  if (!isFromServer) postBridgeMessage(settingsUpdate);
};
