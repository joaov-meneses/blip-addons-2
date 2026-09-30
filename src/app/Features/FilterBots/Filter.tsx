import * as React from 'react';
import { BdsSelect, BdsSelectOption } from 'blip-ds/dist/blip-ds-react';

import * as Constants from './Constants';
import { Circle } from '@components/Circle';
import { Flex } from '@components/Flex';
import { t } from 'src/i18n';

export type FilterProps = {
  onChange: (...args: any[]) => any;
};

export const Filter = ({ onChange }: FilterProps): JSX.Element => {
  return (
    <Flex marginLeft={18}>
      <BdsSelect
        onBdsChange={onChange}
        label={t('home.filter.title')}
        icon="filter"
        value={Constants.ALL}
      >
        <BdsSelectOption value={Constants.ALL}>
          <Flex alignItems="center" gap={10}>
            <Circle backgroundColor="black" />
            {t('home.filter.option1')}
          </Flex>
        </BdsSelectOption>

        <BdsSelectOption value={Constants.PRD}>
          <Flex alignItems="center" gap={10}>
            <Circle backgroundColor={Constants.COLORS.PRD} />
            {t('home.filter.option2')}
          </Flex>
        </BdsSelectOption>

        <BdsSelectOption value={Constants.HMG}>
          <Flex alignItems="center" gap={10}>
            <Circle backgroundColor={Constants.COLORS.HMG} />
            {t('home.filter.option3')}
          </Flex>
        </BdsSelectOption>

        <BdsSelectOption value={Constants.BETA}>
          <Flex alignItems="center" gap={10}>
            <Circle backgroundColor={Constants.COLORS.BETA} />
            {t('home.filter.option4')}
          </Flex>
        </BdsSelectOption>

        <BdsSelectOption value={Constants.DEV}>
          <Flex alignItems="center" gap={10}>
            <Circle backgroundColor={Constants.COLORS.DEV} />
            {t('home.filter.option5')}
          </Flex>
        </BdsSelectOption>
      </BdsSelect>
    </Flex>
  );
};
