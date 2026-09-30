import ReactDOM from 'react-dom';
import { FlowComment } from '~/types';
import { getBlockById, getHTMLOfBlockById, isDeskBlock } from '~/Utils';
import { BdsIcon } from 'blip-ds/dist/blip-ds-react';
import {
  COMMENT_ICON_CUSTOM_DIV_CLASS,
  ONBOARDING_BLOCK_ID,
} from './Constants';
import React from 'react';

export const onEditComment = (comment: FlowComment): void => {
  const onboardingBlock = getBlockById(ONBOARDING_BLOCK_ID);
  onboardingBlock.addonsComments[comment.id] = comment;
};

export const onRemoveComment = (commentId: string): void => {
  const onboardingBlock = getBlockById(ONBOARDING_BLOCK_ID);
  const commentsObj = onboardingBlock?.addonsComments;
  const commentRemoved = commentsObj[commentId];
  if(!commentRemoved){
    return;
  }
  // Delete comment from addonsComments Object on onboarding block
  delete commentsObj[commentId];
  // Remove commentId from Blocks comments list
  for (const blockId of commentRemoved.blocksIdList) {
    const block = getBlockById(blockId);
    block.addonsSettings.commentsIdList =
      block?.addonsSettings?.commentsIdList.filter(
        (c: string) => c !== commentId
      );
    if (block.addonsSettings.commentsIdList.length === 0) {
      removeStyleOfCommentOnHTMLBlockById(blockId);
    }
  }
};

export const addStyleOfCommentOnHTMLBlockById = (id: string): void => {
  if(isDeskBlock(id)){
    return;
  }
  const blipHTMLNode = getHTMLOfBlockById(id);
  const containerDiv = blipHTMLNode.querySelector('.builder-node-container');
  const contentDiv = containerDiv.querySelector(
    "div[ng-if^='!$ctrl.isSubflowBlock']"
  );
  const hasStyleOfComment = contentDiv.querySelector(
    `div[prop^='${COMMENT_ICON_CUSTOM_DIV_CLASS}'`
  );
  if (hasStyleOfComment) {
    return;
  }
  const customDiv = document.createElement('div');
  // Class attribute that customizes the icon correctly in the block
  customDiv.setAttribute('class', 'desk-opt');
  customDiv.setAttribute('prop', COMMENT_ICON_CUSTOM_DIV_CLASS);
  ReactDOM.render(<BdsIcon size="small" name="user-engaged" />, customDiv);
  contentDiv.appendChild(customDiv);
};

export const removeStyleOfCommentOnHTMLBlockById = (id: string): void => {
  const blipHTMLNode = getHTMLOfBlockById(id);
  const containerDiv = blipHTMLNode.querySelector('.builder-node-container');
  const contentDiv = containerDiv.querySelector(
    "div[ng-if^='!$ctrl.isSubflowBlock']"
  );
  const customDiv = contentDiv.querySelector(
    `div[prop^='${COMMENT_ICON_CUSTOM_DIV_CLASS}'`
  );
  if(customDiv){
    contentDiv.removeChild(customDiv);
  }
};
