import * as React from 'react';
import { AccordionItem } from '@chakra-ui/react';

export type AccordionItemProps = {
  isFocusable?: boolean;
  borderTop?: number;
  children: any;
  marginTop?: number;
  marginBottom?: number;
};

export const BlipAccordionItem = ({
  isFocusable = false,
  borderTop,
  children,
  marginTop = 10,
  marginBottom = 5,
}: AccordionItemProps): JSX.Element => {
  return (
    <>
      <AccordionItem
        border={0}
        borderBottomColor="#C9DFE4"
        borderBottomWidth="1px"
        borderBottomStyle="solid"
        isFocusable={isFocusable}
        borderTop={borderTop}
        marginTop={marginTop}
        marginBottom={marginBottom}
      >
        {children}
      </AccordionItem>
    </>
  );
};
