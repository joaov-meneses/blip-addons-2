export const BRIDGE_CHANNEL = 'blip-addons-2';

export const postBridgeMessage = (message: object): void => {
  window.postMessage({ ...message, channel: BRIDGE_CHANNEL }, window.location.origin);
};

export const isBridgeMessage = (event: MessageEvent): boolean =>
  event.source === window && event.origin === window.location.origin &&
  event.data !== null && typeof event.data === 'object' &&
  event.data.channel === BRIDGE_CHANNEL;
