import * as React from 'react';
import { AccordionButton } from '@chakra-ui/react';
import { Title } from '@components';
import { BdsIcon } from 'blip-ds/dist/blip-ds-react';

export type BlipAccordionButtonProps = {
  title: string;
};

const ARROW_RIGHT = 'arrow-right';
const ARROW_DOWN = 'arrow-down';

export const BlipAccordionButton = ({
  title,
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
        paddingTop={10.1}
        paddingX={5.1}
        mb={2}
        border={0}
        cursor="pointer"
      >
        <BdsIcon
          color="#A9C0C5"
          name={arrowState}
          size="x-large"
          theme="outline"
        />
        <Title>{title}</Title>
      </AccordionButton>
    </>
  );
};
