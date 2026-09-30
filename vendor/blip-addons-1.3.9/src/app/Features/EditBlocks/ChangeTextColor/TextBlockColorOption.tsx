import * as React from 'react';
import { SketchPicker } from 'react-color';

export type TextColorBlockOptionProps = {
  id: string,
  onSetColor: (id: string, color: string) => void;
};

export const TextBlockColorOption = ({
  id,
  onSetColor
}: TextColorBlockOptionProps): JSX.Element => {
  const [color, setColor] = React.useState({hex: "#ffffff"});

  const handleChange = (color): void => {
    setColor(color);
    onSetColor(id, color.hex)
  };

  return (
    <div>
      <SketchPicker color={color} onChange={handleChange} />
    </div>
  );
};