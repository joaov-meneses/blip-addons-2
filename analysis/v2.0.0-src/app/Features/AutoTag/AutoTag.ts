import { BaseFeature } from '@features/BaseFeature';
import { Settings } from '~/Settings';
import { getController, getEditingBlock, interceptFunction } from '~/Utils';
import { updateTags } from './tagsHandler';

export class AutoTag extends BaseFeature {
  public static shouldRunOnce = true;
  private blockId: string;
  private rememberBlock = (): void => { this.blockId = getEditingBlock()?.id; };
  private updateBlock = (): void => {
    if (Settings.isAutoTagActive && this.blockId && getController()?.flow?.[this.blockId]) {
      updateTags(this.blockId);
    }
  };
  public handle(): boolean {
    // Preserve the original sidebar functions and the integration module's wrappers.
    interceptFunction('debouncedEditState', this.rememberBlock);
    interceptFunction('closeSidebar', this.updateBlock);
    return true;
  }
  public cleanup(): void { this.blockId = undefined; }
}
