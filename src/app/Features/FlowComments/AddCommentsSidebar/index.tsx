import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseFeature } from '../../BaseFeature';
import { FlowCommentsButton } from './FlowCommentsButton';
import { FlowCommentsSidebar } from './FlowCommentsSidebar';
import {
  interceptFunctionAndGetReturn,
  getBlockById,
  resetSearchedStates,
} from '~/Utils';
import { FlowComment } from '~/types';
import { onEditComment, onRemoveComment } from '../FlowCommentsUtils';
import { ONBOARDING_BLOCK_ID } from '../Constants';

const BLIPS_BUTTON_ID = 'flowcomments-button';
const BLIPS_SIDEBAR_ID = 'flowcomments-sidebar';

export class AddFlowCommentsSidebar extends BaseFeature {
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

  private getComments(): FlowComment[] {
    const onboardingBlock = getBlockById(ONBOARDING_BLOCK_ID);
    const commentsObj = onboardingBlock?.addonsComments;
    if (commentsObj) {
      return Object.values(commentsObj);
    } else {
      return [];
    }
  }

  /**
   * Opens the sidebar by adding it into the DOM
   */
  private openSidebar = (): void => {
    if (!this.getSidebar()) {
      // Creates and append the sidebar to the dom
      const blipsSidebar = document.createElement('div');
      const commentsArray = this.getComments();

      blipsSidebar.setAttribute('id', BLIPS_SIDEBAR_ID);

      ReactDOM.render(
        <FlowCommentsSidebar
          onClose={this.closeSidebar}
          commentsList={commentsArray}
          onRemoveComment={onRemoveComment}
          onEditComment={onEditComment}
        />,
        blipsSidebar
      );

      const mainArea = document.getElementById('main-content-area');
      mainArea.appendChild(blipsSidebar);

      // Waits for a moment and then fades the sidebar in
      const customSidebar = this.getSidebar().children.item(0);
      interceptFunctionAndGetReturn('closeSidebar', this.closeSidebar);

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
    resetSearchedStates();

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
          <FlowCommentsButton onClick={this.openSidebar} />,
          blipsDiv
        );
        tryGetFirstOrSecondButton.appendChild(blipsDiv);

        return true;
      }
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
