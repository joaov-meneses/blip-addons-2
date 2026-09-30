import * as React from 'react';
import { BdsButtonIcon, BdsTooltip } from 'blip-ds/dist/blip-ds-react';
import { t } from 'src/i18n';

export type FlowCommentsButtonProps = {
  onClick: () => void;
};

export const FlowCommentsButton = ({
  onClick,
}: FlowCommentsButtonProps): JSX.Element => (
  <div
  // style={{
  //   margin: '0.25rem',
  // }}
  >
    <BdsTooltip
      className="mv2 hydrated"
      position="right-center"
      tooltipText={t('flowComments.flowCommentsSideBar.flowCommentsButton')}
      onClick={onClick}
    >
      {/* <div className="builder-icon-bg flex justify-center items-center"> */}
      <BdsButtonIcon
        size="short"
        class="hydrated"
        variant="secondary"
        icon="user-engaged"
      />
      {/* </div> */}
    </BdsTooltip>
  </div>
);
