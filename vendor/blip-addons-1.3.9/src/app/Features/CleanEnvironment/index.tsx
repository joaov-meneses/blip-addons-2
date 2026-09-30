import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BaseFeature } from '@features/BaseFeature';
import { CleanButton } from './CleanButton';
import { Settings } from '~/Settings';
import { HomeItem } from './HomeItem';
import { HOME_ITEM_ID } from '~/Constants';

const BLIPS_BUTTON_ID = 'blips-clean-button';

export class CleanEnvironment extends BaseFeature {
  public static shouldRunOnce = true;

  private getIconButton(): HTMLElement {
    return document.getElementById(BLIPS_BUTTON_ID);
  }

  private getMainNavbar(): HTMLElement {
    return document.querySelector('.main-navbar-content, .main-header-top ');
  }

  private getBuilderContainer(): HTMLElement {
    return document.querySelector('.builder-container');
  }

  private getSubheader(): HTMLElement {
    return document.querySelector('.main-subheader');
  }

  private cleanEnvironment = (): void => {
    this.fixContainer();
    this.addHomeItem();
    this.hideNavbar();
  };

  private showNavbar(): void {
    const mainNavbar = this.getMainNavbar();
    const hasNavbar = !!mainNavbar;

    if (hasNavbar) {
      mainNavbar.style.display = 'block';
    }
  }

  private hideNavbar(): void {
    const mainNavbar = this.getMainNavbar();
    const hasNavbar = !!mainNavbar;

    if (hasNavbar) {
      mainNavbar.style.display = 'none';
    }
  }

  private fixContainer(): void {
    const builderContainer = this.getBuilderContainer();
    const hasBuilderContaner = !!builderContainer;

    if (hasBuilderContaner) {
      const canvasWrapper = builderContainer.querySelector('div');
      const canvas = document.querySelector('#canvas');
      const hasCanvas = canvas && canvasWrapper;

      if (hasCanvas) {
        canvas.classList.add('h-100');
        canvasWrapper.classList.add('h-100');
        builderContainer.style.height = 'calc(100vh - 56px)';
      }
    }
  }

  private addHomeItem(): void {
    const subheader = this.getSubheader();
    const hasSubheader = !!subheader;

    if (hasSubheader) {
      const isHomeNotAdded = !document.getElementById(HOME_ITEM_ID);

      if (isHomeNotAdded) {
        const homeItem = document.createElement('div');

        homeItem.classList.add('horizontal-menu-item');
        ReactDOM.render(<HomeItem />, homeItem);
        subheader.prepend(homeItem);
      }
    }
  }

  private removeHomeItem(): void {
    const homeItem = document.getElementById(HOME_ITEM_ID);
    const hasHomeItem = !!homeItem;

    if (hasHomeItem) {
      homeItem.remove();
    }
  }

  private undo = (): void => {
    this.showNavbar();
    this.removeHomeItem();
  };

  public handle(): boolean {
    if (!this.getIconButton()) {
      const classIdentifierToSidebarButton =
        '.icon-button-list, .builder-icon-button-list';

      const buttonsList = document.querySelectorAll(
        classIdentifierToSidebarButton
      );

      const tryGetFirstOrSecondButton = buttonsList[1] || buttonsList[0];

      if (tryGetFirstOrSecondButton) {
        const blipsDiv = document.createElement('div');

        blipsDiv.setAttribute('id', BLIPS_BUTTON_ID);
        ReactDOM.render(
          <CleanButton clean={this.cleanEnvironment} undo={this.undo} />,
          blipsDiv
        );
        tryGetFirstOrSecondButton.appendChild(blipsDiv);

        if (Settings.isCleanEnviroment) {
          this.cleanEnvironment();
        }

        return false;
      }
    }

    return true;
  }

  /**
   * Removes the functionality to clean environment
   */
  public cleanup(): void {
    const blipsButton = document.getElementById(BLIPS_BUTTON_ID);
    this.undo();

    if (blipsButton) {
      blipsButton.remove();
    }
  }
}
