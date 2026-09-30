import * as React from 'react';
import { Accordion } from '@chakra-ui/react';

export type BlipAccordionProps = {
  children: React.ReactChild | React.ReactChild[];
};

export const BlipAccordion = ({
  children,
}: BlipAccordionProps): JSX.Element => {
  return (
    <>
      <Accordion allowMultiple>{children}</Accordion>
    </>
  );
};
