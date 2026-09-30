import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  ConfirmationAlert,
  ConfirmationAlertProps,
} from '@features/RemoveGlobalTrackings/ConfirmationAlert';
import { OVERLAY_ID } from './Constants';
import { postBridgeMessage } from './Bridge';
import type { FeatureRequest, BlipFlowBlock, BlipAction } from './types';
import { VariantType } from 'blip-ds/dist/types/components/toast/toast-interface';

const BUILDER_HTML_BLOCK_TAG = 'builder-node';

export const getController = (): any => {
  const canvas = document.querySelector('#canvas');

  return canvas && window.angular ? window.angular.element(canvas).controller() : undefined;
};

export const getFlow = (): any => {
  return getController().flow;
};

export const getSelectedNodes = (): string[] => {
  return getController().selectedNodes.map(n => n.id);
};

export const getBlocks = (): BlipFlowBlock[] => {
  return Object.values(getFlow());
};

export const getBlockById = (id: string): BlipFlowBlock => {
  return getFlow()[id];
};

export const getEditingBlock = (): BlipFlowBlock => {
  return getController().editingState;
}  

export const showSuccessToast = (message: string): void => {
  getController().ngToast.success(message);
};

export const showWarningToast = (message: string): void => {
  getController().ngToast.warning(message);
};

export const showDangerToast = (message: string): void => {
  getController().ngToast.danger(message);
};

export const cleanCopiedStates = (): void => {
  getController().copiedStates = [];
};

export const selectBlock = (id: string): void => {
  let attempts = 0;
  const watchNode = setInterval(() => {
    if (++attempts > 100 || !getController()) { clearInterval(watchNode); return; }
    const node = document.querySelector(`builder-node[id="${id}"]`);

    if (node) {
      getController().selectNode(node);
      clearInterval(watchNode);
    }
  }, 50);
};

export const getUniqActions = (block: BlipFlowBlock): string[] => {
  const allActions = getAllActions(block);
  const typeActions = allActions.map((action) => action.type);

  return [...new Set(typeActions)];
};

export const getAllActions = (block: BlipFlowBlock): BlipAction[] => {
  const enteringActions = block.$enteringCustomActions;
  const leavingActions = block.$leavingCustomActions;

  return [...enteringActions, ...leavingActions];
};

export const cleanSelectedNodes = (): void => {
  getController().selectedNodes = [];
};

export const switchBlipFunction = (
  functionToSwap: string,
  surrogateFunction: () => void
): void => {
  const controller = getController();

  controller[functionToSwap] = function keepThis() {
    return setTimeout(() => surrogateFunction());
  };
};

const interceptions = new WeakMap<object, Map<string, Set<() => void>>>();

export const interceptFunction = (
  functionName: string,
  callback: () => void
): void => {
  const controller = getController();
  if (!controller || typeof controller[functionName] !== 'function') return;
  let methods = interceptions.get(controller);
  if (!methods) { methods = new Map(); interceptions.set(controller, methods); }
  const registered = methods.get(functionName);
  if (registered) { registered.add(callback); return; }
  const callbacks = new Set([callback]);
  methods.set(functionName, callbacks);
  const functionToWrap = controller[functionName];

  controller[functionName] = function keepThis(...args: any[]) {
    const result = functionToWrap.apply(this, args);

    setTimeout(() => callbacks.forEach(callback => callback()));

    return result;
  };
};

export const convertToHours = (waitingTime: number): string => {
  const waitingHours = Math.floor(waitingTime / 60);
  const waitingMinutes = waitingTime % 60;

  return `${waitingHours}:${waitingMinutes}`;
};

export const requestFeature = (
  code: string,
  type: 'cleanup' | 'run',
  ...args
): void => {
  const message: FeatureRequest = {
    isFeatureRequest: true,
    type,
    code,
    args,
  };

  postBridgeMessage(message);
};

export const getBotName = (): string | false => {
  const controller = getController();

  if (controller) {
    const botName = controller.application.name;
    return botName;
  }

  const botName = document.querySelector(
    '.bot-name:nth-child(1)'
  ) as HTMLElement;

  if (botName) {
    return botName.innerText;
  }

  return false;
};

export const getBotId = (): string => {
  const controller = getController();

  if (controller.application && controller.application.shortName) {
    return controller.application.shortName;
  }

  return '';
};

export const getRandom = (max: number): number =>
  Math.floor(Math.random() * max);

export const createNearbyPosition = (): { left: string; top: string } => {
  const canvas = document.querySelector('#canvas') as HTMLElement;

  const left = `${
    getRandom(200) + canvas.scrollLeft + canvas.offsetWidth / 2
  }px`;
  const top = `${
    getRandom(100) + canvas.scrollTop + canvas.offsetHeight / 2
  }px`;

  return {
    left,
    top,
  };
};

export const getSpace = (): any => {
  return getController().g2p;
};

export const getHandleOnKeyDown = (): any => {
  return getController().handleOnKeyDown;
};

export const getFlowBlockById = (id: string): HTMLElement => {
  return document.querySelector(`${BUILDER_HTML_BLOCK_TAG}[id="${id}"]`);
};

export const getAllFlowBlock = (): NodeListOf<Element> => {
  return document.querySelectorAll(`${BUILDER_HTML_BLOCK_TAG}`);
};

export const rgbToHex = (r: any, g: any, b: any): string =>
  '#' +
  [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');

export const hexToRgb = (hex: string): any => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const getContrastColor = (color: any): string => {
  const yiq = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;

  return yiq >= 128 ? '#000' : '#fff';
};

export const createOverlay = (): HTMLElement => {
  let overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    return overlay;
  }

  overlay = document.createElement('div');

  overlay.id = OVERLAY_ID;
  overlay.style.position = 'absolute';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.top = '0';

  return overlay;
};

export const createConfirmationAlert = (
  props: ConfirmationAlertProps
): void => {
  const overlay = createOverlay();
  const alert = document.createElement('div');

  ReactDOM.render(<ConfirmationAlert {...props} />, alert);

  overlay.appendChild(alert);
  document.body.appendChild(overlay);
};

export const removeOverlay = (): void => {
  const overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    document.getElementById(OVERLAY_ID).remove();
  }
};

type ToastProps = {
  toastText: string;
  toastTitle: string;
  variant: VariantType;
  duration?: number;
};

export const createToast = ({
  toastText,
  toastTitle,
  variant,
  duration = 1,
}: ToastProps): void => {
  const toast = document.createElement('bds-toast');

  document.querySelector('.toast-container').appendChild(toast);

  toast.create({
    buttonText: 'Ok',
    actionType: 'icon',
    buttonAction: 'close',
    toastText,
    toastTitle,
    variant,
    duration: duration,
    position: 'top-left',
  });
};
