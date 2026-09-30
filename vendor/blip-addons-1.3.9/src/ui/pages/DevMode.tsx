import * as React from 'react';
import { BdsSwitch, BdsTypo } from 'blip-ds/dist/blip-ds-react';

import { DevModeKeys, setDevModeSettings, Settings } from '~/Settings';

import { Block } from '@components/Block';
import { Flex } from '@components/Flex';
import { DescriptionText } from '@components/DescriptionText';
import { t } from 'src/i18n';

export const DevMode = (): JSX.Element => {
  const devModeOptionsByCategory = {
    [t('toastContainer.devModeConfig.text1')]: {
      Home: [
        {
          name: 'onlyRouters',
          text: t('toastContainer.devModeConfig.home.switch1'),
        },
        {
          name: 'paintRoutersByAmbient',
          text: t('toastContainer.devModeConfig.home.switch2'),
        },
      ],
    },
    Beholder: {
      Home: [
        {
          name: 'changeBeholderPaddingRight',
          text: t('toastContainer.devModeConfig.beholder.switch1'),
        },
      ],
    },
    Cleanup: {
      Home: [
        {
          name: 'cleanHeaderOnHome',
          text: t('toastContainer.devModeConfig.cleanup.switch1'),
        },
      ],
      Block: [
        {
          name: 'actionAndOutputTips',
          text: t('toastContainer.devModeConfig.cleanup.switch2'),
        },
        {
          name: 'hideLibraryFunction',
          text: t('toastContainer.devModeConfig.cleanup.switch3'),
        },
        {
          name: 'paintRoutersByAmbient',
          text: 'Pinta os routers com as cores respectivas do filtro de ambiente.',
        },
      ],
    },
    'Beholder': {
      Home: [
        {
          name: 'changeBeholderPaddingRight',
          text: 'Corrige espaçamento da direita quando abre o chat de teste no beholder.',
        },
      ],
    },
    'Cleanup': {
         Home: [
        {
          name: 'cleanHeaderOnHome',
          text: 'Limpa header de opções.',
        },
      ],
      Block: [
        {
          name: 'actionAndOutputTips',
          text: 'Tira as dicas para ações e condições de saída.',
        },
        {
          name: 'hideLibraryFunction',
          text: 'Esconde livraria de funções.',
        },
      ],
    },
  };

  const onSwitchChange = (name: DevModeKeys): void => {
    const newValue = !Settings.devMode[name];
    setDevModeSettings(name, newValue);
  };

  const mountDevModeElement = ({ name, text }): JSX.Element => {
    const switchOptionElement = (
      <Flex key={name} marginTop={0.5}>
        <BdsSwitch
          refer={name}
          checked={Settings.devMode[name]}
          name={name}
          onBdsChange={() => onSwitchChange(name)}
          size="short"
        />
        <Block marginLeft={1}>
          <DescriptionText>{text}</DescriptionText>
        </Block>
      </Flex>
    );

    return switchOptionElement;
  };

  const mountCategoryHeader = ({ marginTop = 1, text }): JSX.Element => {
    const headerComponent = (
      <>
        <Flex marginTop={marginTop}></Flex>
        <BdsTypo>{text}</BdsTypo>
      </>
    );
    return headerComponent;
  };

  const mountedOptionsComponent = Object.keys(devModeOptionsByCategory).reduce(
    (acc, everyCategory) => {
      const devOptionsByEnv = devModeOptionsByCategory[everyCategory];

      const allDevModeOptionsByEnv = Object.keys(devOptionsByEnv).map(
        (everyEnvIdentifier) => {
          const devModeOption = devOptionsByEnv[everyEnvIdentifier];

          const allDevOptionsInEnv = devModeOption.map((everyDevMode) =>
            mountDevModeElement(everyDevMode)
          );

          const devModeInEnv = (
            <div key={everyEnvIdentifier}>
              <Flex marginTop={1}></Flex>
              <DescriptionText>{everyEnvIdentifier}:</DescriptionText>
              {allDevOptionsInEnv}
            </div>
          );

          return devModeInEnv;
        }
      );

      const categoryData = mountCategoryHeader({ text: everyCategory });

      const completelyComponentData = (
        <div key={everyCategory}>
          {categoryData}
          {allDevModeOptionsByEnv}
        </div>
      );

      acc.push(completelyComponentData);

      return acc;
    },
    []
  );

  return <>{mountedOptionsComponent}</>;
};
