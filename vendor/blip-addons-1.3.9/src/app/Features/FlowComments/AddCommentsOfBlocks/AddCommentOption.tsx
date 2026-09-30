import * as React from 'react';
import * as Constants from './Constants';
import { t } from 'src/i18n';
import { BdsTypo } from 'blip-ds/dist/blip-ds-react';

export type AddCommentOptionProps = {
  onClick: () => void;
};

export const AddCommentOption = ({
  onClick,
}: AddCommentOptionProps): JSX.Element => {
  return (
    // <div className={Constants.ADD_COMMENT_CLASS}>
    <BdsTypo
      onClick={() => onClick()}
      tag="span"
      variant="fs-14"
      className={Constants.ADD_COMMENT_CLASS}
    >
      {t('flowComments.addCommentsOfBlocks.buttonLabel')}
    </BdsTypo>
  );
};
