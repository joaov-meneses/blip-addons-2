import * as React from 'react';
import { BdsButtonIcon, BdsTooltip } from 'blip-ds/dist/blip-ds-react';
import { setSettings, Settings } from '~/Settings';

const INACTIVE_ICON = 'screen-full';
const ACTIVE_ICON = 'screen-fill';

export type BlipsCleanButtonProps = {
  clean: () => void;
  undo: () => void;
};

export const CleanButton = ({
  clean,
  undo,
}: BlipsCleanButtonProps): JSX.Element => {
  const [isActive, setIsActive] = React.useState(Settings.isCleanEnviroment);

  const handleClick = (): void => {
    const shouldClean = !isActive;

    if (shouldClean) {
      clean();
    } else {
      undo();
    }

    setIsActive(shouldClean);
    setSettings({ isCleanEnviroment: shouldClean });
  };

  return (
    <div
    // style={{
    //   margin: '0.25rem',
    // }}
    >
      <BdsTooltip
        className="mv2 hydrated"
        position="right-center"
        tooltipText="Limpar ambiente"
        onClick={handleClick}
      >
        {/* <div className="builder-icon-bg flex justify-center items-center"> */}
        <BdsButtonIcon
          size="short"
          class="hydrated"
          variant="secondary"
          icon={isActive ? ACTIVE_ICON : INACTIVE_ICON}
        />
        {/* </div> */}
      </BdsTooltip>
    </div>
  );
};
