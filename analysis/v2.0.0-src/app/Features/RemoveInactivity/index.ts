import { BaseFeature } from '../BaseFeature';
import { getBlocks, showSuccessToast, showWarningToast } from '~/Utils';
import { BlipFlowBlock } from '~/types';

const SKIP_BLOCKS = ['onboarding', 'fallback', 'error'];

export class RemoveInactivity extends BaseFeature {
  public static isUserTriggered = true;

  /**
   * Sets the expiration time for all the bots
   *
   * @param expirationTime The expiration time
   */
  public handle(): void {
    const blocks = getBlocks()
      .filter(this.isExpirableBlock)
      .filter(this.hasInput)
      .filter(this.isInputBlock);
    let blocksUpdated = 0;

    for (const block of blocks) {
      const inputAction = this.getInputAction(block);

      if (inputAction.input.expiration) {
        delete inputAction.input.expiration;
        ++blocksUpdated;
      }
    }

    if (blocksUpdated > 0) {
      showSuccessToast(`${blocksUpdated} bloco(s) alterado(s)`);
    } else {
      showWarningToast('Nenhum bloco alterado');
    }
  }

  private isExpirableBlock = (block: BlipFlowBlock): boolean =>
    !SKIP_BLOCKS.includes(block.id);

  private getInputAction = (block: BlipFlowBlock): any =>
    block.$contentActions.find((contentAction) => contentAction['input']);

  private hasInput = (block: BlipFlowBlock): boolean =>
    !!this.getInputAction(block);

  private isInputBlock = (block: BlipFlowBlock): boolean =>
    !this.getInputAction(block).input.bypass;
}
