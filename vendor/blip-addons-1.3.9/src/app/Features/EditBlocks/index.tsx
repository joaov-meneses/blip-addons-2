import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { interceptFunctionAndGetReturn } from '~/Utils';
import { BaseFeature } from '../BaseFeature';
import { BlockStyleSidebar } from './BlockStyleSidebar';
import {
  getHTMLOfBlockById,
  getAllFlowBlock,
  getBlockById,
  getContrastColor,
  hexToRgb,
  getSelectedNodes,
} from '~/Utils';
import {
  colorBlockBackground,
  formatShapeBlock,
  Shapes,
  colorBlockText,
} from './BlipBlocksFunctions';
import { EditBlockOption } from './EditBlockOption';
import { ChangeBlockFormat } from './ChangeBlockFormat';
import { ChangeBlockColor } from './ChangeBlockColor';
import { ChangeTextBlockColor } from './ChangeTextColor';
import * as Constants from './Constants';

export class EditBlock extends BaseFeature {
  public static shouldRunOnce = true;
  private idsList = [];

  private getSidebar(): HTMLElement {
    return document.getElementById(Constants.BLIPS_SIDEBAR_ID);
  }

  private restoreBlockStyle = (): void => {
    for (const id of this.idsList) {
      const block = getHTMLOfBlockById(id);
      formatShapeBlock(Shapes.DEFAULT, block);
    }
  };

  private openSidebar = (): void => {
    if (!this.getSidebar()) {
      // Creates and append the sidebar to the dom
      const blipsSidebar = document.createElement('div');

      blipsSidebar.setAttribute('id', Constants.BLIPS_SIDEBAR_ID);
      ReactDOM.render(
        <BlockStyleSidebar
          onEditBackgorundColor={this.onEditBackgorundColor}
          onEditTextColor={this.onEditTextColor}
          onEditShape={this.onEditShape}
          onClose={this.closeSidebar}
          onRestore={this.restoreBlockStyle}
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

  private closeSidebar = (): void => {
    const sidebar = this.getSidebar();

    if (sidebar) {
      sidebar.remove();
    }
  };

  private onEditBackgorundColor = (color: string): void => {
    for (const id of this.idsList) {
      const block = getBlockById(id);
      const flowBlock = getHTMLOfBlockById(id);
      const currentTextColor = hexToRgb(color);
      const newTextColor = getContrastColor(currentTextColor);

      block.addonsSettings = {
        ...block.addonsSettings,
        backgroundColor: color,
      };

      colorBlockBackground(color, flowBlock);
      colorBlockText(newTextColor, flowBlock);
    }
  };

  private onEditTextColor = (color: string): void => {
    for (const id of this.idsList) {
      const block = getBlockById(id);
      const flowBlock = getHTMLOfBlockById(id);

      block.addonsSettings = { ...block.addonsSettings, textColor: color };

      colorBlockText(color, flowBlock);
    }
  };

  private onEditShape = (shape: Shapes): void => {
    for (const id of this.idsList) {
      const block = getBlockById(id);
      const flowBlock = getHTMLOfBlockById(id);

      block.addonsSettings = { ...block.addonsSettings, shape };

      formatShapeBlock(shape, flowBlock);
    }
  };

  public menuOptionElementHandle = (): void => {
    this.idsList = getSelectedNodes();
    this.openSidebar();
  };

  private addEditOptionOnBlockById(id: string): void {
    const menuOptionsList = document.querySelector(
      `${Constants.BUILDER_HTML_BLOCK_TAG}[id="${id}"]:not(.subflow-block) .${Constants.BUILDER_NODE_MENU} .${Constants.CONTEXT_MENU_CLASS}`
    );

    if (menuOptionsList) {
      const editOption = menuOptionsList.querySelector('.edit-block-option');

      if (!editOption) {
        const menuOptionElement = document.createElement('div');

        ReactDOM.render(
          <EditBlockOption onClick={this.menuOptionElementHandle} />,
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

    for (const block of blocks) {
      this.addEditOptionOnBlockById(block.id);
    }
  };

  public handle(): boolean {
    this.addEditOptionInAllBlocks();

    new ChangeBlockFormat().handle();
    new ChangeBlockColor().handle();
    new ChangeTextBlockColor().handle();

    interceptFunctionAndGetReturn('addContentState', () => this.handle());
    interceptFunctionAndGetReturn('duplicateStateObject', () => this.handle());
    interceptFunctionAndGetReturn('addDeskState', () => this.handle());

    return true;
  }

  /**
   * Removes the functionality to copy the block
   */
  public cleanup(): void {
    this.closeSidebar();
  }
}
