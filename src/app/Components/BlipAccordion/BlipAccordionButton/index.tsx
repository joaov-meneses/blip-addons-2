import * as React from 'react';
import { AccordionButton } from '@chakra-ui/react';
import { Title } from '@components';
import { BdsIcon } from 'blip-ds/dist/blip-ds-react';

export type BlipAccordionButtonProps = {
  title: string;
  compact?: boolean;
};

const ARROW_RIGHT = 'arrow-right';
const ARROW_DOWN = 'arrow-down';

export const BlipAccordionButton = ({
  title,
  compact = false,
}: BlipAccordionButtonProps): JSX.Element => {
  const [arrowState, setArrowState] = React.useState(ARROW_RIGHT);

  const switchArrowState = (): void => {
    if (arrowState === ARROW_RIGHT) {
      setArrowState(ARROW_DOWN);
    } else {
      setArrowState(ARROW_RIGHT);
    }
  };

  return (
    <>
      <AccordionButton
        _focus={{ outline: 'none' }}
        _hover={{ bgColor: 'none' }}
        bgColor="transparent"
        onClick={switchArrowState}
        paddingTop={compact ? 2 : 10.1}
        paddingBottom={compact ? 2 : undefined}
        paddingX={compact ? 1 : 5.1}
        mb={compact ? 0 : 2}
        minHeight={compact ? '44px' : undefined}
        textAlign="left"
        border={0}
        cursor="pointer"
      >
        <BdsIcon
          color="#A9C0C5"
          name={arrowState}
          size={compact ? 'small' : 'x-large'}
          theme="outline"
        />
        {compact ? <span className="addons-tags-action-name">{title}</span> : <Title>{title}</Title>}
      </AccordionButton>
    </>
  );
};
