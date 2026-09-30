import * as React from 'react';
import { BdsIcon } from 'blip-ds/dist/blip-ds-react';

type RestoreButtonProps = {
  label: string;
  onClick: () => void;
  id?: string;
};

export const RestoreButton = ({ label, onClick, id }: RestoreButtonProps): JSX.Element => (
  <button id={id} type="button" className="addons-restore-action" title={label}
    aria-label={label} onClick={onClick}>
    <BdsIcon name="restore" size="small" theme="outline" />
  </button>
);
