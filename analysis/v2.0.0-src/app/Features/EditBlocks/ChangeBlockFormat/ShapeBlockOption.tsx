import * as React from 'react';
import { BdsButton } from 'blip-ds/dist/blip-ds-react';
import EllipseIcon from '../../../../styles/Ellipse.svg';
import UpperConcaveIcon from '../../../../styles/UpperConcave.svg';
import LowerConcaveIcon from '../../../../styles/LowerConcave.svg';
import RightConcaveIcon from '../../../../styles/RightConcave.svg';
import LeftConcaveIcon from '../../../../styles/LeftConcave.svg';
import MainDiagonalConcaveIcon from '../../../../styles/MainDiagonalConcave.svg';
import SecondaryDiagonalConcaveIcon from '../../../../styles/SecondaryDiagonalConcave.svg';
import RectangularIcon from '../../../../styles/Rectangle.svg';

import { Shapes } from '../BlipBlocksFunctions';

export type ShapeBlockOptionProps = {
  onClick: (shape: Shapes) => any;
};

export const ShapeBlockOption = ({
  onClick,
}: ShapeBlockOptionProps): JSX.Element => {
  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'inline-flex' }}>
        <BdsButton
          style={{ marginRight: '20px' }}
          variant="ghost"
          onClick={() => onClick(Shapes.ELLIPSE)}
        >
          <EllipseIcon />
        </BdsButton>

        <BdsButton
          style={{ marginRight: '20px' }}
          variant="ghost"
          onClick={() => onClick(Shapes.UPPER_CONCAVE)}
        >
          <UpperConcaveIcon />
        </BdsButton>

        <BdsButton
          style={{ marginRight: '20px' }}
          variant="ghost"
          onClick={() => onClick(Shapes.LOWER_CONCAVE)}
        >
          <LowerConcaveIcon />
        </BdsButton>

        <BdsButton
          variant="ghost"
          onClick={() => onClick(Shapes.RIGHT_CONCAVE)}
        >
          <RightConcaveIcon />
        </BdsButton>
      </div>
      <div style={{ display: 'inline-flex' }}>
        <BdsButton
          style={{ marginRight: '20px' }}
          variant="ghost"
          onClick={() => onClick(Shapes.LEFT_CONCAVE)}
        >
          <LeftConcaveIcon />
        </BdsButton>

        <BdsButton
          style={{ marginRight: '20px' }}
          variant="ghost"
          onClick={() => onClick(Shapes.MAIN_DIAGONAL_CONCAVE)}
        >
          <MainDiagonalConcaveIcon />
        </BdsButton>

        <BdsButton
          style={{ marginRight: '20px' }}
          variant="ghost"
          onClick={() => onClick(Shapes.SECONDARY_DIAGONAL_CONCAVE)}
        >
          <SecondaryDiagonalConcaveIcon />
        </BdsButton>

        <BdsButton
          variant="ghost"
          onClick={() => onClick(Shapes.RECTANGULAR)}
        >
          <RectangularIcon />
        </BdsButton>
      </div>
    </div>
  );
};
