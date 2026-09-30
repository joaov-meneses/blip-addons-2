import * as React from 'react';
import { BdsSwitch } from 'blip-ds/dist/blip-ds-react';
import { SwitchSize } from 'blip-ds/dist/types/components/bds-switch/bds-switch';

export type SwitchProps = {
  name: string;
  onChange: (arg: any) => void;
  isChecked: boolean;
  size?: SwitchSize;
};

export const Switch = ({
  name,
  onChange,
  isChecked,
  size = 'standard'
}: SwitchProps): JSX.Element => {
  return (
    <BdsSwitch
      name={name}
      refer={name}
      checked={isChecked}
      onBdsChange={onChange}
      size={size}
    />
  );
};
