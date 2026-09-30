import styled from '@emotion/styled';

export type HorizontalStack = Partial<{
  marginTop: number;
}>;

export const HorizontalStack = styled.div(
  ({ marginTop = 0 }: HorizontalStack) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: `${marginTop}rem`,
  })
);
