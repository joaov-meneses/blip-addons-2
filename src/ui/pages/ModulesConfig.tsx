import * as React from 'react';
import { BdsSwitch } from 'blip-ds/dist/blip-ds-react';
import { Settings, setSettings } from '~/Settings';
import { ModuleKey } from '~/ModuleSettings';
import { useModuleSettings } from '~/useModuleSettings';
import { t } from 'src/i18n';

export const ModulesConfig = (): JSX.Element => {
  const { modules } = useModuleSettings();
  const items: Array<[ModuleKey, string]> = [
    ['globalInactivity', t('sidebar.globalInactivity.title')],
    ['setGlobalTrackings', t('sidebar.setGlobalTrackings.title')],
    ['removeGlobalTrackings', t('sidebar.removeGlobalTrackings.title')],
    ['checkInconsistencies', t('sidebar.checkInconsistencies.title')],
    ['botStatistics', t('sidebar.botStatistics.title')],
    ['qualityChecker', t('sidebar.qualityChecker.title')],
    ['fixActionNames', t('sidebar.fixActionNames.title')],
  ];
  const toggle = (name: ModuleKey, event: CustomEvent): void => {
    const checked = event.detail?.checked;
    // BDS also emits on programmatic changes; only persist actual changes.
    if (typeof checked !== 'boolean' || checked === Settings.modules[name]) return;
    setSettings({ modules: { ...Settings.modules, [name]: checked } });
  };
  const option = (name: ModuleKey, label: string) => <div key={name} className="addons-module-option">
    <span id={`module-label-${name}`}>{label}</span>
    <BdsSwitch name={name} refer={`module-${name}`} aria-labelledby={`module-label-${name}`}
      checked={modules[name]} onBdsChange={event => toggle(name, event)} size="short" />
  </div>;
  return <div id="addons-modules-config">
    <p>{t('toastContainer.modulesConfig.description')}</p>
    <h3>{t('toastContainer.modulesConfig.sidebar')}</h3>
    {items.map(([name, label]) => option(name, label))}
    <h3>{t('toastContainer.modulesConfig.builder')}</h3>
    {option('newIntegration', t('toastContainer.modulesConfig.newIntegration'))}
    <p className="addons-note">{t('toastContainer.modulesConfig.integrationHelp')}</p>
    <p>{t('toastContainer.modulesConfig.saved')}</p>
  </div>;
};
