import { BaseFeature } from '../../BaseFeature';
import {
  createConfirmationAlert,
  getBlocks,
  removeOverlay,
  showSuccessToast,
} from '~/Utils';
import { Paragraph } from '@components';
import { BlipAction, BlipFlowBlock, BlipCondiction, InconsistencyModel } from '../../../types';
import * as React from 'react';
import { BdsButton } from 'blip-ds/dist/blip-ds-react';

const TRACKING_ACTION_NAME = 'TrackEvent';
const EMPTY_STRING = '';
const NOT_EQUAL_CONDITION = 'notEquals';
const NOT_EXISTS_CONDITION = 'notExists';
const DEFAULT_USER_INPUT_VARIABLE = 'input.content';
const DEFAULT_USER_INPUT_SOURCE = 'input';
const DEFAULT_COMPARISON = 'exists';
const DEFAULT_CONDITION_SOURCE = 'context';

export class TrackingsInconsistencies extends BaseFeature {
  /**
   * Check for Inconsistencies on the flow
   */
  public handle(hasToSetVariable: boolean): InconsistencyModel {
    const trackingsWithProblems =
      this.voidableTrackingsHandle(hasToSetVariable);

    return {
      message: this.getTrackingMessage(trackingsWithProblems),
      hasInconsistencies: trackingsWithProblems.length > 0,
    };
  }

  private voidableTrackingsHandle = (isToCorrect: boolean): BlipAction[] => {
    let trackingsWithProblems = [];
    const blocks = getBlocks();

    if (isToCorrect) {
      this.fixVoidableTrackings(blocks);
    } else {
      trackingsWithProblems = this.getVoidableTrackings(blocks);
    }

    return trackingsWithProblems;
  };

  private getVoidableTrackings = (blocks: BlipFlowBlock[]): BlipAction[] => {
    let trackingActionsArray = [];
    const trackingsWithProblems = [];

    for (const block of blocks) {
      trackingActionsArray = this.getTrackingEventActions(block);
      for (const trackingAction of trackingActionsArray) {
        if (this.actionCanBeNull(trackingAction)) {
          trackingsWithProblems.push(trackingAction);
        }
      }
    }
    return trackingsWithProblems;
  };

  private fixVoidableTrackings = (blocks: BlipFlowBlock[]): void => {
    let trackingActionsArray = [];

    for (const block of blocks) {
      trackingActionsArray = this.getTrackingEventActions(block);
      for (const trackingAction of trackingActionsArray) {
        if (this.actionCanBeNull(trackingAction)) {
          this.setVariableExistingCondition(trackingAction);
        }
      }
    }
  };

  private handleSubmit = (): void => {
    createConfirmationAlert({
      onCancel: () => removeOverlay(),
      onConfirm: () => {
        this.handle(true);
        removeOverlay();
        showSuccessToast('Trackings Corrigidas!');
      },
    });
  };

  private getTrackingMessage = (trackingsList: BlipAction[]): React.ReactElement => {
    return (
      <>
        <h4>Trackings</h4>

        {trackingsList.length > 0 ? (
          this.getTrackingsErrorMessage(trackingsList)
        ) : (
          <Paragraph>
            Nenhuma tracking com ação potencialmente nula identificada
          </Paragraph>
        )}
      </>
    );
  };

  private getTrackingsErrorMessage = (trackingsList: BlipAction[]): React.ReactElement => {
    return (
      <>
        <ul
          style={{
            fontSize: '0.875rem',
            marginTop: '0.5rem',
            color: '#607b99',
          }}
        >
          {trackingsList.map((tracking, index) => (
            <li key={index}>
              {tracking.blockName} - {tracking.$title}
            </li>
          ))}
        </ul>

        <Paragraph>
          * Você deve alterar as condições de execução de trackings destes
          blocos para evitar o possíveis erros.
          <br />
          Você pode arrumar esses fluxos automaticamente apertando no botão
          abaixo.
        </Paragraph>

        <BdsButton type="submit" variant="primary" onClick={this.handleSubmit}>
          Corrigir Trackings
        </BdsButton>
      </>
    );
  };

  private actionCanBeNull = (trackingAction: BlipAction): boolean => {
    try {   
      const conditionVariable = this.getTrackingActionVariable(trackingAction);
  
      if (this.hasConditionVariable(conditionVariable)) {
        const processedConditionVariable = conditionVariable
          .replace('}}', '')
          .replace('{{', '');
  
        if (
          processedConditionVariable === DEFAULT_USER_INPUT_VARIABLE &&
          trackingAction?.conditions &&
          !!trackingAction?.conditions?.find(
            (condition) =>
              condition.source === DEFAULT_USER_INPUT_SOURCE &&
              condition.comparison !== NOT_EQUAL_CONDITION &&
              condition.comparison !== NOT_EXISTS_CONDITION
          )
        ) {
          return false;
        }
  
        return trackingAction?.conditions &&
        !trackingAction?.conditions?.find(
          (condition) =>
            condition.comparison !== NOT_EQUAL_CONDITION &&
            condition.comparison !== NOT_EXISTS_CONDITION &&
            condition.variable === processedConditionVariable
        );
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  private setVariableExistingCondition = (trackingAction: BlipAction): void => {
    const conditionVariable = this.getTrackingActionVariable(trackingAction);

    const trackingVariable = conditionVariable
      .replace('{{', '')
      .replace('}}', '');

    const trackingCondition: BlipCondiction = {
      comparison: DEFAULT_COMPARISON,
      source: DEFAULT_CONDITION_SOURCE,
      values: [],
      variable: trackingVariable,
    };

    trackingAction.conditions.push(trackingCondition);
  };

  private getTrackingEventActions = (block: BlipFlowBlock): BlipAction[] => {
    return this.getAllActions(block).filter(this.isTracking);
  };

  private getAllActions = (block: BlipFlowBlock): BlipAction[] => {
    const blockName = block.$title;

    return [
      ...block.$enteringCustomActions.map((action) =>
        this.insertBlockNameOnAction(action, blockName)
      ),
      ...block.$leavingCustomActions.map((action) =>
        this.insertBlockNameOnAction(action, blockName)
      ),
    ];
  };

  private insertBlockNameOnAction = (
    action: BlipAction,
    blockName: string
  ): BlipAction => {
    return { ...action, blockName: blockName };
  };

  private getTrackingActionVariable = (trackingAction: BlipAction): string => {
    const onlyVariableRegex = /^({{[\w@.]+}})$/i;
    const trackingActionVariable = onlyVariableRegex.exec(
      trackingAction.settings.action
    );

    if (trackingActionVariable) {
      return trackingActionVariable[0];
    }

    return EMPTY_STRING;
  };

  private isTracking = (action: BlipAction): boolean =>
    action?.type === TRACKING_ACTION_NAME;

  private hasConditionVariable = (conditionVariable: string): boolean =>
    conditionVariable !== EMPTY_STRING;
}
