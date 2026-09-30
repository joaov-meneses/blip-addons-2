import { BaseFeature } from '@features/BaseFeature';
import { getBlocks } from '~/Utils';
export { TextBlockColorOption } from './TextBlockColorOption';
import { getFlowBlockById } from '~/Utils';
import { colorBlockText } from '../BlipBlocksFunctions';

export class ChangeTextBlockColor extends BaseFeature {
  public static shouldRunOnce = true;

  private colorAllTextBlocks(): void {
    const blocks = getBlocks();

    for (const block of blocks) {
      if (block.addonsSettings && block.addonsSettings.textColor) {
        const flowBlock = getFlowBlockById(block.id);
        colorBlockText(block.addonsSettings.textColor, flowBlock);
      }
    }
  }

  public handle(): boolean {
    this.colorAllTextBlocks();
    return true;
  }
}
