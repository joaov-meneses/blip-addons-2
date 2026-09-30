import {
  getBlocks,
} from '../../Utils';
import { BaseFeature } from '../BaseFeature';
const HTTP_ACTION_TYPE = "ProcessHttp";
const TRACK_EVENT_ACTION_TYPE = "TrackEvent";
const SCRIPT_ACTION_TYPE = "ExecuteScript";

export class BotStatistics extends BaseFeature {
  public static isUserTriggered = true;

  private getNumberOfBlocks = (): number => {
    const blocks = getBlocks();
    return blocks.length;
  }

  private getNumberOfBlocksWithHttpAction = (): number => {
    const blocks = getBlocks();
    return blocks.reduce((count, block) => {
      const actionsArray = block.$enteringCustomActions.concat(block.$leavingCustomActions);
      const httpActionsFiltered = actionsArray.filter(actionsArray => actionsArray.type === HTTP_ACTION_TYPE);
      return count + httpActionsFiltered.length;
    }, 0);
  }

  private getNumberOfUniqueTrackings = (): number => {
    const blocks = getBlocks();
    const uniqueCategories = new Set();
    for (const block of blocks) {
      const actionsArray = block.$enteringCustomActions.concat(block.$leavingCustomActions)
      const trackEventActionsFiltered = actionsArray.filter(actionsArray => actionsArray.type === TRACK_EVENT_ACTION_TYPE);
      for (const action of trackEventActionsFiltered) {
        if (action.settings.category) {
          uniqueCategories.add(action.settings.category);
        }
      }
    }
    return uniqueCategories.size;
  }

  private getNumberOfBlocksWithScripts = (): number => {
    const blocks = getBlocks();
    return blocks.reduce((count, block) => {
      const actionsArray = block.$enteringCustomActions.concat(block.$leavingCustomActions);
      const scriptsActionsFiltered = actionsArray.filter(actionsArray => actionsArray.type === SCRIPT_ACTION_TYPE);
      return count + scriptsActionsFiltered.length;
    }, 0);
  }

  /**
   * Returns an object with some bots statistics, like 
   *
   * @param expirationTime The expiration time
   */
  public handle(): any {
    return {
      numberOfBlocks: this.getNumberOfBlocks(),
      numberOfHttpActions: this.getNumberOfBlocksWithHttpAction(),
      numberOfUniqueTrackings: this.getNumberOfUniqueTrackings(),
      numberOfScriptsAction: this.getNumberOfBlocksWithScripts()
    }
  }
}