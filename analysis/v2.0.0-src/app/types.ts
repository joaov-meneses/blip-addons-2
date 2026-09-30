import { BaseFeature } from '@features/BaseFeature';
import { BaseCommand } from '@commands/BaseCommand';

export type Message<Type = unknown> = {
  data: Type;
};

export type BlipsRequest = {
  identifier: string;
  isBlipsRequest: boolean;
  commandCode: string;
  args: any[];
};

export type BlipsResponse = {
  isBlipsResponse: boolean;
  identifier: string;
  result: unknown;
};

export type Command = {
  new (): BaseCommand;
} & typeof BaseCommand;

export type Feature = {
  new (): BaseFeature;
} & typeof BaseFeature;

export type FeatureRequest = {
  code: string;
  type: 'run' | 'cleanup';
  isFeatureRequest: boolean;
  args: any[];
};

export type BlipsCopy = {
  isCopyFromBlips: boolean;
  blocksCode: string;
  originBot: string;
};

export type SettingsUpdate = {
  isSettingsUpdate: true;
  newSettings: Record<string, any>;
  isFromClient: boolean;
};

export type Handshake = {
  isHandshake: boolean;
};

export type Snippet = {
  label: string;
  kind: any;
  documentation: string;
  insertText: string;
};

export type ConditionViewModel = {
  comparison: string;
  source: string;
  values: any[];
  variable: string;
};

export type InconsistencyModel = {
  message: React.ReactElement;
  hasInconsistencies: boolean;
};

export type LoopBlocksDetail = {
  loopBlocksFound: Set<string>;
  count: number;
};

export type Tag = {
  name: string;
  color: string;
  isActive: boolean;
};

export type ConditionActionProblemDetail = {
  blockName: string;
  actionName?: string;
  variable: string;
};

export type BlipFlowBlock = {
  root: boolean;
  id: string;
  $title: string;
  $tags: BlipTag[];
  $position: BlipFlowBlockPosition;
  $enteringCustomActions: BlipAction[];
  $leavingCustomActions: BlipAction[];
  $invalid: boolean;
  $invalidContentActions: boolean;
  $invalidCustomActions: boolean;
  $invalidOutputs: boolean;
  $inputSuggestions: string[];
  $defaultOutput: BlipBlockOutputCondition;
  $conditionOutputs: BlipBlockOutputCondition[];
  $contentActions: BlipContentAction[];
  addonsSettings?: any;
};

export type BlipAction = {
  $id: string;
  $invalid: boolean;
  $title: string;
  $typeOfContent: BlipTypeOfContent;
  $cardContent?: any;
  settings: any;
  conditions: BlipCondiction[];
  blockName?: string;
  type?: BlipActionType;
};

export type BlipContentAction = {
  $$hashKey?: string;
  $invalid: boolean;
  $validationError: any;
  $typeOfContent: string;
  action?: BlipAction;
  input?: any; //refatorar
};

export type BlipCondiction = {
  comparison: BlipComparison;
  source: BlipSource;
  values: string[];
  $$hashKey?: string;
  variable?: string;
};

export type BlipBlockOutputCondition = {
  $id?: string;
  $invalid: boolean;
  $validationError: any;
  conditions?: BlipCondiction[];
  stateId: string;
  typeOfStateId?: string;
  $connId?: string;
  $$hashKey?: string;
};

export type BlipInput = {
  $cardContent?: any;
  $invalid: boolean;
  bypass: boolean;
  expiration?: string;
  validation?: BlipInputValidation;
  variable?: string;
  $$hashKey?: string;
};

export type BlipInputValidation = {
  rule: BlipBlipInputValidationRule;
  error: string;
  regex?: string;
  type?: string;
};

export type BlipTag = {
  background: string;
  canChangeBackground: boolean;
  id: string;
  label: string;
};

export type PaletteColor = {
  hex: string;
}

export type BlipFlowBlockPosition = {
  top: string;
  left: string;
};

export type BlipBlipInputValidationRule =
  | 'text'
  | 'date'
  | 'type'
  | 'regex'
  | 'number';

export type BlipComparison =
  | 'exists'
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'greaterThanOrEquals'
  | 'lessThanOrEquals'
  | 'approximateTo'
  | 'matches'
  | 'notExists';

export type BlipSource = 'context' | 'intent' | 'entity' | 'input';

export type BlipActionType =
  | 'TrackEvent'
  | 'ProcessHttp'
  | 'MergeContact'
  | 'Redirect'
  | 'ManageList'
  | 'ExecuteScript'
  | 'ExecuteScriptV2'
  | 'SetVariable'
  | 'ProcessContentAssistant'
  | 'ProcessCommand'
  | 'SendMessage';

export type BlipTypeOfContent =
  | 'chat-state'
  | 'text'
  | 'select-immediate'
  | 'media'
  | 'document-select'
  | 'select'
  | 'media-audio'
  | 'media-video'
  | 'media-document'
  | 'send-location'
  | 'ask-location'
  | 'web-link'
  | 'http-content'
  | 'raw-content';

export type BlipTypeTags = BlipActionType 
  | 'UserInput';
