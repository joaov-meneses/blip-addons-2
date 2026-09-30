import styled from '@emotion/styled';

export type Stack = Partial<{
  marginTop: number;
  padding: number;
  gap: number;
}>;

export const Stack = styled.div(
  ({ marginTop = 0, padding, gap = 0 }: Stack) => ({
    display: 'flex',
    padding: `${padding}rem`,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: `${marginTop}rem`,
    gap,
  })
);
