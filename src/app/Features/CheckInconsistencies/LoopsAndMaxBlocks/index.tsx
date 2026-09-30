import { BaseFeature } from '../../BaseFeature';
import { getFlow } from '~/Utils';
import * as React from 'react';
import { Paragraph } from '~/Components';
import {
  BlipFlowBlock,
  InconsistencyModel,
  BlipBlockOutputCondition,
  BlipContentAction,
  LoopBlocksDetail,
} from '~/types';
import { t } from 'src/i18n';

const MAX_STATES_WITHOUT_INPUT = 35;

export class CheckLoopsOnFlow extends BaseFeature {
  public static isUserTriggered = true;
  public static shouldRunOnce = true;

  /**
   * Check for Loops and Max blocks cascade without input
   */
  public handle(): InconsistencyModel {
    return this.startSearchingForFlowLoops(getFlow());
  }

  private startSearchingForFlowLoops = (flow: any): InconsistencyModel => {
    let loopBlocks = new Set<string>();
    let BlocksWithoutInputCount = 0;
    let message: React.ReactElement;
    let hasInconsistencies = false;

    for (const blockId of Object.keys(flow)) {
      const block = flow[blockId];
      const hasInput = this.getStateInput(block);
      if (!hasInput) {
        for (const output of this.getStateOutputs(block)) {
          loopBlocks.clear();
          BlocksWithoutInputCount = 0;
          const loopFlowSet: any = this.hasStateLoop(
            flow,
            block,
            output,
            loopBlocks,
            BlocksWithoutInputCount
          );
          if (loopFlowSet.loopBlocksFound) {
            loopBlocks = loopFlowSet.loopBlocksFound;
            BlocksWithoutInputCount = loopFlowSet.count;
            break;
          }
        }
      }
      if (loopBlocks.size) {
        break;
      }
    }
    const loopBlocksFound = this.getListBlocks(loopBlocks, flow);
    if (BlocksWithoutInputCount >= MAX_STATES_WITHOUT_INPUT) {
      hasInconsistencies = true;
      message = this.getMaxBlocksCascadeMessage(loopBlocksFound);
    } else if (loopBlocksFound.length > 0) {
      hasInconsistencies = true;
      message = this.getLoopMessage(loopBlocksFound);
    } else {
      hasInconsistencies = false;
      message = this.getSuccessMessage();
    }

    return { message, hasInconsistencies };
  };

  private getLoopMessage = (loopBlocksNameList: string[]): React.ReactElement => {
    return (
      <>
        <h4>{t('checkInconsistencies.loopsAndMaxBlocks.getLoopMessage.title')}</h4>
        <Paragraph>{t('checkInconsistencies.loopsAndMaxBlocks.getLoopMessage.paragraph1')}</Paragraph>

        {this.getHtmlList(loopBlocksNameList)}

        <Paragraph>
          {t('checkInconsistencies.loopsAndMaxBlocks.getLoopMessage.paragraph2Pt1')}
          <br />{t('checkInconsistencies.loopsAndMaxBlocks.getLoopMessage.paragraph2Pt2')}
        </Paragraph>
      </>
    );
  };

  private getMaxBlocksCascadeMessage = (blocksNameList: string[]): React.ReactElement => {
    return (
      <>
        <h4>{t('checkInconsistencies.loopsAndMaxBlocks.getMaxBlocksMessage.title')}</h4>
        <Paragraph>
          {t('checkInconsistencies.loopsAndMaxBlocks.getMaxBlocksMessage.paragraph1')}
        </Paragraph>

        {this.getHtmlList(blocksNameList)}

        <Paragraph>
          {t('checkInconsistencies.loopsAndMaxBlocks.getMaxBlocksMessage.paragraph2')}
        </Paragraph>
      </>
    );
  };

  private getSuccessMessage = (): React.ReactElement => {
    return (
      <>
        <h4>{t('checkInconsistencies.loopsAndMaxBlocks.getSuccessMessage.title')}</h4>
        <Paragraph>{t('checkInconsistencies.loopsAndMaxBlocks.getSuccessMessage.paragraph1')}</Paragraph>
      </>
    );
  };

  private getHtmlList = (blockNamesList: string[]): React.ReactElement => {
    return (
      <ul
        style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: '#607b99' }}
      >
        {blockNamesList.map((text, index) => (
          <li key={index}>{text}</li>
        ))}
      </ul>
    );
  };

  private getListBlocks = (loopBlocksSet: Set<string>, flow: any): string[] => {
    const loopBlocksList = Array.from(loopBlocksSet);

    if (loopBlocksList.length > 0) {
      return [...loopBlocksList, loopBlocksList[0]].map(
        (block) => `${flow[block]?.$title}`
      );
    }
    return [];
  };

  /**
   * Recursive function that detects loops in the flow starting from a given block
   * @param flow The builder flow
   * @param block the current block
   * @param output the next block to be visited
   * @param loopBlocks Set of string with blocks ids in the loop
   * @param count The number of blocks in the loop
   * @returns
   */
  private hasStateLoop = (
    flow: any,
    block: BlipFlowBlock,
    output: BlipBlockOutputCondition,
    loopBlocks: Set<string>,
    count: number
  ): LoopBlocksDetail | boolean => {
    loopBlocks = new Set(loopBlocks);
    if (count >= MAX_STATES_WITHOUT_INPUT) {
      return { loopBlocksFound: loopBlocks, count };
    }
    if (Array.from(loopBlocks).some((s) => s === output.stateId)) {
      return false;
    }
    const outputBlock = flow[output.stateId];
    const outputsOfOutputBlock = this.getStateOutputs(outputBlock);
    if (!outputsOfOutputBlock || outputsOfOutputBlock.length === 0) {
      return false;
    }
    const hasInput = this.getStateInput(outputBlock);
    if (hasInput) {
      return false;
    }
    if (outputsOfOutputBlock.some((o) => o.stateId === block.id)) {
      loopBlocks.add(output.stateId);
      loopBlocks.add(block.id);
      count += 2;
      return { loopBlocksFound: loopBlocks, count };
    }
    loopBlocks.add(output.stateId);
    ++count;
    let nextLoopBlocks;
    if (
      outputsOfOutputBlock.some((nextBlock) => {
        nextLoopBlocks = this.hasStateLoop(flow, block, nextBlock, loopBlocks, count);
        return nextLoopBlocks;
      })
    ) {
      return nextLoopBlocks;
    }
    return false;
  };

  private getStateInput = (block: BlipFlowBlock): BlipContentAction => {
    return block.$contentActions.find((a) => a.input && !a.input.bypass);
  };

  private getStateOutputs = (
    block: BlipFlowBlock
  ): BlipBlockOutputCondition[] => {
    let outputs: BlipBlockOutputCondition[] = block.$conditionOutputs;
    if (block.$defaultOutput) {
      outputs = [...outputs, block.$defaultOutput];
    }
    return outputs;
  };
}
