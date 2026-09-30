import { BaseFeature } from '../BaseFeature';
import { getBlocks, showSuccessToast, showWarningToast } from '~/Utils';
import { BlipFlowBlock, BlipAction } from '~/types';

const BLIP_TRACKING_ACTION_NAME = 'TrackEvent';

export class RemoveGlobalTrackings extends BaseFeature {
  public static isUserTriggered = true;

  /**
   * Remove the all defined global tracking in all the blocks
   *
   * @param customExtras The trackings that will be removed
   */
  public handle(customExtras: any): void {
    const blocks = getBlocks();
    const blocksWithTrackingAction = this.getActionsWithTrackingEvent(blocks);

    let blocksUpdated = 0;

    for (const blockWithTracking of blocksWithTrackingAction) {
      let wasBlockUpdated = false;

      for (const extra of customExtras) {
        if (blockWithTracking.settings.extras[extra.key]) {
          wasBlockUpdated = true;
          delete blockWithTracking.settings.extras[extra.key];
        }
      }

      if (wasBlockUpdated) {
        blocksUpdated++;
      }
    }

    if (blocksUpdated > 0) {
      showSuccessToast(`${blocksUpdated} bloco(s) alterado(s)`);
    } else {
      showWarningToast('Nenhum bloco alterado');
    }
  }

  private getActionsWithTrackingEvent = (blocks: BlipFlowBlock[]): any => {
    return blocks.flatMap((block) =>
      this.getAllActions(block).filter(this.isTracking)
    );
  };

  private isTracking = (action: BlipAction): boolean =>
    action.type === BLIP_TRACKING_ACTION_NAME;

  private getAllActions = (block: BlipFlowBlock): BlipAction[] => [
    ...block.$enteringCustomActions,
    ...block.$leavingCustomActions,
  ];
}
