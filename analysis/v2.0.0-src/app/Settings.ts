import { DEFAULT_TAGS } from '@features/AutoTag/Constants';
import { SettingsUpdate } from './types';
import { postBridgeMessage } from './Bridge';

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
  isAutoTagActive: false
};

export const mergeSettings = (newSettings: Partial<typeof Settings>): void => {
  if (!newSettings || typeof newSettings !== 'object') return;
  for (const key of Object.keys(Settings)) {
    const value = newSettings[key];
    if (Array.isArray(Settings[key]) ? Array.isArray(value) : typeof value === typeof Settings[key]) {
      Settings[key] = value;
    }
  }
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
