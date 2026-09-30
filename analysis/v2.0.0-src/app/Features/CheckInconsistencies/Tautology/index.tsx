import { BaseFeature } from '../../BaseFeature';
import {
  createConfirmationAlert,
  getBlocks,
  removeOverlay,
  showSuccessToast,
} from '~/Utils';
import {
  ConditionActionProblemDetail,
  BlipAction,
  BlipFlowBlock,
  BlipCondiction,
  BlipBlockOutputCondition,
  InconsistencyModel
} from '~/types';
import { Paragraph } from '@components';
import { BdsButton } from 'blip-ds/dist/blip-ds-react';
import * as React from 'react';

const NOT_EQUAL_CONDITION = 'notEquals';
const DEFAULT_CONDITION_SOURCE = 'context';

export class TautologyInconsistencies extends BaseFeature {
  /**
   * Check for Tautology inconsistencies on the flow
   */
  public handle(isToCorrect: boolean): InconsistencyModel {
    const blocks = getBlocks();

    const actionsWithTautology = this.actionsConditionsWithTautologyHandle(
      blocks,
      isToCorrect
    );
    const outputConditionsWithTautology =
      this.outputConditionsWithTautologyHandle(blocks, isToCorrect);

    const hasTautology =
      actionsWithTautology.length > 0 ||
      outputConditionsWithTautology.length > 0;

    return {
      hasInconsistencies: hasTautology,
      message: this.getTautologyMessage(
        actionsWithTautology,
        outputConditionsWithTautology
      ),
    };
  }

  private actionsConditionsWithTautologyHandle = (
    blocks: BlipFlowBlock[],
    isToCorrect: boolean
  ): ConditionActionProblemDetail[] => {
    let actionsWithExecuteConditions: BlipAction[] = [];
    let actionsWithProblems: ConditionActionProblemDetail[] = [];

    for (const block of blocks) {
      actionsWithExecuteConditions =
        this.getActionsWithExecuteConditions(block);

      for (const action of actionsWithExecuteConditions) {
        if (isToCorrect) {
          this.fixActionsCondictionsWithTautology(action);
        } else {
          const condictionsWithTautology =
            this.getActionsCondictionsWithTautologyDetail(action);
          actionsWithProblems = actionsWithProblems.concat(
            condictionsWithTautology
          );
        }
      }
    }

    return actionsWithProblems;
  };

  private outputConditionsWithTautologyHandle = (
    blocks: BlipFlowBlock[],
    isToCorrect: boolean
  ): ConditionActionProblemDetail[] => {
    let outputConditionsWithProblems: ConditionActionProblemDetail[] = [];

    for (const block of blocks) {
      for (const outputCondition of block.$conditionOutputs) {
        if (isToCorrect) {
          this.fixOutputCondictionsWithTautology(outputCondition);
        } else {
          outputConditionsWithProblems = outputConditionsWithProblems.concat(
            this.getOutputCondictionsWithTautology(
              outputCondition,
              block.$title
            )
          );
        }
      }
    }

    return outputConditionsWithProblems;
  };

  private getTautologyMessage = (
    actionsWithTautologyDetails: ConditionActionProblemDetail[],
    outputConditionsWithTautologyDetails: ConditionActionProblemDetail[]
  ): React.ReactElement => {
    return (
      <>
        <h4>Ações com tautologia</h4>
        {actionsWithTautologyDetails.length > 0 ? (
          this.getProblemActionsHtmlList(actionsWithTautologyDetails)
        ) : (
          <Paragraph>Nenhuma tautologia identificada</Paragraph>
        )}

        <h4>Condições de saída com tautologia</h4>
        {outputConditionsWithTautologyDetails.length > 0 ? (
          this.getProblemOutputConditionsHtmlList(
            outputConditionsWithTautologyDetails
          )
        ) : (
          <Paragraph>Nenhuma tautologia identificada</Paragraph>
        )}

        {actionsWithTautologyDetails.length > 0 ||
        outputConditionsWithTautologyDetails.length > 0 ? (
          <>
            <Paragraph>
              * Você deve alterar as condições de execução destas ações, pois
              atualmente estas condições sempre serã verdadeiras.
              <br />
              Você pode corrigir estas tautologiasautomaticamente apertando no
              botão abaixo.
            </Paragraph>

            <BdsButton
              type="submit"
              variant="primary"
              onClick={this.handleSubmit}
            >
              Corrigir Tautologias
            </BdsButton>
          </>
        ) : (
          <></>
        )}
      </>
    );
  };

