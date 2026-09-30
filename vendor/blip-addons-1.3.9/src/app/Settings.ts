import { DEFAULT_TAGS } from '@features/AutoTag/Constants';
import { SettingsUpdate } from './types';

export const Settings = {
  lastGlobalInactivityTime: '5',
  lastGlobalTrackings: [],
  lastRemovedGlobalTrackings: [],
  isCleanEnviroment: false,
  prodKey: ['prd', 'prod'],
  hmgKey: ['hmg'],
  betaKey: ['beta'],
  devKey: ['dev'],
  personalSnippets: [],
  personalTags: DEFAULT_TAGS,
  isAutoTagActive: false,
  language: 'ptbr',
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

export const mergeSettings = (newSettings: Partial<typeof Settings>): void => {
  Object.assign(Settings, newSettings);
};

export const setDevModeSettings = (
  devModeSetting: DevModeKeys,
  newDevModeValue: boolean
): void => {
  Settings.devMode[devModeSetting] = newDevModeValue;
  setSettings(Settings);
};

export const setSettings = (newSettings: Partial<typeof Settings>): void => {
  mergeSettings(newSettings);

  const isFromServer = Boolean(chrome && chrome.storage);

  const settingsUpdate: SettingsUpdate = {
    isSettingsUpdate: true,
    newSettings: Settings,
    isFromClient: !isFromServer,
  };

  if (isFromServer) {
    chrome.storage.sync.set({ settings: Settings });
  }

  window.postMessage(settingsUpdate, '*');
};
