import { BaseFeature } from '@features/BaseFeature';
import { getBlocks } from '~/Utils';
export { ColorBlockOption } from './ColorBlockOption';
import { getHTMLOfBlockById } from '~/Utils';
import { colorBlockBackground } from '../BlipBlocksFunctions';

export class ChangeBlockColor extends BaseFeature {
  public static shouldRunOnce = true;

  private colorAllBlocks(): void {
    const blocks = getBlocks();

    for (const block of blocks) {
      if (block.addonsSettings && block.addonsSettings.backgroundColor) {
        const flowBlock = getHTMLOfBlockById(block.id);
        colorBlockBackground(block.addonsSettings.backgroundColor, flowBlock);
      }
    }
  }

  public handle(): boolean {
    this.colorAllBlocks();
    return true;
  }
}
