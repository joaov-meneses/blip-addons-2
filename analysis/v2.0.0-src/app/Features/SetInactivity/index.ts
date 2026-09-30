import {
  convertToHours,
  getBlocks,
  showSuccessToast,
  showWarningToast,
} from '../../Utils';
import { BaseFeature } from '../BaseFeature';
import { BlipContentAction } from '~/types';

const SKIP_BLOCKS = ['onboarding', 'fallback', 'error'];

export class SetInactivity extends BaseFeature {
  public static isUserTriggered = true;

  /**
   * Sets the expiration time for all the bots
   *
   * @param expirationTime The expiration time
   */
  public handle(expirationTime: number, shouldKeep: boolean): void {
    let blocks = getBlocks()
      .filter(this.isExpirableBlock)
      .filter(this.hasInput)
      .filter(this.isInputBlock);

    if (shouldKeep) {
      blocks = blocks.filter(this.hasExpirationEmpty);
    }

    let blocksUpdated = 0;

    for (const block of blocks) {
      const inputAction = this.getInputAction(block);

      inputAction.input.expiration = convertToHours(expirationTime);
      ++blocksUpdated;
    }

    if (blocksUpdated > 0) {
      showSuccessToast(`${blocksUpdated} bloco(s) alterado(s)`);
    } else {
      showWarningToast('Nenhum bloco alterado');
    }
  }

  private isExpirableBlock = (block): boolean =>
    !SKIP_BLOCKS.includes(block.id);

  private getInputAction = (block): BlipContentAction =>
    block.$contentActions.find((contentAction) => contentAction['input']);

  private hasInput = (block): boolean => !!this.getInputAction(block);

  private isInputBlock = (block): boolean =>
    !this.getInputAction(block).input.bypass;

  private hasExpirationEmpty = (block): boolean =>
    !this.getInputAction(block).input.expiration;
}