  private handleSubmit = (): void => {
    createConfirmationAlert({
      onCancel: () => removeOverlay(),
      onConfirm: () => {
        this.handle(true);
        removeOverlay();
        showSuccessToast('Tautologias Corrigidas!');
      },
      mainMessage: `A correção automática irá corrigir a tautologia trocando a condição "ou" por "e". Entretanto, recomendamos que você verifique a sua lógica para confirmar se ela realmente está correta. Deseja continuar?`,
      footnote:
        'Para desfazer esta ação recarregue a última versão publicada do fluxo.',
    });
  };

  private getProblemActionsHtmlList = (
    actionsCondictionsDetails: ConditionActionProblemDetail[]
  ): React.ReactElement => {
    return (
      <ul
        style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: '#607b99' }}
      >
        {actionsCondictionsDetails.map((actionCondiction, index) => (
          <li key={index}>
            {actionCondiction.blockName} - {actionCondiction.actionName} - {actionCondiction.variable}
          </li>
        ))}
      </ul>
    );
  };

  private getProblemOutputConditionsHtmlList = (
    outputCondictionsDetails: ConditionActionProblemDetail[]
  ): React.ReactElement => {
    return (
      <ul
        style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: '#607b99' }}
      >
        {outputCondictionsDetails.map((oc, index) => (
          <li key={index}>
            {oc.blockName} - {oc.variable}
          </li>
        ))}
      </ul>
    );
  };

  private getActionsWithExecuteConditions = (block: BlipFlowBlock): BlipAction[] => {
    return this.getAllActions(block).filter(this.hasExecuteCondition);
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

  private hasExecuteCondition = (action: BlipAction): boolean =>{
    return action.conditions?.length > 0 || false;
  }

  private hasTautologyOnCondition = (condition: BlipCondiction): boolean =>
    condition.comparison === NOT_EQUAL_CONDITION && condition.values.length > 1;

  private getActionsCondictionsWithTautologyDetail = (
    action: BlipAction
  ): ConditionActionProblemDetail[] => {
    const condictionsWithTautology: ConditionActionProblemDetail[] = [];
    for (const condition of action.conditions) {
      if (this.hasTautologyOnCondition(condition)) {
        condictionsWithTautology.push({
          blockName: action.blockName,
          actionName: action.$title,
          variable: condition.variable,
        });
      }
    }
    return condictionsWithTautology;
  };

  private fixActionsCondictionsWithTautology = (action: BlipAction): void => {
    let newConditionsArray: BlipCondiction[] = [];

    for (const condition of action.conditions) {
      if (this.hasTautologyOnCondition(condition)) {
        newConditionsArray = newConditionsArray.concat(
          condition.values.map((conditionVariable) =>
            this.getNotEqualCondition(condition.variable, conditionVariable)
          )
        );
      } else {
        newConditionsArray.push(condition);
      }
    }

    action.conditions.splice(
      0,
      action.conditions.length,
      ...newConditionsArray
    );
  };

  private fixOutputCondictionsWithTautology = (
    outputCondition: BlipBlockOutputCondition
  ): void => {
    let newConditionsArray: BlipCondiction[] = [];

    for (const condition of outputCondition.conditions) {
      if (this.hasTautologyOnCondition(condition)) {
        newConditionsArray = newConditionsArray.concat(
          condition.values.map((conditionVariable) =>
            this.getNotEqualCondition(condition.variable, conditionVariable)
          )
        );
      } else {
        newConditionsArray.push(condition);
      }
    }

    outputCondition.conditions.splice(
      0,
      outputCondition.conditions.length,
      ...newConditionsArray
    );
  };

  private getOutputCondictionsWithTautology = (
    outputCondition: BlipBlockOutputCondition,
    blockName: string
  ): ConditionActionProblemDetail[] => {
    const outputConditionsWithProblems: ConditionActionProblemDetail[] = [];

    for (const condition of outputCondition.conditions) {
      if (this.hasTautologyOnCondition(condition)) {
        outputConditionsWithProblems.push({
          blockName: blockName,
          variable: condition.variable,
        });
      }
    }

    return outputConditionsWithProblems;
  };

  private getNotEqualCondition = (
    variable: string,
    value: string
  ): BlipCondiction => {
    return {
      source: DEFAULT_CONDITION_SOURCE,
      comparison: NOT_EQUAL_CONDITION,
      values: [value],
      variable: variable,
    };
  };
}
