import { EditableInputAddons } from '@components/EditableInput';
import { BdsButton } from 'blip-ds/dist/blip-ds-react';
import * as React from 'react';
import { t } from 'src/i18n';
import { Input, Paragraph } from '~/Components';
import { FlowComment } from '~/types';
import {
  createConfirmationAlert,
  getControllerVariable,
  removeOverlay,
  resetSearchedStates,
  showDangerToast,
  showSuccessToast,
} from '~/Utils';

export type AddCommentsSidebarProps = {
  onCreateComment: (text: string) => FlowComment;
  onClose: () => void;
  comments: FlowComment[];
  onRemoveComment: (commentId: string) => void;
  onEditComment: (updatedComment: FlowComment) => void;
};

export const AddCommentsSidebar = ({
  onEditComment,
  onCreateComment,
  onRemoveComment,
  onClose,
  comments,
}: AddCommentsSidebarProps): JSX.Element => {
  const [textComment, setTextComment] = React.useState('');
  const [currentComments, setCurrentComments] = React.useState(comments);
  const [isWritingNewComment, setIsWritingNewComment] = React.useState(false);

  const createComment = (): void => {
    const newComment = onCreateComment(textComment);
    const newCommentsList = currentComments.slice();
    newCommentsList.push(newComment);
    setCurrentComments(newCommentsList);
    setIsWritingNewComment(false);
    setTextComment('');
    showSuccessToast(
      t('flowComments.addCommentsSideBar.createComment.successToast')
    );
  };

  const createNewComment = (): void => {
    if (isWritingNewComment) {
      return;
    }
    setIsWritingNewComment(true);
  };

  const handleRemoveComment = (id: string): void => {
    createConfirmationAlert({
      onCancel: () => removeOverlay(),
      onConfirm: () => {
        removeComment(id);
        removeOverlay();
      },
      headerMessage: t(
        'flowComments.addCommentsSideBar.handleRemoveComment.headerMessage'
      ),
      mainMessage: t(
        'flowComments.addCommentsSideBar.handleRemoveComment.mainMessage'
      ),
      footnote: '',
    });
  };

  const removeComment = (id: string): void => {
    const remainingComments = currentComments.filter(
      (value) => value.id !== id
    );
    setCurrentComments(remainingComments);
    onRemoveComment(id);
    showSuccessToast(
      t('flowComments.addCommentsSideBar.removeComment.successToast')
    );
  };

  const editComment = (commentId: string, text: string): void => {
    const updatedCommentIndex = currentComments.findIndex(
      (e) => e.id === commentId
    );
    if (updatedCommentIndex !== -1) {
      const updatedComments = [...currentComments];
      updatedComments[updatedCommentIndex].text = text;
      setCurrentComments(updatedComments);
      onEditComment(updatedComments[updatedCommentIndex]);
      showSuccessToast(
        t('flowComments.addCommentsSideBar.editComment.successToast')
      );
    } else {
      showDangerToast(
        t('flowComments.addCommentsSideBar.editComment.toastDanger')
      );
    }
  };

  const highlightBlockHandler = (
    comment: FlowComment,
    isActivatingSearch: boolean
  ): void => {
    resetSearchedStates();
    const searchedStates = getControllerVariable('searchedStates');
    if (isActivatingSearch) {
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
        id="blips-custom-sidebar"
        className="sidebar-content-component left-entrance-animation position-left builder-sidebar ng-enter"
      >
        <div className="sidebar-content-header background-text-dark-5 bp-c-white ph5 pt2">
          <div className="sidebar-helper-header">
            <input
              className="bp-c-white w-100 sidebar-title"
              id="sidebar-title"
              maxLength={50}
              type="text"
              name="nodeName"
              value={t('flowComments.addCommentsSideBar.body.inputValue')}
              readOnly
            />

            <div className="sidebar-helper-header__actions">
              <span>
                <i
                  className="icon-close cursor-pointer"
                  id="addictions-menu-close"
                  onClick={onClose}
                />
              </span>
            </div>
          </div>
        </div>

        <div style={{ padding: '3%' }}>
          {currentComments.map((comment, index) => {
            return (
              <div key={comment.id} style={{ marginTop: '2rem' }}>
                <Paragraph
                  style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}
                >
                  {t('flowComments.addCommentsSideBar.body.paragraphComment')}{' '}
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
              </div>
            );
          })}

          <div style={{ marginTop: '2rem' }}>
            <BdsButton variant="dashed" onClick={createNewComment}>
              {t('flowComments.addCommentsSideBar.body.buttonAddComment')}
            </BdsButton>
          </div>

          {!isWritingNewComment ? (
            <></>
          ) : (
            <div>
              <div>
                <Paragraph>
                  {t(
                    'flowComments.addCommentsSideBar.body.addCommentParagraphPart1'
                  )}{' '}
                  <br />
                  {t(
                    'flowComments.addCommentsSideBar.body.addCommentParagraphPart2'
                  )}
                </Paragraph>
                <div className="ml2" style={{ marginTop: '4px' }}>
                  <Input
                    value={textComment}
                    onChange={(e) => setTextComment(e.target.value)}
                    label={t(
                      'flowComments.addCommentsSideBar.body.addCommentLabel'
                    )}
                    type="text"
                    isTextarea={true}
                    rows={15}
                  />
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <BdsButton
                  type="submit"
                  variant="primary"
                  onClick={createComment}
                >
                  {t('flowComments.addCommentsSideBar.body.saveCommentButton')}
                </BdsButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
