import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { interceptFunction } from '~/Utils';
import { BaseFeature } from '../BaseFeature';
import { BlipsButton } from './BlipAddonsButton';
import { BlipsSidebar } from './BlipsSidebar';

const BLIPS_BUTTON_ID = 'blips-extension-button';
const BLIPS_SIDEBAR_ID = 'blips-extension-sidebar';

export class AddSidebar extends BaseFeature {
  public static shouldRunOnce = true;

  /**
   * Gets the sidebar
   */
  private getSidebar(): HTMLElement {
    return document.getElementById(BLIPS_SIDEBAR_ID);
  }

  /**
   * Gets the icon
   */
  private getIcon(): HTMLElement {
    return document.getElementById(BLIPS_BUTTON_ID);
  }

  /**
   * Opens the sidebar by adding it into the DOM
   */
  private openSidebar = (): void => {
    if (!this.getSidebar()) {
      // Creates and append the sidebar to the dom
      const blipsSidebar = document.createElement('div');

      blipsSidebar.setAttribute('id', BLIPS_SIDEBAR_ID);
      ReactDOM.render(
        <BlipsSidebar onClose={this.closeSidebar} />,
        blipsSidebar
      );

      const mainArea = document.getElementById('main-content-area');
      mainArea.appendChild(blipsSidebar);

      // Waits for a moment and then fades the sidebar in
      const customSidebar = this.getSidebar().children.item(0);
      interceptFunction('closeSidebar', this.closeSidebar);

      setTimeout(() => {
        customSidebar.classList.add('ng-enter-active');
      }, 200);
    } else {
      return this.closeSidebar();
    }
  };

  /**
   * Closes the sidebar by removing it from the DOM
   */
  private closeSidebar = (): void => {
    const sidebar = this.getSidebar();

    if (sidebar) {
      sidebar.children
        .item(0)
        .classList.add('ng-animate', 'ng-leave', 'ng-leave-active');

      setTimeout(() => {
        sidebar.remove();
      }, 200);
    }
  };

  /**
   * Adds the functionality to copy the block
   */
  public handle(): boolean {
    if (!this.getIcon()) {
      const buttonsList = document.querySelector(
        '.icon-button-list, .builder-icon-button-list'
      );
      if (!buttonsList) return false;
      const blipsDiv = document.createElement('div');

      blipsDiv.setAttribute('id', BLIPS_BUTTON_ID);
      ReactDOM.render(<BlipsButton onClick={this.openSidebar} />, blipsDiv);
      buttonsList.appendChild(blipsDiv);

      return true;
    }

    return false;
  }

  /**
   * Removes the functionality to copy the block
   */
  public cleanup(): void {
    const blipsButton = document.getElementById(BLIPS_BUTTON_ID);

    if (blipsButton) {
      blipsButton.remove();
    }

    this.closeSidebar();
  }
}
