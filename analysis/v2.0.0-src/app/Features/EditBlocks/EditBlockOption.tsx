import * as React from 'react';

export type EditBlockOptionProps = {
  onClick: () => void;
};

export const EditBlockOption = ({
  onClick,
}: EditBlockOptionProps): JSX.Element => {
  return (
    <div className="edit-block-option">
      <span onClick={() => onClick()}>Editar</span>
    </div>
  );
};
