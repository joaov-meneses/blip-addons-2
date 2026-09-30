import * as ReactDOM from 'react-dom';
import React from 'react';
import { BaseFeature } from '@features/BaseFeature';

import {
  BDS_BUTTONS_IDENTIFIER,
  BDS_TYPO_IDENTIFIER,
  DOM_PROPERTIES,
  FLAG_CLASS,
  RESOURCE_ACTIONS_CLASS,
  RESOURCE_CONTENT_PATH,
  RESOURCE_ITEM_CLASS,
  RESOURCE_ITEM_CONTENT_CLASS,
  RESOURCE_ITEM_KEY_CLASS,
} from './Constants';

import { CopyContentIcon } from './CopyContentIcon';

export class AddResourceFunctionalities extends BaseFeature {
  public static shouldAlwaysClean = true;

  private getHTMLElement(
    selector: string,
    element: void | HTMLElement
  ): HTMLElement {
    const checkedElement = element || document;

    const container = checkedElement.querySelector(selector) as HTMLElement;

    return container;
  }

  private hasElementToCheckExec(element: HTMLElement): boolean {
    const hasSpamFromCheck = this.getHTMLElement(`.${FLAG_CLASS}`, element);

    return hasSpamFromCheck ? true : false;
  }

  private get isOnResourceContentPath(): boolean {
    const isOnHomePath = window.location.pathname.endsWith(
      RESOURCE_CONTENT_PATH
    );
    return isOnHomePath;
  }

  public handle(): void {}

  private createCopyButtonInElementReturnTextContent(
    element: HTMLElement,
    targetElementClass: string,
    resourceKeyName: string | void
  ): string {
    const resourceHtmlTarget = this.getHTMLElement(targetElementClass, element);

    const resourceElementData =
      resourceHtmlTarget.querySelectorAll(BDS_TYPO_IDENTIFIER);

    const elementTitle = resourceElementData[0];
    const elementContent = resourceElementData[1];

    const { type, genericClassIdentifier } = DOM_PROPERTIES.button.copy;

    const shadowRootData = elementTitle.shadowRoot.querySelector(type);

    const copyButtonProps = {
      targetElement: element,
      keyName: resourceKeyName || elementContent.innerText.trim(),
      className: targetElementClass,
      needGetContentByKey: resourceKeyName ? true : false,
    };
    const copyButtonElement = document.createElement(type);

    copyButtonElement.id = `container${genericClassIdentifier}`;

    ReactDOM.render(
      <CopyContentIcon {...copyButtonProps} />,
      copyButtonElement
    );

    shadowRootData.insertAdjacentElement('afterend', copyButtonElement);

    return elementContent.innerText.trim();
  }

  private injectChangeController(
    element: HTMLElement,
    spamClassName: string
  ): void {
    const injectionFlag = document.createElement(
      DOM_PROPERTIES.changeController.type
    );

    injectionFlag.classList.add(spamClassName);

    injectionFlag.style.display = DOM_PROPERTIES.changeController.display;

    element.appendChild(injectionFlag);
  }

  private changeActionButtons(resourceElement: HTMLElement): void {
    const actionButtons = resourceElement.querySelectorAll(
      BDS_BUTTONS_IDENTIFIER
    );

    const editButtons = actionButtons[0];
    const deleteButton = actionButtons[1];

    editButtons.style.paddingRight = DOM_PROPERTIES.button.edit.paddingRight;

    deleteButton.style.backgroundColor =
      DOM_PROPERTIES.button.delete.backgroundColor;

    deleteButton.style.borderRadius = DOM_PROPERTIES.button.delete.borderRadius;
  }

  public static getContentByKeyName(
    everyElement: HTMLElement,
    keyName: string
  ): string {
    const angularElement = window.angular.element(everyElement);

    const resourceDataController = angularElement.controller();

    const specificDataByKeyName = resourceDataController.contents.find(
      (everyResource) => everyResource.key == keyName
    );

    if (specificDataByKeyName) {
      const dataByContentChecked =
        typeof specificDataByKeyName.content == 'object'
          ? JSON.stringify(specificDataByKeyName.content)
          : specificDataByKeyName.content;

      return dataByContentChecked;
    }
    return '';
  }

  public cleanup(): any {
    if (this.isOnResourceContentPath) {
      const allResourceItems = document.querySelectorAll(RESOURCE_ITEM_CLASS);

      if (allResourceItems) {
        allResourceItems.forEach((everyElement: HTMLElement) => {
          const resourceAction = this.getHTMLElement(
            RESOURCE_ACTIONS_CLASS,
            everyElement
          );

          if (!this.hasElementToCheckExec(resourceAction)) {
            this.injectChangeController(resourceAction, FLAG_CLASS);

            this.changeActionButtons(resourceAction);

            const resourceKeyName =
              this.createCopyButtonInElementReturnTextContent(
                everyElement,
                RESOURCE_ITEM_KEY_CLASS
              );

            this.createCopyButtonInElementReturnTextContent(
              everyElement,
              RESOURCE_ITEM_CONTENT_CLASS,
              resourceKeyName
            );
          }
        });
      }
    }
  }
}
