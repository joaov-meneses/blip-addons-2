import * as React from 'react';
import { BdsIcon } from 'blip-ds/dist/blip-ds-react';
import { mergeSettings, setSettings, Settings } from '~/Settings';
import { t } from 'src/i18n';
import { LanguageSelect } from 'src/components/LanguageSelect';
import { KeywordsConfig } from './pages/KeywordConfig';
import { SnippetsConfig } from './pages/SnippetsConfig';
import { TagsConfig } from './pages/TagsConfig';
import { DevMode } from './pages/DevMode';
import { IntegrationsInfo } from './pages/IntegrationsInfo';
import { ModulesConfig } from './pages/ModulesConfig';
import { ActionNamesConfig } from './pages/ActionNamesConfig';

type Page = 'home' | 'modules' | 'actionNames' | 'integrations' | 'keywordConfig' |
  'snippetsConfig' | 'tagConfig' | 'DevMode';

export const App = (): JSX.Element => {
  const [page, setPage] = React.useState<Page>('home');
  const [language, setLanguage] = React.useState(Settings.language);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    chrome.storage.sync.get('settings', result => {
      mergeSettings(result.settings);
      setLanguage(Settings.language);
      setReady(true);
    });
  }, []);

  const pages: Record<Page, { title: string; description: string; icon: string; component?: JSX.Element }> = {
    home: {
      title: t('toastContainer.popupNavigation.home', language),
      description: t('toastContainer.popupNavigation.homeDescription', language),
      icon: 'home',
    },
    modules: {
      title: t('toastContainer.modulesConfig.title', language),
      description: t('toastContainer.modulesConfig.description', language),
      icon: 'settings-general', component: <ModulesConfig />,
    },
    actionNames: {
      title: t('toastContainer.actionNamesConfig.title', language),
      description: t('toastContainer.actionNamesConfig.description', language),
      icon: 'edit', component: <ActionNamesConfig />,
    },
    integrations: {
      title: t('toastContainer.popupNavigation.integrations', language),
      description: t('toastContainer.popupNavigation.integrationsDescription', language),
      icon: 'plugin', component: <IntegrationsInfo />,
    },
    keywordConfig: {
      title: t('toastContainer.keywordConfig.title', language),
      description: t('toastContainer.popupNavigation.keywordsDescription', language),
      icon: 'filter', component: <KeywordsConfig />,
    },
    snippetsConfig: {
      title: t('toastContainer.snippetsConfig.title', language),
      description: t('toastContainer.popupNavigation.snippetsDescription', language),
      icon: 'file-java-script', component: <SnippetsConfig />,
    },
    tagConfig: {
      title: t('toastContainer.tagConfig.title', language),
      description: t('toastContainer.popupNavigation.tagsDescription', language),
      icon: 'tag', component: <TagsConfig />,
    },
    DevMode: {
      title: t('toastContainer.devModeConfig.title', language),
      description: t('toastContainer.popupNavigation.devDescription', language),
      icon: 'notebook', component: <DevMode />,
    },
  };

  const handleLanguageChange = (event: any): void => {
    const next = event?.detail?.value;
    if (!['ptbr', 'en', 'es'].includes(next) || next === Settings.language) return;
    setSettings({ language: next });
    setLanguage(next);
  };

  if (!ready) return <p className="addons-loading">{t('toastContainer.popupNavigation.loading', language)}</p>;

  const navGroups: Array<{ title: string; pages: Page[] }> = [
    { title: t('toastContainer.popupNavigation.builder', language), pages: ['modules', 'actionNames', 'integrations'] },
    { title: t('toastContainer.popupNavigation.personalization', language), pages: ['keywordConfig', 'snippetsConfig', 'tagConfig'] },
    { title: t('toastContainer.popupNavigation.advanced', language), pages: ['DevMode'] },
  ];

  return <div className="addons-popup-shell">
    <header className="addons-popup-topbar">
      <div className="addons-popup-brand">
        <img src="icons/icon48.png" width="32" height="32" alt="" />
        <span>Blip Addons <strong>2.0</strong></span>
      </div>
      <LanguageSelect value={language} onChange={handleLanguageChange} />
    </header>
    <div className="addons-popup-layout">
      <aside className="addons-popup-sidebar">
        <nav aria-label={t('toastContainer.popupNavigation.navigation', language)}>
          <button type="button" className={`addons-popup-nav-button ${page === 'home' ? 'active' : ''}`}
            aria-current={page === 'home' ? 'page' : undefined} onClick={() => setPage('home')}>
            <BdsIcon name={pages.home.icon} size="small" theme="outline" />{pages.home.title}
          </button>
          {navGroups.map(group => <div key={group.title} className="addons-popup-nav-group">
            <span className="addons-popup-nav-label">{group.title}</span>
            {group.pages.map(key => <button key={key} type="button"
              className={`addons-popup-nav-button ${page === key ? 'active' : ''}`}
              aria-current={page === key ? 'page' : undefined} onClick={() => setPage(key)}>
              <BdsIcon name={pages[key].icon} size="small" theme="outline" />{pages[key].title}
            </button>)}
          </div>)}
        </nav>
        <div className="addons-popup-sidebar-footer">
          <small>{t('toastContainer.popupNavigation.version', language)} 2.6.2</small>
        </div>
      </aside>
      <main className="addons-popup-main" id="addons-popup-main">
        <div className="toast-container" />
        <header className="addons-popup-page-header">
          <div className="addons-popup-page-icon"><BdsIcon name={pages[page].icon} size="medium" theme="outline" /></div>
          <div>
            <h1>{pages[page].title}</h1>
            <p>{pages[page].description}</p>
          </div>
        </header>
        {page === 'home' ? <div className="addons-popup-home">
          <div className="addons-popup-feature-grid">
            {(['modules', 'actionNames', 'keywordConfig', 'snippetsConfig'] as Page[]).map(key =>
              <button key={key} type="button" className="addons-popup-feature-card" onClick={() => setPage(key)}>
                <BdsIcon name={pages[key].icon} size="medium" theme="outline" />
                <strong>{pages[key].title}</strong>
                <span>{pages[key].description}</span>
              </button>)}
          </div>
          <p className="addons-popup-home-note">{t('toastContainer.popupNavigation.builderHint', language)}</p>
        </div> : <div className="addons-popup-page-content">{pages[page].component}</div>}
      </main>
    </div>
  </div>;
};
