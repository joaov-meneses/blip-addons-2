import * as React from 'react';
import { BdsSelect, BdsSelectOption } from 'blip-ds/dist/blip-ds-react';

type LanguageSelectProps = {
  value: string;
  onChange: (event: any) => void;
  style?: React.CSSProperties;
};

export const LanguageSelect = ({
  value,
  onChange,
  style,
}: LanguageSelectProps): JSX.Element => {
  return (
    <BdsSelect
      placeholder="Select Language"
      icon="message-talk"
      style={style}
      value={value}
      onBdsChange={onChange}
    >
      <BdsSelectOption value="ptbr">
        <img
          src="icons/Flag_of_Brazil.png"
          alt="Português"
          width={20}
          style={{ verticalAlign: 'middle' }}
        />{' '}
        Português
      </BdsSelectOption>
      <BdsSelectOption value="es">
        <img
          src="icons/Flag_of_Spain_and_Mexico.png"
          alt="Español"
          width={20}
          style={{ verticalAlign: 'middle' }}
        />{' '}
        Español
      </BdsSelectOption>
      <BdsSelectOption value="en">
        <img
          src="icons/Flag_of_EUA.png"
          alt="English"
          width={20}
          style={{ verticalAlign: 'middle' }}
        />{' '}
        English
      </BdsSelectOption>
    </BdsSelect>
  );
};
