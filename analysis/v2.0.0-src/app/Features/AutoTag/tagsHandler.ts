import { v4 as uuid } from 'uuid';
import { Settings } from '~/Settings';
import {
  BlipActionType,
  BlipContentAction,
  BlipFlowBlock,
  BlipTag,
  BlipTypeTags,
  Tag,
} from '~/types';
import { getBlockById, getUniqActions } from '~/Utils';

const SEND_MESSAGE_TYPE = 'SendMessage';
const USER_INPUT_TYPE = 'UserInput';

/**
 * Updates the tags of a given block
 *
 * @param blockId block that will have it's tags updated
 */
export const updateTags = (blockId: string): void => {
  if (!blockId) return;

  const block = getBlockById(blockId);
  if(block.$tags) {
    const customTags = block.$tags.filter(isDifferentOfActionTag);
    block.$tags = customTags;
  
    setTagsForBlockActions(block);
    setTagForBlockMessages(block);
    setTagForUserInput(block);
  }
};

/**
 * Verify if the tag is different of some a @param personalTags
 *
 * @param tag a tag used on the comparison
 */
const isDifferentOfActionTag = (tag: BlipTag): boolean => {
  return !(
    Settings.personalTags.filter(
      (personalTags) => personalTags.name === tag.label
    ).length > 0
  );
};

/**
 * Set the tags for the blip actions (script, variable, http requests, etc)
 *
 * @param block block that will have it's tags updated
 */
const setTagsForBlockActions = (block: BlipFlowBlock): void => {
  const actionsType = getUniqActions(block);

  actionsType.forEach((actionType: BlipActionType) => {
    setTag(block, actionType);
  });
};

/**
 * Set the tags for the blocks that have a message
 *
 * @param block block that will have it's tags updated
 */
 const setTagForBlockMessages = (block: BlipFlowBlock): void => {
  const blockAction = getActionsFromBlock(block);

  if (blockAction) {
    const blockHasMessage = blockAction.action.type === SEND_MESSAGE_TYPE;

    if (blockHasMessage) {
      setTag(block, SEND_MESSAGE_TYPE);
    }
  }
};

/**
 * Set the tags for the blocks that have an input
 *
 * @param block block that will have it's tags updated
 */
const setTagForUserInput = (block: BlipFlowBlock): void => {
  const inputAction = getInputAction(block);
  const hasInputOnBlock = !inputAction.input.bypass;

  if (hasInputOnBlock) {
    setTag(block, USER_INPUT_TYPE);
  }
};

/**
 * Set the tags givin a BlipTypeTags
 *
 * @param block block that will have it's tags updated
 * @param actionType action that will be used in a tag event
 */
const setTag = (block: BlipFlowBlock, actionType: BlipTypeTags): void => {
  const tag = getPersonalTag(actionType);

  if (tag.isActive) {
    const newTag = createTag(tag);

    if (newTag) {
      block.$tags.push(newTag);
    }
  }
};

/**
 * Creates a new tag for the given action type
 *
 * @param actionType action that will have its tag created
 */
const createTag = (tag: Tag): BlipTag => {
  const tagId = `blip-tag-${uuid()}`;
  
  return {
    id: tagId,
    label: tag.name,
    background: tag.color,
    canChangeBackground: false,
  };
};


/**
 * Returns a tag given the action type
 *
 * @param actionType action that will get the color
 */
 const getPersonalTag = (actionType: BlipTypeTags): Tag => {
  const matchedAction = Settings.personalTags.filter(
    (tag) => tag.name === actionType
  )[0];

  return matchedAction;
};

/**
 * Return a input action on block
 *
 * @param block block that will have it's tags updated
 */
const getInputAction = (block: BlipFlowBlock): BlipContentAction =>
  block.$contentActions.find((contentAction) => contentAction['input']);

/**
 * Return all actions on the block
 *
 * @param block block that will have it's tags updated
 */
const getActionsFromBlock = (block: BlipFlowBlock): BlipContentAction =>
  block.$contentActions.find((contentAction) => contentAction['action']);
