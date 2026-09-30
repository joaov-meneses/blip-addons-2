import * as RawCommands from './Commands';
import * as RawFeatures from './Features';
import { mergeSettings } from './Settings';
import { isBridgeMessage, postBridgeMessage } from './Bridge';

const Commands = Object.values(RawCommands);
const Features = Object.values(RawFeatures);
const instances = new Map();
const busy = new Set();
let activeCanvas: Element | null = null;
const instanceFor = (Feature) => {
  if (!instances.has(Feature.code)) instances.set(Feature.code, new Feature());
  return instances.get(Feature.code);
};

window.addEventListener('message', async event => {
  if (!isBridgeMessage(event)) return;
  const message = event.data;
  try {
    if (message.isSettingsUpdate && !message.isFromClient) {
      mergeSettings(message.newSettings);
    } else if (message.isBlipsRequest) {
      const Command = Commands.find(Command => Command.code === message.commandCode);
      if (!Command || !Array.isArray(message.args)) return;
      let result = null;
      try { result = await new Command().handle(...message.args); }
      finally { postBridgeMessage({ isBlipsResponse: true, identifier: message.identifier, result }); }
    } else if (message.isFeatureRequest) {
      const Feature = Features.find(Feature => Feature.code === message.code);
      if (!Feature || !Array.isArray(message.args) || busy.has(Feature.code)) return;
      busy.add(Feature.code);
      try {
        if (message.type === 'run') {
          const canvas = document.querySelector('#canvas');
          // A SPA can switch bots without a poll observing the loading screen.
          if (canvas !== activeCanvas) {
            for (const feature of Features) {
              if (instances.has(feature.code)) {
                try { instanceFor(feature).cleanup(); } catch (error) { console.warn('[Blip Addons 2.0]', error); }
              }
              feature.hasRun = false;
              feature.isCleaned = true;
            }
            activeCanvas = canvas;
          }
          if (Feature.canRun && await instanceFor(Feature).handle(...message.args) !== false) {
            Feature.hasRun = true;
            Feature.isCleaned = false;
          }
        } else if (message.type === 'cleanup' && (Feature.shouldAlwaysClean || !Feature.isCleaned)) {
          if (await instanceFor(Feature).cleanup() !== false) {
            Feature.hasRun = false;
            Feature.isCleaned = true;
          }
        }
      } finally { busy.delete(Feature.code); }
    }
  } catch (error) {
    console.warn('[Blip Addons 2.0] Falha em um recurso', message.code || message.commandCode, error);
  }
});

postBridgeMessage({ isHandshake: true });
