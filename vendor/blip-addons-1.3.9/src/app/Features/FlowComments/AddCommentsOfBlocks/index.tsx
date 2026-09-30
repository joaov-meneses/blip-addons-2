import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { v4 as uuid } from 'uuid';
import { BaseFeature } from '../../BaseFeature';
import { AddCommentsSidebar } from './AddCommentsSidebar';
import {
  interceptFunctionAndGetReturn,
  getAllFlowBlock,
  getBlockById,
  getSelectedNodes,
  getFlow,
  resetSearchedStates,
  interceptFunctionAndExecuteCallbackBefore,
  getBlocks,
} from '~/Utils';
import { AddCommentOption } from './AddCommentOption';
import * as Constants from './Constants';
import { BlipFlowBlock, FlowComment } from '~/types';
import {
  addStyleOfCommentOnHTMLBlockById,
  onEditComment,
  onRemoveComment,
} from '../FlowCommentsUtils';
import { ONBOARDING_BLOCK_ID } from '../Constants';
import { BlockStyleSidebar } from '@features/EditBlocks/BlockStyleSidebar';

/**
 * For this skill, we save user comments in the block of id "onboarding". In this block,
 * we save an object whose keys are the ids of the comments and the value is an object
 *  of type FlowComment in the variable "addonsComments". In addition, in each commented
 *  block we save the id of the respective comment in the addonsSettings.commentsIdList
 *  variable. In this way, we were able to optimally obtain the comments of each block
 *  and all the comments of the flow, as well as carry out searches and changes.
 */
export class AddCommentsOfBlocks extends BaseFeature {
  public static shouldRunOnce = true;
  private idsList: string[] = [];

  private getSidebar(): HTMLElement {
    return document.getElementById(Constants.ADD_COMMENT_SIDEBAR_ID);
  }

