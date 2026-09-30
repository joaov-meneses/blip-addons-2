import { v4 as uuid } from 'uuid';

import { BaseFeature } from '../BaseFeature';
import {
  cleanCopiedStates,
  cleanSelectedNodes,
  createNearbyPosition,
  getBotId,
  getFlow,
  selectBlock,
  showSuccessToast,
} from '~/Utils';
import type { BlipsCopy } from '~/types';

export class PasteBlock extends BaseFeature {
  public static shouldRunOnce = true;
  private cachedIds = new Map<string, string>();
  private static wasAdded = false;

  /**
   * Returns a new uuid for the id
   *
   * @param id The id
   */
  private getIdFor(id: string): string {
    if (this.cachedIds.has(id)) {
      return this.cachedIds.get(id);
    }

    const newId = uuid();
    this.cachedIds.set(id, newId);
    return newId;
  }

  private handlePaste = (event: ClipboardEvent): void => {
    const flow = getFlow();
    const clipboardData = event.clipboardData.getData('text');
    const blipsCopy = JSON.parse(clipboardData);

    if (isCopyFromBlips(blipsCopy)) {
      /**
       * Don't copy if it's the same bot, as blip automatically deals
       * with it
       */
      const isSameBot = blipsCopy.originBot === getBotId();

      if (isSameBot) {
        return;
      }

      cleanCopiedStates();
      cleanSelectedNodes();

      const blocks = JSON.parse(blipsCopy.blocksCode);

      if (blocks.length > 0) {
        this.normalizeBlocksPosition(blocks);

        /**
         * Adds all the blocks to the flow, if the block already
         * exists in canvas, then tranverse the block replacing
         * the ids
         */
        for (const block of blocks) {
          this.transverseBlock(block);
          flow[block.id] = block;
          selectBlock(block.id);
        }

        /**
         * After including all the block into the flow, we need
         * to check if they're still valid
         */
        for (const block of blocks) {
          this.treatBlock(block);
        }

        showSuccessToast('Bloco(s) colado(s) com sucesso');
      }
    }

    this.cachedIds.clear();
  };

  /**
   * Returns if the block exists
   */
  public hasBlock(id: string): boolean {
    const existingBlocksId = Object.keys(getFlow());

    return existingBlocksId.includes(id);
  }

  /**
   * Normalizes the position of the blocks
   *
   * @param blocks The blocks
   */
  public normalizeBlocksPosition(blocks: any[]): void {
    const allLefts = blocks.map((block) => parseInt(block.$position.left));
    const allTops = blocks.map((block) => parseInt(block.$position.top));

    const maxLeft = Math.max(...allLefts);
    const minLeft = Math.min(...allLefts);

    const maxTop = Math.max(...allTops);
    const minTop = Math.min(...allTops);

    const middleLeft = maxLeft - minLeft / 2;
    const middleTop = maxTop - minTop / 2;
    const nearbyPosition = createNearbyPosition();

    for (const block of blocks) {
      block.$position.left =
        parseInt(block.$position.left) -
        middleLeft +
        parseInt(nearbyPosition.left) +
        'px';

      block.$position.top =
        parseInt(block.$position.top) -
        middleTop +
        parseInt(nearbyPosition.top) +
        'px';
    }
  }

  /**
   * Treats the block by applying verifications, corrections
   * and
   *
   * @param block The block
   */
  private treatBlock(block: any): void {
    const outputs = [...block.$conditionOutputs, block.$defaultOutput];
    let isInvalid = false;

    for (const output of outputs) {
      if (!this.hasBlock(output.stateId)) {
        isInvalid = true;
        output.$invalid = true;
        delete output.stateId;
      }
    }

    if (isInvalid) {
      block.$invalid = true;
      block.invalidOutputs = true;
    }
  }

  /**
   * Transverse the block replacing its ids
   *
   * @param block The block
   */
  public transverseBlock(block: any): void {
    const keys = Object.keys(block);

    for (const key of keys) {
      const isNestedObject =
        typeof block[key] === 'object' && block[key] != null;

      if (isNestedObject) {
        this.transverseBlock(block[key]);
      } else {
        const isId = ['id', '$id', 'stateId'].includes(key);

        if (isId) {
          const blockId = block[key];
          const isExistingBlock = this.hasBlock(blockId);
          const isDefaultBlock = this.isDefaultBlock(blockId);

          if (isExistingBlock && !isDefaultBlock) {
            block[key] = this.getIdFor(block[key]);
          }
        }
      }
    }
  }

  /**
   * Returns if the block is a default block
   *
   * @param id The id of the block
   */
  private isDefaultBlock(id: string): boolean {
    const defaultBlocks = ['onboarding', 'fallback'];

    return defaultBlocks.includes(id);
  }

  /**
   * Adds the functionality of pasting the block
   */
  public handle(): void {
    if (!PasteBlock.wasAdded) {
      document.body.addEventListener('paste', this.handlePaste);

      PasteBlock.wasAdded = true;
    }
  }

  /**
   * Removes the functionality of pasting the block
   */
  public cleanup(): void {
    document.body.removeEventListener('paste', this.handlePaste);
  }
}

const isCopyFromBlips = (data: any): data is BlipsCopy =>
  !!data.isCopyFromBlips;
