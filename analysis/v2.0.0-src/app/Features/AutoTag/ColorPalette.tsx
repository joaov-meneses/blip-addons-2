import * as React from 'react';

import { PRESET_COLORS } from '@features/EditBlocks/Constants';
import { TwitterPicker } from 'react-color';
import { PaletteColor } from '~/types';

export type ColorPaletteProps = {
  id: string;
  onColorChange: (color: PaletteColor, index: string) => void;
  defaultColor: string;
};

export const ColorPalette = ({
  id,
  onColorChange,
  defaultColor,
}: ColorPaletteProps): JSX.Element => {
  const [color, setColor] = React.useState<PaletteColor>({ hex: defaultColor });

  const handleChange = (color: PaletteColor): void => {
    setColor(color);
    onColorChange(color, id);
  };

  return (
    <div>
      <TwitterPicker
        width="450px"
        color={color}
        colors={PRESET_COLORS}
        onChange={handleChange}
      />
    </div>
  );
};
