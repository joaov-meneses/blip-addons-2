import * as React from 'react';
import { BdsIcon, BdsTooltip } from 'blip-ds/dist/blip-ds-react';

export type BlipsButtonProps = {
  onClick: () => void;
};

export const BlipsButton = ({ onClick }: BlipsButtonProps): JSX.Element => (
  <li>
    <BdsTooltip
      className="cursor-pointer"
      position="right-center"
      tooltipText="Blip Addons 2.0"
      onClick={onClick}
    >
      <div className="builder-icon-bg flex justify-center items-center">
        <BdsIcon
          size="medium"
          class="builder-icon bds-icon bds-icon__size--medium"
          theme="outline"
          name="favorite"
        />
      </div>
    </BdsTooltip>
  </li>
);
