import { BaseFeature } from '@features/BaseFeature';
import { Settings } from '~/Settings';

import {
  BLIP_HOME_IDENTIFIER,
  CONTACT_LIST_CONTAINER,
  NEW_CONTACTS_QUANTITY,
  PAGINATION_DROPDOWN_ELEMENT,
  PAGINATION_ELEMENT_CONTAINER,
  PAGINATION_SELECTED_ITEM,
  ROUTER_TYPE_IDENTIFIER,
} from './Constants';

export class FilterOnlyRouters extends BaseFeature {
  public static shouldAlwaysClean = true;

  private getContactListHeader(): HTMLElement {
    const container = document.querySelector(
      CONTACT_LIST_CONTAINER
    ) as HTMLElement;

    return container;
  }

  private getPaginationElement(): HTMLElement {
    const container = document.querySelector(
      PAGINATION_ELEMENT_CONTAINER
    ) as HTMLElement;

    return container;
  }

  private getDropdownPageQuantityElements(
    completelyPaginationElement
  ): HTMLElement {
    const dropdownPageQuantityElements = completelyPaginationElement?.shadowRoot
      ?.querySelector(PAGINATION_DROPDOWN_ELEMENT)
      ?.querySelector(PAGINATION_SELECTED_ITEM);

    return dropdownPageQuantityElements;
  }

  public handle(): void {
    // ...
  }

  private get onlyRoutersIsActive(): boolean {
    return Settings.devMode.onlyRouters;
  }

  private get isOnApplicationPath(): boolean {
    const isOnApplicationPath =
      window.location.pathname == BLIP_HOME_IDENTIFIER;
    return isOnApplicationPath;
  }

  private getOnlyRouters(contactListController): [] {
    if (contactListController?.applicationsBuffer) {
      const onlyRoutersList = contactListController.applicationsBuffer.filter(
        (everyContact) => everyContact.template == ROUTER_TYPE_IDENTIFIER
      );

      return onlyRoutersList;
    }
    return [];
  }

  private checkNeedUpdateRoutersOnApplicationsBuffer(
    applicationsBuffer: [],
    onlyRoutersList: []
  ): boolean {
    try {
      const actualApplicationsBufferLength = applicationsBuffer.length;

      const onlyRoutersListLength = onlyRoutersList.length;

      const needUpdateRoutersOnApplicationsBuffer =
        actualApplicationsBufferLength != onlyRoutersListLength;

      return needUpdateRoutersOnApplicationsBuffer;
    } catch (error) {}
    return false;
  }

  private setRoutersOnApplicationBuffer(
    contactListController,
    onlyRoutersList: []
  ): void {
    contactListController.applicationsBuffer = onlyRoutersList;

    const completelyPaginationElement = this.getPaginationElement();

    const dropdownPageQuantityElements = this.getDropdownPageQuantityElements(
      completelyPaginationElement
    );
    if (dropdownPageQuantityElements) {
      dropdownPageQuantityElements.setAttribute(
        'value',
        `${NEW_CONTACTS_QUANTITY}`
      );
    }
  }

  private setNewItemPerPageQuantity(contactListController): void {
    if (contactListController) {
      contactListController.onChangeItemPerPage(NEW_CONTACTS_QUANTITY);
    }
  }

  public cleanup(): any {
    if (this.onlyRoutersIsActive) {
      if (this.isOnApplicationPath) {
        const contactListElement = this.getContactListHeader();

        const angularElement = window.angular.element(contactListElement);

        const contactListController = angularElement.controller();

        const onlyRoutersList = this.getOnlyRouters(contactListController);

        const needUpdateRoutersOnApplicationsBuffer =
          this.checkNeedUpdateRoutersOnApplicationsBuffer(
            contactListController?.applicationsBuffer,
            onlyRoutersList
          );

        if (needUpdateRoutersOnApplicationsBuffer) {
          this.setRoutersOnApplicationBuffer(
            contactListController,
            onlyRoutersList
          );
        }
        this.setNewItemPerPageQuantity(contactListController);
      }
    }
  }
}
