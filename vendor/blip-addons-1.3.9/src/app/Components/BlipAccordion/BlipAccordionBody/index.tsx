import * as React from 'react';
import { AccordionPanel, Box } from '@chakra-ui/react';

export type BlipAccordionBodyProps = {
  children: React.ReactChild | React.ReactChild[];
};

export const BlipAccordionBody = ({
  children,
}: BlipAccordionBodyProps): JSX.Element => {
  return (
    <AccordionPanel>
      <Box marginBottom={15}>{children}</Box>
    </AccordionPanel>
  );
};
