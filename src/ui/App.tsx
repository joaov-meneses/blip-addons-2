/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import {
  BdsButton,
  BdsButtonIcon,
  BdsIcon,
  BdsTooltip,
} from 'blip-ds/dist/blip-ds-react';

import { Flex } from '@components/Flex';
import { ISSUES_URL } from '~/Constants';
import { mergeSettings, setSettings, Settings } from '~/Settings';

import { KeywordsConfig } from './pages/KeywordConfig';
import { SnippetsConfig } from './pages/SnippetsConfig';
import { TagsConfig } from './pages/TagsConfig';
import { DevMode } from './pages/DevMode';
import { t } from 'src/i18n';
import { LanguageSelect } from 'src/components/LanguageSelect';
import { IntegrationsInfo } from './pages/IntegrationsInfo';
import { ModulesConfig } from './pages/ModulesConfig';

type Page =
  | 'keywordConfig'
  | 'snippetsConfig'
  | 'tagConfig'
  | 'DevMode'
  | 'integrations'
  | 'modules'
  | 'home';

const openIssue = (): void =>
  chrome.tabs.create({
    active: true,
    url: ISSUES_URL,
  });

export const App = (): JSX.Element => {
  const [page, setPage] = React.useState('home' as Page);
  const [language, setLanguage] = React.useState(Settings.language);
  const [ready, setReady] = React.useState(false);

  const Pages = React.useMemo(
    () => ({
      keywordConfig: {
        title: t('toastContainer.keywordConfig.title', language),
        component: <KeywordsConfig />,
        icon: 'filter',
      },

      snippetsConfig: {
        title: t('toastContainer.snippetsConfig.title', language),
        component: <SnippetsConfig />,
        icon: 'file-java-script',
      },

      tagConfig: {
        title: t('toastContainer.tagConfig.title', language),
        component: <TagsConfig />,
        icon: 'tag',
      },

      modules: {
        title: t('toastContainer.modulesConfig.title', language),
        component: <ModulesConfig />,
        icon: 'settings-general',
      },

      DevMode: {
        title: t('toastContainer.devModeConfig.title', language),
        component: <DevMode />,
        icon: 'notebook',
      },
      integrations: {
        title: language === 'en' ? 'Builder integrations' : language === 'es' ? 'Integraciones del Builder' : 'Integrações do Builder',
        component: <IntegrationsInfo />,
        icon: 'plugin',
      },
    }),
    [language]
  );

  const goTo = (page: Page) => () => setPage(page);

  // Use effect para pegar primeiro carregamento
  React.useEffect(() => {
    const handleSettingsUpdate = (event: MessageEvent) => {
      if (event.data?.isSettingsUpdate && event.data?.newSettings?.language) {
        setLanguage(event.data.newSettings.language);
      }
    };

    window.addEventListener('message', handleSettingsUpdate);
    return () => window.removeEventListener('message', handleSettingsUpdate);
  }, []);

  React.useEffect(() => {
    chrome.storage.sync.get('settings', (result) => {
      mergeSettings(result.settings);
      setLanguage(Settings.language);
      setReady(true);
    });
  }, []);

  const handleLanguageChange = (e: any) => {
    const languageByMenuSelect = e?.detail?.value || null;

    const newLanguage = languageByMenuSelect ?? language;
    if (!['ptbr', 'en', 'es'].includes(newLanguage) || newLanguage === Settings.language) return;

    setSettings({ language: newLanguage });
    setLanguage(newLanguage);
  };

  if (!ready) return <p style={{ padding: 15 }}>Carregando configurações…</p>;

  if (page === 'home') {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ padding: 15 }}>
          <Flex alignItems="center" gap={8}>
            <BdsIcon color="black" name="settings-general" />
            <h2>{t('toastContainer.title', language).replace('Blip Addons', 'Blip Addons 2.0')}</h2>
            <LanguageSelect
              value={language}
              onChange={handleLanguageChange}
              style={{ marginLeft: 'auto' }}
            />
          </Flex>
          <div style={{ width: '80%', textAlign: 'left' }}>
            <h3>{t('toastContainer.sectionResource', language)}</h3>

            {Object.keys(Pages).map((page, i) => (
              <div key={i} style={{ marginBottom: 5 }}>
                <BdsButton
                  icon={Pages[page].icon}
                  variant="secondary"
                  onClick={goTo(page as keyof typeof Pages)}
                >
                  {Pages[page].title}
                </BdsButton>
              </div>
            ))}

            <h3>{t('toastContainer.sectionExternalAddress', language)}</h3>

            <BdsButton icon="warning" variant="secondary" onClick={openIssue}>
              {t('toastContainer.reportIssue', language)}
            </BdsButton>
            <p className="addons-note">Blip Addons 1.3.9 + Better Blip Builder 3.0.46 · pacote 2.5.1</p>
          </div>
        </div>
      </div>
    );
  }

  const currentPage = Pages[page];

  return (
    <div style={{ position: 'relative', padding: 15 }}>
      <div
        className="toast-container"
        style={{
          position: 'absolute',
        }}
      ></div>

      <Flex alignItems="center" gap={5}>
        <BdsTooltip position="right-center" tooltipText="Voltar">
          <BdsButtonIcon
            size="short"
            onClick={goTo('home')}
            variant="secondary"
            icon="arrow-left"
          />
        </BdsTooltip>

        <h2>{currentPage.title}</h2>
      </Flex>

      <div style={{ width: '80%', margin: '0 auto' }}>
        {currentPage.component}
      </div>
    </div>
  );
};
