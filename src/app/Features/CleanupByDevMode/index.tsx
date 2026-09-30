import { BaseFeature } from '@features/BaseFeature';
import { Settings } from '~/Settings';

import {
  ACTION_AND_CONDITION_DOC_LINK_IDENTIFIER,
  ACTION_AND_CONDITION_TEXT_IDENTIFIER,
  APPLICATION_PATH_IDENTIFIER,
  DEFAULT_OUTPUT_CLASS_IDENTIFIER,
  ENTERING_ACTION_CLASS_IDENTIFIER,
  HIDE_CLASS,
  HOME_BANNER_CLASS_IDENTIFIER,
  LEAVING_ACTION_CLASS_IDENTIFIER,
  LIBRARY_FUNCTIONS_CLASS_IDENTIFIER,
  OUTPUT_CONDITIONS_CLASS_IDENTIFIER,
} from './Constants';

export class CleanupByDevMode extends BaseFeature {
  public static shouldAlwaysClean = true;

  private getHTMLElement(
    selector: string,
    element: void | HTMLElement
  ): HTMLElement {
    const checkedElement = element || document;

    const container = checkedElement.querySelector(selector) as HTMLElement;

    return container;
  }

  private get cleanHeaderOnHomeIsActive(): boolean {
    return Settings.devMode.cleanHeaderOnHome;
  }

  private get actionAndOutputTipsIsActive(): boolean {
    return Settings.devMode.actionAndOutputTips;
  }

  private get hideLibraryFunctionIsActive(): boolean {
    return Settings.devMode.hideLibraryFunction;
  }

  private get isOnHomePath(): boolean {
    const isOnHomePath = window.location.pathname == APPLICATION_PATH_IDENTIFIER;
    return isOnHomePath;
  }

  private changeClassOnActionAndOutput(element: HTMLElement): void {
    if (element) {
      const textElement = this.getHTMLElement(
       ACTION_AND_CONDITION_TEXT_IDENTIFIER,
        element
      );

      this.addHideOnClass(textElement);

      const docLinkElement = this.getHTMLElement(ACTION_AND_CONDITION_DOC_LINK_IDENTIFIER, element);

      this.addHideOnClass(docLinkElement);
    }
  }

  private addHideOnClass(element: HTMLElement): void {
    element?.classList.add(HIDE_CLASS);
  }

  public handle(): void {
    if (this.actionAndOutputTipsIsActive) {
      const enteringActionsElement = this.getHTMLElement(
       ENTERING_ACTION_CLASS_IDENTIFIER
      );

      this.changeClassOnActionAndOutput(enteringActionsElement);

      const leavingActionsElement = this.getHTMLElement(
      LEAVING_ACTION_CLASS_IDENTIFIER
      );

      this.changeClassOnActionAndOutput(leavingActionsElement);

      const outputConditionsElement = this.getHTMLElement(
     OUTPUT_CONDITIONS_CLASS_IDENTIFIER
      );

      this.changeClassOnActionAndOutput(outputConditionsElement);

      const defaultOutputConditionsElement = this.getHTMLElement(
       DEFAULT_OUTPUT_CLASS_IDENTIFIER
      );

      this.changeClassOnActionAndOutput(defaultOutputConditionsElement);
    }

    if (this.hideLibraryFunctionIsActive) {
      const functionLibraryElement = this.getHTMLElement(
      LIBRARY_FUNCTIONS_CLASS_IDENTIFIER
      );
      if (functionLibraryElement) {
        functionLibraryElement.classList.add(HIDE_CLASS);
      }
    }
  }

  public cleanup(): any {
    if (this.cleanHeaderOnHomeIsActive) {
      if (this.isOnHomePath) {
        const functionLibraryElement = this.getHTMLElement(
          HOME_BANNER_CLASS_IDENTIFIER
        );

        if (functionLibraryElement) {
          functionLibraryElement.classList.add(HIDE_CLASS);
        }
      }
    }
  }
}
