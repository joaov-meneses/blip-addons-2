import * as RawCommands from './Commands';
import * as RawFeatures from './Features';
import { Settings } from './Settings';
import type {
  Message,
  BlipsRequest,
  BlipsResponse,
  Command,
  FeatureRequest,
  SettingsUpdate,
  Feature,
} from './types';

const Commands = Object.values(RawCommands);
const Features = Object.values(RawFeatures);
const sendMessage = (message: any): void => window.postMessage(message, '*');

// Sends handshake to extension
sendMessage({ isHandshake: true });

window.addEventListener('message', async (message: Message<any>) => {
  /**
   * Determine if it's a feature request, and properly runs
   * `handle` or `cleanup` functions
   */
  if (isFeatureRequest(message.data)) {
    const { code, type, args } = message.data;
    const Feature = getFeature(code);

    if(!Feature) return;

    /**
     * Runs the feature and update its states, as features may
     * have different settings
     */
    if (type === 'run') {
      if (Feature?.canRun) {
        const featureInstance = new Feature();
        // eslint-disable-next-line prefer-spread
        const handleResult = await featureInstance.handle.apply(
          featureInstance,
          args
        );
        if (handleResult !== false) {
          Feature.hasRun = true;
          Feature.isCleaned = false;
        }
      }

      return;
    }

    /**
     * As features actively change Blip's page, sometimes it's necessary
     * to undo the changes when user leaves the page.
     */
    if (type === 'cleanup') {
      const shouldRun = Feature?.shouldAlwaysClean || !Feature?.isCleaned;
      if (shouldRun) {
        const hasCleaned = await new Feature().cleanup();

        if (hasCleaned !== false) {
          Feature.hasRun = false;
          Feature.isCleaned = true;
        }
      }

      return;
    }
  }

  /**
   * Determine if it's a command request, if it's handles the
   * command and responds
   */
  if (isBlipsRequest(message.data)) {
    const Command: Command = getCommand(message.data.commandCode);

    if (Command) {
      const { identifier, args } = message.data;
      const result = await new Command().handle(...args);

      sendResponse({
        identifier,
        result,
      });

      return;
    }
  }

  /**
   * Check if a settings update request from server
   */
  if (isSettingsUpdate(message.data)) {
    const isFromServer = !message.data.isFromClient;

    if (isFromServer) {
      Object.assign(Settings, message.data.newSettings);
    }

    return;
  }
});

const isFeatureRequest = (request: any): request is FeatureRequest =>
  !!request.isFeatureRequest;
const isBlipsRequest = (request: any): request is BlipsRequest =>
  !!request.isBlipsRequest;
const sendResponse = (message: Omit<BlipsResponse, 'isBlipsResponse'>): void =>
  sendMessage({ isBlipsResponse: true, ...message });
const getFeature = (code): Feature =>
  Features.find((Feature) => Feature.code === code);
const getCommand = (code): Command =>
  Commands.find((Command) => Command.code === code);
const isSettingsUpdate = (message: any): message is SettingsUpdate =>
  message.isSettingsUpdate;
