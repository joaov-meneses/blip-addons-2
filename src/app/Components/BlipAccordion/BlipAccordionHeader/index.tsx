import * as React from 'react';
import { Box } from '@chakra-ui/react';

export type BlipAccordionHeaderProps = {
  marginBottom?: number;
  marginTop?: number;
  children: any;
  isFirst?: boolean;
};

export const BlipAccordionHeader = ({
  children,
  marginBottom,
  marginTop,
  isFirst,
}: BlipAccordionHeaderProps): JSX.Element => {
  return (
    <>
      <h2>
        <Box mb={marginBottom} mt={isFirst ? marginTop : 0} textAlign="left">
          {children}
        </Box>
      </h2>
    </>
  );
};
