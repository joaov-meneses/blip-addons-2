import * as React from 'react';
import { mergeSettings } from '~/Settings';
import { KeywordsConfig } from './pages/KeywordConfig';
import { SnippetsConfig } from './pages/SnippetsConfig';
import { TagsConfig } from './pages/TagsConfig';

const integrations = ['ChatGPT', 'Active Campaign', 'RD Station', 'Tray', 'Google Sheets',
  'FAQ GPT', 'OpenAI Text to Speech', 'Gemini', 'Smart Sales', 'Smart Sales: Carrosséis',
  'Bitrix 24', 'Exact Spotter / Exact Sales', 'Dynamics 365'];
const pages = {
  home: 'Visão geral', keywordConfig: 'Ambientes', snippetsConfig: 'Snippets', tagConfig: 'Tags'
};
type Page = keyof typeof pages;

export const App = (): JSX.Element => {
  const [page, setPage] = React.useState<Page>('home');
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    chrome.storage.sync.get('settings', ({ settings }) => {
      mergeSettings(settings);
      setReady(true);
    });
  }, []);
  return <main>
    <header className="addons-header">
      <img src="icons/icon48.png" width="42" height="42" alt="" />
      <div><h1>Blip Addons <span>2.0</span></h1><p>Integrações e ferramentas para o seu Builder</p></div>
    </header>
    <nav aria-label="Configurações">
      {(Object.keys(pages) as Page[]).map(key => <button key={key} type="button"
        aria-current={page === key ? 'page' : undefined} onClick={() => setPage(key)}>{pages[key]}</button>)}
    </nav>
    <div className="toast-container" aria-live="polite"></div>
    <section className="addons-content">
      {!ready ? <p>Carregando configurações…</p> : page === 'home' ? <>
        <section className="addons-card">
          <h2>Adicionar uma integração</h2>
          <p>No Builder, abra o menu de adicionar blocos e escolha <strong>Integração</strong>.
            Na aba Integração do bloco, selecione o serviço e preencha os campos.</p>
          <p>Use um bloco por integração. Você pode combinar vários desses blocos no mesmo fluxo.</p>
          <div className="addons-integrations">{integrations.map(name => <span key={name}>{name}</span>)}</div>
          <p className="addons-note">Os plugins que exigem instalação ou ativação na Blip Store continuam
            dependendo dessa configuração. Os serviços e o Script AI são fornecidos pela Wiv / White Wall.</p>
        </section>
        <section className="addons-card">
          <h2>Ferramentas do Blip Addons</h2>
          <p>Na barra lateral do Builder, clique na estrela <strong>Blip Addons 2.0</strong> para usar
            inatividade global, trackings e verificação de inconsistências.</p>
          <p>Copie e cole blocos entre bots, personalize cores e formatos pelo menu dos blocos
            e configure ambientes, snippets e tags nas abas acima.</p>
        </section>
        <p className="addons-note">Após instalar, desative as duas extensões antigas e recarregue as abas da Blip.
          As preferências da instalação antiga precisam ser configuradas novamente.</p>
      </> : <><h2>{pages[page]}</h2>
        {page === 'keywordConfig' && <KeywordsConfig />}
        {page === 'snippetsConfig' && <SnippetsConfig />}
        {page === 'tagConfig' && <TagsConfig />}
      </>}
    </section>
    <footer>Blip Addons + Better Blip Builder · versão 2.0.0</footer>
  </main>;
};
