import { BaseFeature } from '../BaseFeature';
import { getBlocks, showSuccessToast, showWarningToast } from '~/Utils';
import { BlipFlowBlock, BlipAction } from '~/types';

const BLIP_TRACKING_ACTION_NAME = 'TrackEvent';

export class SetGlobalTrackings extends BaseFeature {
  public static isUserTriggered = true;

  /**
   * Sets the global trackings for all the blocks
   *
   * @param shouldDeleteCurrentExtras Should you keep the trackings that have already been defined
   * @param customExtras The trackings that will be setted
   */
  public handle(customExtras: any, shouldDeleteCurrentExtras: boolean): void {
    const blocks = getBlocks();
    const blocksWithTrackingAction = this.getActionsWithTrackingEvent(blocks);
    let blocksUpdated = 0;

    for (const blockWithTracking of blocksWithTrackingAction) {
      if (shouldDeleteCurrentExtras) {
        blockWithTracking.settings.extras = customExtras;
      } else {
        Object.assign(blockWithTracking.settings.extras, customExtras);
      }

      ++blocksUpdated;
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
