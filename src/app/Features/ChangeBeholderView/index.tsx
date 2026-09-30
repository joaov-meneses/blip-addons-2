import { BaseFeature } from '@features/BaseFeature';
import { Settings } from '~/Settings';

import {
  BEHOLDER_CLASS_IDENTIFIER,
  BEHOLDER_PATH_IDENTIFIER,
  BLIP_CHAT_TEST_IDENTIFIER,
  NEW_PADDING_RIGHT_TO_BEHOLDER,
} from './Constants';

export class ChangeBeholderView extends BaseFeature {
  public static shouldAlwaysClean = true;

  public handle(): void {
    // ...
  }

  private beholderContainerElement(): HTMLElement {
    const container = document.querySelector(
      BEHOLDER_CLASS_IDENTIFIER
    ) as HTMLElement;

    return container;
  }

  private get chatTestIsOpen(): boolean {
    const container = document.getElementById(
      BLIP_CHAT_TEST_IDENTIFIER
    ) as HTMLElement;

    return container ? true : false;
  }

  private get isOnBeholderPath(): boolean {
    const isOnBeholderPath = window.location.pathname.endsWith(
      BEHOLDER_PATH_IDENTIFIER
    );
    return isOnBeholderPath;
  }

  private get changePaddingRight(): boolean {
    return Settings.devMode.changeBeholderPaddingRight;
  }

  private setNewPaddingRightOnBeholderElement(
    beholderElement: HTMLElement
  ): void {
    if (this.chatTestIsOpen) {
      beholderElement.style.paddingRight = NEW_PADDING_RIGHT_TO_BEHOLDER;
    } else {
      beholderElement.style.paddingRight = null;
    }
  }

  public cleanup(): any {
    if (this.isOnBeholderPath && this.changePaddingRight) {
      const beholderElement = this.beholderContainerElement();

      if (beholderElement) {
        this.setNewPaddingRightOnBeholderElement(beholderElement);
      }
    }
  }
}
