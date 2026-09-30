import { getBlocks } from '../../Utils';
import { BaseFeature } from '../BaseFeature';
import { BlipFlowBlock, BlipContentAction } from '~/types';

const SEND_MESSAGE_CONTENT_TYPE = 'SendMessage';
const SEND_MESSAGE_CONTENT_TYPE_OF_CONTENT = 'text';

export class ReplaceVariable extends BaseFeature {
  public static isUserTriggered = true;

  /**
   * Sets the expiration time for all the bots
   *
   * @param expirationTime The expiration time
   */
  public handle(
    originalVariableName: string,
    newVariableName: string
  ): boolean {
    const flowBlocks = getBlocks();

    for (const flowBlock of flowBlocks) {
      this.replaceVariableOnBlockContentActions(
        flowBlock,
        originalVariableName,
        newVariableName
      );
    }

    return true;
  }

  private replaceVariableOnBlockContentActions = (
    flowBlock: BlipFlowBlock,
    originalVariableName: string,
    newVariableName: string
  ): boolean => {
    const replaceRegex = new RegExp(`\\b${originalVariableName}\\b`, 'i');

    this.replaceVariableOnBlockContentActionsInput(
      flowBlock.$contentActions,
      replaceRegex,
      newVariableName
    );

    this.replaceVariableOnBlockContentActionsMessage(
      flowBlock.$contentActions,
      originalVariableName,
      newVariableName
    );

    return true;
  };

  private replaceVariableOnBlockContentActionsInput = (
    contentActions: BlipContentAction[],
    originalVariableRegex: RegExp,
    newVariableName: string
  ): void => {
    const inputContentActionIndex = contentActions.findIndex(
      (constentAction) => constentAction.input
    );

    if (inputContentActionIndex < 0) {
      return;
    }

    const inputContentAction = contentActions[inputContentActionIndex];

    if (inputContentAction.input?.variable) {
      const hasMatch = originalVariableRegex.test(
        inputContentAction.input.variable
      );

      if (hasMatch) {
        inputContentAction.input.variable = newVariableName;
        inputContentAction.input.$cardContent.document.content =
          newVariableName;
      }
    }
  };

  private replaceVariableOnBlockContentActionsMessage = (
    contentActions: BlipContentAction[],
    originalVariableName: string,
    newVariableName: string
  ): void => {
    const contentMessages = contentActions.filter(
      (constentAction) =>
        constentAction?.action.type === SEND_MESSAGE_CONTENT_TYPE &&
        constentAction?.action.$typeOfContent ===
          SEND_MESSAGE_CONTENT_TYPE_OF_CONTENT
    );

    console.log("Vetor de mensagens:")
    console.log(contentMessages)

    for (const contentMessage of contentMessages) {
      contentMessage.action.settings.content =
        this.replaceBlibVariablesOnString(
          contentMessage.action.settings.content,
          originalVariableName,
          newVariableName
        );
    }
  };

  private replaceBlibVariablesOnString = (
    text: string,
    originalVariableName: string,
    newVariableName: string
  ): string => {
    const variableCallRegex = new RegExp(
      `\b{{${originalVariableName}}}\b`,
      'ig'
    );
    return text.replace(variableCallRegex, `{{${newVariableName}}}`);
  };
}
