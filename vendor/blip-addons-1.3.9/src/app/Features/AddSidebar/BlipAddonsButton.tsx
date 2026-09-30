import * as React from 'react';
import { BdsButtonIcon, BdsTooltip } from 'blip-ds/dist/blip-ds-react';

export type BlipsButtonProps = {
  onClick: () => void;
};

export const BlipsButton = ({ onClick }: BlipsButtonProps): JSX.Element => (
  <div
  // style={{
  //   margin: '0.25rem',
  // }}
  >
    <BdsTooltip
      className="hydrated"
      position="right-center"
      tooltipText="Blip Addons"
      onClick={onClick}
    >
      {/* <div className="builder-icon-bg flex justify-center items-center"> */}
      <BdsButtonIcon
        size="short"
        class="hydrated"
        variant="secondary"
        icon="favorite"
      />
      {/* </div> */}
    </BdsTooltip>
  </div>
);
