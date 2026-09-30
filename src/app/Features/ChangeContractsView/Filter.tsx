import * as React from 'react';
import { BdsInput } from 'blip-ds/dist/blip-ds-react';

import { Flex } from '@components/Flex';
import { FILTER_MARGIN } from './Constants';
import { t } from 'src/i18n';

export type FilterProps = {
  onChange: (...args: any[]) => any;
};

export const Filter = ({ onChange }: FilterProps): JSX.Element => {
  return (
    <Flex marginLeft={FILTER_MARGIN} marginRight={FILTER_MARGIN}>
      <BdsInput
        onBdsChange={onChange}
        label={t('contractViewer.title')}
        icon="filter"
      ></BdsInput>
    </Flex>
  );
};
