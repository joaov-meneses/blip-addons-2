import * as React from 'react';

import { BdsTypo } from 'blip-ds/dist/blip-ds-react';
import { t } from 'src/i18n';

export type EditBlockOptionProps = {
  onClick: () => void;
};

export const EditBlockOption = ({
  onClick,
}: EditBlockOptionProps): JSX.Element => {
  return (
    <BdsTypo
      onClick={() => onClick()}
      tag="span"
      variant="fs-14"
      class="edit-block-option"
    >
      {t('editBlockOption.typoValue')}
    </BdsTypo>
  );
};
