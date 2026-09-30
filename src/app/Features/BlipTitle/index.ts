import { getBotName } from '~/Utils';
import { BaseFeature } from '../BaseFeature';

const BEHOLDER_TAG = 'take-plugin-bot-beholder';

export class BuilderTitle extends BaseFeature {
  public static shouldRunOnce = true;
  public static shouldAlwaysClean = true;
  public static defaultTitle = 'Blip Portal';

  /**
   * Returns if the current page is Beholder
   */
  public get isBeholder(): boolean {
    const iFrames = Array.from(document.querySelectorAll('iframe'));

    for (const iFrame of iFrames) {
      const source = iFrame.getAttribute('src');

      if (source && source.includes(BEHOLDER_TAG)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Adds title to builder
   */
  public handle(): void {
    const botName = getBotName();

    document.title = `${botName}`;
  }

  /**
   * Adds title to other Blip pages
   */
  public cleanup(): void {
    if (this.isBeholder) {
      document.title = 'Beholder';
    } else {
      const botName = getBotName();

      document.title = botName || BuilderTitle.defaultTitle;
    }
  }
}
