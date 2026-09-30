import * as React from 'react';
import { BdsSelect, BdsSelectOption } from 'blip-ds/dist/blip-ds-react';

import * as Constants from './Constants';
import { Circle } from '@components/Circle';
import { Flex } from '@components/Flex';

export type FilterProps = {
  onChange: (...args: any[]) => any;
};

export const Filter = ({ onChange }: FilterProps): JSX.Element => {
  return (
    <Flex marginLeft={18}>
      <BdsSelect
        onBdsChange={onChange}
        label="Filtrar por ambiente"
        icon="filter"
        value={Constants.ALL}
      >
        <BdsSelectOption value={Constants.ALL}>
          <Flex alignItems="center" gap={10}>
            <Circle backgroundColor="black" />
            Todos
          </Flex>
        </BdsSelectOption>

        <BdsSelectOption value={Constants.PRD}>
          <Flex alignItems="center" gap={10}>
            <Circle backgroundColor="#FB5A8B" />
            Produção (PRD)
          </Flex>
        </BdsSelectOption>

        <BdsSelectOption value={Constants.HMG}>
          <Flex alignItems="center" gap={10}>
            <Circle backgroundColor="#FFEC03" />
            Homologação (HMG)
          </Flex>
        </BdsSelectOption>

        <BdsSelectOption value={Constants.BETA}>
          <Flex alignItems="center" gap={10}>
            <Circle backgroundColor="#C226FB" />
            Beta (BETA)
          </Flex>
        </BdsSelectOption>

        <BdsSelectOption value={Constants.DEV}>
          <Flex alignItems="center" gap={10}>
            <Circle backgroundColor="#21CC79" />
            Desenvolvimento (DEV)
          </Flex>
        </BdsSelectOption>
      </BdsSelect>
    </Flex>
  );
};
