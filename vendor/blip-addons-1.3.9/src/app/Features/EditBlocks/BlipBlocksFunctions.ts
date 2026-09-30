import { getBlockById } from '~/Utils';

export enum Shapes {
  ELLIPSE = '50%',
  RECTANGULAR = '3px',
  LEFT_CONCAVE = '50% 0 0 50%',
  LOWER_CONCAVE = '0 0 50% 50%',
  UPPER_CONCAVE = '50% 50% 0 0',
  RIGHT_CONCAVE = '0 50% 50% 0',
  MAIN_DIAGONAL_CONCAVE = '0 50% 0 50%',
  SECONDARY_DIAGONAL_CONCAVE = '50% 0 50% 0',
  DEFAULT = 'default',
}

export const colorBlockBackground = (color: string, block: HTMLElement): void => {
  block.style.background = color;
};

export const colorBlockText = (color: string, block: HTMLElement): void => {
  block.style.color = color;
};

export const formatShapeBlock = (shape: Shapes, block: HTMLElement): void => {
  block.style.borderRadius = shape;

  if (shape === Shapes.DEFAULT) {
    const blockJson = getBlockById(block.id);
    delete blockJson.addonsSettings;

    block.style.background = null;
    block.style.color = null;
    block.style.borderRadius = null;
    block.style.padding = null;
  }

  if (shape === Shapes.ELLIPSE) {
    block.style.padding = '16px';
  }
};
