import * as React from 'react';
import { BdsIcon } from 'blip-ds/dist/blip-ds-react';
import { Block, Paragraph, Stack, Title } from '@components';
import {
  createConfirmationAlert,
  getControllerVariable,
  removeOverlay,
  resetSearchedStates,
  showDangerToast,
  showSuccessToast,
} from '~/Utils';
import { EditableInputAddons } from '@components/EditableInput';
import { FlowComment } from '~/types';
import { t } from 'src/i18n';

export type FlowCommentsSidebarProps = {
  onClose: () => void;
  commentsList: FlowComment[];
  onRemoveComment: (commentId: string) => void;
  onEditComment: (updatedComment: FlowComment) => void;
};

export const FlowCommentsSidebar = ({
  onClose,
  commentsList,
  onRemoveComment,
  onEditComment,
}: FlowCommentsSidebarProps): JSX.Element => {
  const [comments, setComments] = React.useState(commentsList);

  const EmptyCommentsElement = (): JSX.Element => {
    return (
      <Block
        borderRadius="5px"
        borderColor="rgba(0, 0, 0, 0.2)"
        borderStyle="dashed"
        borderWidth="1px"
      >
        <Stack padding={2}>
          <BdsIcon size="xxx-large" theme="outline" name="warning" />
          <Block marginTop={1}>
            <Title>
              {t('flowComments.flowCommentsSideBar.emptyCommentsElement.title')}
            </Title>
          </Block>
          <Paragraph>
            {t(
              'flowComments.flowCommentsSideBar.emptyCommentsElement.paragraphPart1'
            )}
            &quot;
            {t(
              'flowComments.flowCommentsSideBar.emptyCommentsElement.paragraphPart2'
            )}
            &quot;.
          </Paragraph>
        </Stack>
      </Block>
    );
  };

  const handleRemoveComment = (id: string): void => {
    createConfirmationAlert({
      onCancel: () => removeOverlay(),
      onConfirm: () => {
        removeComment(id);
        removeOverlay();
      },
      headerMessage: t(
        'flowComments.flowCommentsSideBar.handleRemoveComment.headerMessage'
      ),
      mainMessage: t(
        'flowComments.flowCommentsSideBar.handleRemoveComment.mainMessage'
      ),
      footnote: '',
    });
  };

  const removeComment = (id: string): void => {
    const remainingComments = comments.filter((value) => value.id !== id);
    setComments(remainingComments);
    onRemoveComment(id);
    showSuccessToast(
      t('flowComments.flowCommentsSideBar.removeComment.successToast')
    );
  };

  const editComment = (commentId: string, text: string): void => {
    const updatedComments = Array.from(comments);
    const updatedCommentIndex = updatedComments.findIndex(
      (e) => e.id === commentId
    );
    if (updatedCommentIndex !== -1) {
      updatedComments[updatedCommentIndex].text = text;
      setComments(updatedComments);
      onEditComment(updatedComments[updatedCommentIndex]);
      showSuccessToast(
        t('flowComments.flowCommentsSideBar.editComment.successToast')
      );
    } else {
      showDangerToast(
        t('flowComments.flowCommentsSideBar.editComment.dangerToast')
      );
    }
  };

  const highlightBlockHandler = (
    comment: FlowComment,
    isToHighlight: boolean
  ): void => {
    resetSearchedStates();
    const searchedStates = getControllerVariable('searchedStates');
    if (isToHighlight) {
      for (const blockId of comment.blocksIdList) {
        searchedStates.push(blockId);
      }
    } else {
      resetSearchedStates();
    }
  };

  return (
    <>
      <div
        id="blips-custom-flowcommentsidebar"
        className="sidebar-content-component left-entrance-animation position-left builder-sidebar ng-enter"
      >
        <div className="sidebar-content-header background-text-dark-5 bp-c-white ph5 pt2">
          <div className="sidebar-helper-header">
            <input
              className="bp-c-white w-100 sidebar-title"
              id="flowcomments-sidebar-title"
              maxLength={50}
              type="text"
              name="nodeName"
              value={t('flowComments.flowCommentsSideBar.body.input')}
              readOnly
            />

            <div className="sidebar-helper-header__actions">
              <span>
                <i
                  className="icon-close cursor-pointer"
                  id="blipaddons-flowcomment-menu-close"
                  onClick={onClose}
                />
              </span>
            </div>
          </div>
        </div>

        <div className="sidebar-content-body" style={{ padding: '3%' }}>
          <Block width="100%">
            {comments.length == 0
              ? EmptyCommentsElement()
              : comments.map((comment, index) => {
                  return (
                    <Block key={comment.id} style={{ marginBottom: '1.5rem' }}>
                      <Paragraph
                        style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}
                      >
                        {t('flowComments.flowCommentsSideBar.body.paragraph')}{' '}
                        {index + 1}
                      </Paragraph>
                      <EditableInputAddons
                        cols={50}
                        id={comment.id}
                        isDeletable={true}
                        isSearchable={true}
                        onRemove={() => handleRemoveComment(comment.id)}
                        defaultValue={comment.text}
                        onChange={(text) => editComment(comment.id, text)}
                        onSearch={(_, isActivatingSearch) =>
                          highlightBlockHandler(comment, isActivatingSearch)
                        }
                      />
                    </Block>
                  );
                })}
          </Block>
        </div>
      </div>
    </>
  );
};
