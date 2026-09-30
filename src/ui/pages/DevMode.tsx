import * as React from 'react';
import { BdsSwitch, BdsTypo } from 'blip-ds/dist/blip-ds-react';
import { DevModeKeys, setDevModeSettings, Settings } from '~/Settings';
import { Block } from '@components/Block';
import { Flex } from '@components/Flex';
import { DescriptionText } from '@components/DescriptionText';
import { t } from 'src/i18n';

export const DevMode = (): JSX.Element => {
  const [options, setOptions] = React.useState({ ...Settings.devMode });
  const categories: Array<{ title: string; items: Array<[DevModeKeys, string]> }> = [
    { title: t('toastContainer.devModeConfig.text1'), items: [
      ['onlyRouters', 'home.switch1'], ['paintRoutersByAmbient', 'home.switch2'],
    ] },
    { title: 'Beholder', items: [['changeBeholderPaddingRight', 'beholder.switch1']] },
    { title: 'Cleanup', items: [
      ['cleanHeaderOnHome', 'cleanup.switch1'], ['actionAndOutputTips', 'cleanup.switch2'], ['hideLibraryFunction', 'cleanup.switch3'],
    ] },
  ];
  const toggle = (name: DevModeKeys, event: CustomEvent): void => {
    const value = event.detail?.checked;
    if (typeof value !== 'boolean' || value === Settings.devMode[name]) return;
    setDevModeSettings(name, value);
    setOptions({ ...Settings.devMode });
  };
  return <>{categories.map(category => <section key={category.title}>
    <Flex marginTop={1}><BdsTypo>{category.title}</BdsTypo></Flex>
    {category.items.map(([name, label]) => <Flex key={name} marginTop={0.5}>
      <BdsSwitch refer={name} checked={options[name]} name={name} onBdsChange={event => toggle(name, event)} size="short" />
      <Block marginLeft={1}><DescriptionText>{t('toastContainer.devModeConfig.' + label)}</DescriptionText></Block>
    </Flex>)}
  </section>)}</>;
};
