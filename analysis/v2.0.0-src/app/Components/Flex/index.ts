import styled from '@emotion/styled';
import { Property } from 'csstype';

export type FlowProps = Partial<{
  padding: number;
  marginTop: number;
  marginLeft: number;
  gap: number;
  alignItems: Property.AlignItems;
}>;

export const Flex = styled.div(
  ({
    padding = 0,
    marginTop = 0,
    marginLeft = 0,
    gap = 0,
    alignItems,
  }: FlowProps) => ({
    display: 'flex',
    marginTop: `${marginTop}rem`,
    padding: `${padding}rem`,
    gap,
    alignItems,
    marginLeft,
  })
);
