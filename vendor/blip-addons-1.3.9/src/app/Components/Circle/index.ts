import styled from '@emotion/styled';

export type CircleProps = {
  backgroundColor: string;
  width?: number;
  height?: number;
};

export const Circle = styled.div(({ backgroundColor, width = 16, height = 16}: CircleProps) => ({
  width,
  height,
  borderRadius: '50%',
  backgroundColor,
}));