  private openSidebar = (): void => {
    if (!this.getSidebar()) {
      // Creates and append the sidebar to the dom
      const blipsSidebar = document.createElement('div');
      const commentsOfSelectedBlocks = this.getCommentsOfBlocksList(
        this.idsList
      );

      blipsSidebar.setAttribute('id', Constants.ADD_COMMENT_SIDEBAR_ID);
      ReactDOM.render(
        <AddCommentsSidebar
          onCreateComment={this.onCrateComment}
          onClose={this.closeSidebar}
          onEditComment={onEditComment}
          comments={commentsOfSelectedBlocks}
          onRemoveComment={onRemoveComment}
        />,
        blipsSidebar
      );

      const mainArea = document.getElementById(Constants.MAIN_CONTENT_AREA);
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

  private onCrateComment = (text: string): FlowComment => {
    const onboardingBlock = getBlockById(ONBOARDING_BLOCK_ID);
    const newCommentId = uuid();
    const comment: FlowComment = {
      id: newCommentId,
      text: text,
      blocksIdList: this.idsList,
    };

    if (onboardingBlock.addonsComments) {
      onboardingBlock.addonsComments[newCommentId] = comment;
    } else {
      onboardingBlock.addonsComments = {};
      onboardingBlock.addonsComments[newCommentId] = comment;
    }

    for (const id of this.idsList) {
      addStyleOfCommentOnHTMLBlockById(id);
      const block = getBlockById(id);
      if (block?.addonsSettings && block?.addonsSettings?.commentsIdList) {
        block.addonsSettings.commentsIdList.push(newCommentId);
      } else {
        block.addonsSettings = {
          ...block.addonsSettings,
          commentsIdList: [newCommentId],
        };
      }
    }

    return comment;
  };

  private closeSidebar = (): void => {
    const sidebar = this.getSidebar();
    resetSearchedStates();

    if (sidebar) {
      sidebar.remove();
    }
  };

  private getCommentsOfBlocksList = (idBlocksList: string[]): FlowComment[] => {
    const onboardingBlock = getBlockById(ONBOARDING_BLOCK_ID);
    const commentsObj = onboardingBlock?.addonsComments;
    if (onboardingBlock?.addonsComments) {
      const commentsToReturn: FlowComment[] = [];
      for (const blockId of idBlocksList) {
        const currentBlock = getBlockById(blockId);
        const currentCommentsIdList =
          currentBlock?.addonsSettings?.commentsIdList || [];
        for (const commentId of currentCommentsIdList) {
          if (!commentsToReturn[commentId]) {
            commentsToReturn.push(commentsObj[commentId]);
          }
        }
      }
      return commentsToReturn;
    } else {
      return [];
    }
  };

  private addStyleOfCommentOnAllCommentedBlocks = (): void => {
    const flow = getFlow();
    const blocksIdList = Object.entries(flow);
    for (const [blockId, blockContent] of blocksIdList) {
      if (this.hasCommentOnBlock(blockContent)) {
        addStyleOfCommentOnHTMLBlockById(blockId);
      }
    }
  };

  private hasCommentOnBlock = (block: BlipFlowBlock): boolean => {
    return block?.addonsSettings?.commentsIdList?.length > 0;
  };

  private createBlockOptionsDiv(): HTMLElement {
    const blipsDiv = document.createElement('div');
    // blipsDiv.setAttribute('class', Constants.CONTEXT_MENU_OPTION_CLASSES);
    return blipsDiv;
  }

  public menuOptionElementHandle = (): void => {
    this.idsList = getSelectedNodes();
    this.openSidebar();
  };

  private addCommentOptionOnBlockById(id: string): void {
    const menuOptionsList = document.querySelector(
      `${Constants.BUILDER_HTML_BLOCK_TAG}[id="${id}"]:not(.subflow-block) .${Constants.BUILDER_NODE_MENU} .${Constants.CONTEXT_MENU_CLASS}`
    );

    if (menuOptionsList) {
      const editOption = menuOptionsList.querySelector(
        `.${Constants.ADD_COMMENT_CLASS}`
      );

      if (!editOption) {
        const menuOptionElement = this.createBlockOptionsDiv();
        ReactDOM.render(
          <AddCommentOption onClick={this.menuOptionElementHandle} />,
          menuOptionElement
        );
        menuOptionsList.insertBefore(
          menuOptionElement,
          menuOptionsList.children[Constants.DELETE_OPTION_BLOCK_POSITION]
        );
      }
    }
  }

  private addEditOptionInAllBlocks = (): void => {
    const blocks = getAllFlowBlock();
    blocks.forEach((block) => {
      this.addCommentOptionOnBlockById(block.id);
    });
  };

  private resetCommentsOfNewBlock = (block: BlipFlowBlock): void => {
    setTimeout(() => {
      const flow = getFlow();
      if (block.addonsSettings) {
        flow[block.id].addonsSettings.commentsIdList = [];
      }
      this.addCommentOptionOnBlockById(block.id);
    }, 1000);
  };

  private resetCommentsOnDeletBlock = (): void => {
    const selectedNodes = getSelectedNodes();
    const flow = getFlow();
    const onboardingBlock = getBlockById(ONBOARDING_BLOCK_ID);
    const commentsObj = onboardingBlock?.addonsComments;
    selectedNodes.forEach((blockId) => {
      const block = flow[blockId];
      const commentsOfBlock = block?.addonsSettings?.commentsIdList;
      if (commentsOfBlock && commentsOfBlock?.length > 0) {
        commentsOfBlock.forEach((commentId) => {
          const comment = commentsObj[commentId];
          if (comment && comment.blocksIdList.length > 1) {
            comment.blocksIdList = comment.blocksIdList.filter(
              (id) => id !== blockId
            );
          } else {
            delete commentsObj[commentId];
          }
        });
      }
    });
  };

  public handle(): boolean {
    this.addEditOptionInAllBlocks();
    this.addStyleOfCommentOnAllCommentedBlocks();

    interceptFunctionAndGetReturn('addContentState', () => this.handle());
    interceptFunctionAndGetReturn('addDeskState', () => this.handle());

    // Intercepts the duplicateStateObject function and receives the BlipFlowBlock object of the newly created block.
    interceptFunctionAndGetReturn(
      'duplicateStateObject',
      (block: BlipFlowBlock) => this.resetCommentsOfNewBlock(block)
    );

    /* Blip's deleteSelectedState function should return a array with the id of the deleted blocks.
    However, even if more than one block is deleted, the function returns only one id. 
    Therefore, we intercept the blip function and check all selected blocks before the blocks are deleted. */
    interceptFunctionAndExecuteCallbackBefore('deleteSelectedState', () =>
      this.resetCommentsOnDeletBlock()
    );
    return true;
  }

  /**
   * Removes the functionality to copy the block
   */
  public cleanup(): void {
    this.closeSidebar();
  }
}
