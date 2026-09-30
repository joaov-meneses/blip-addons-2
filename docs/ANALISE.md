# Análise e união das extensões

> Histórico da união inicial 2.0.0. A versão atual 2.1.0 substitui a base antiga do Addons pela 1.3.9, incluindo sua interface. Veja [diferenças e atualização](ATUALIZACAO-2.1.0.md). A análise do Better Blip Builder abaixo continua válida, pois esse componente foi preservado.

## Bases analisadas

1. **Better Blip Builder 3.0.46**, ID `nfdmafhaljeeonfglijopeoicnnpgleb`. A pasta encontrada foi `3.0.46_0`, dentro do Profile 4 do Chrome. O pacote contém `blip-builder.js`, `inject.js`, um popup simples com crédito à Wiv, ícones, CSS e fonte. Não há projeto-fonte ou source maps nesse pacote.
2. **Blip Addons**, projeto `blips-extension`, com manifesto 1.0.2 e package.json 0.0.1. O projeto tem código TypeScript/React, Webpack e licença MIT. O service worker original estava vazio.

## Como a primeira extensão adiciona integrações

O manifesto carrega `blip-builder.js` nas páginas `*.blip.ai`, inclusive frames. Esse arquivo roda no contexto isolado da extensão, injeta a interface e carrega `inject.js` no contexto JavaScript da página. A ponte é necessária para acessar os controladores e serviços AngularJS internos da Blip. Essa separação corresponde ao [modelo de content scripts do Chrome](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts).

O helper obtém o controlador com `window.angular.element(document.getElementById('canvas')).controller()`. Ele observa o estado de carregamento e a abertura do menu de blocos, intercepta a edição dos blocos e troca eventos via `window.postMessage` com a interface.

O botão **Nova integração** é montado nos elementos `.builder-add-button` e `#container-buttons-add`. Ao clicar:

1. A interface emite `blip-builder-add-integration-block`.
2. O helper chama `createContentState('Nova integração')`.
3. Ele acrescenta o prefixo `ww:` ao ID e cria a propriedade `$whiteWallIntegration`.
4. O controlador adiciona e abre o bloco com `addAndEditState`.
5. Ao editar esse bloco, a extensão apresenta a aba **Integração** no lugar da interface habitual de ações e monta seu formulário.

Portanto, trata-se de uma interface adicional sobre blocos e ações do próprio Builder. Não é um sistema de instalação de extensões Chrome dentro da Blip.

## Como funciona a seleção de várias integrações

O catálogo é um mapa fixo de componentes incluído no JavaScript compilado. Um `bds-select` lista estas 13 opções:

| Opção | Identificador interno |
| --- | --- |
| ChatGPT | `chatgpt` |
| Active Campaign | `activecampaign` |
| RD Station | `rdstation` |
| Tray | `tray` |
| Google Sheets | `gsheets` |
| FAQ GPT | `faqgpt` |
| OpenAI Text to Speech | `openaitexttospeech` |
| Gemini | `gemini` |
| Smart Sales | `smartsales` |
| Smart Sales: Carrosséis | `smartsalescarousels` |
| Bitrix 24 | `bitrix` |
| Exact Spotter / Exact Sales | `exactspotter` |
| Dynamics 365 | `dynamics` |

**Cada bloco seleciona uma integração.** Para usar várias no mesmo fluxo, adicionam-se vários blocos e conectam-se suas saídas. Não foi encontrado um mecanismo de carregar arbitrariamente outra extensão Chrome ou adicionar plugins ao catálogo por configuração. Ampliar esse catálogo exige implementar outra integração no código.

A seleção e o formulário são persistidos em `$whiteWallIntegration = { type, configuration }`. Os componentes geram ações normais (`SetVariable`, `ProcessCommand`, `ProcessHttp`, scripts e outras) e atualizam `$leavingCustomActions`, `$enteringCustomActions` ou `$contentActions` conforme o serviço. A interface informa que, em geral, as integrações são executadas como ações de saída; Smart Sales tem tratamento específico. As alterações passam por `blip-builder-update-state-property` e `saveState` do Builder. A extensão não substitui a publicação normal do fluxo.

## Ativação e serviços externos

Para a maior parte do catálogo, a extensão lê o bucket `ww<pluginId>pk` no bot e verifica `/activated` no serviço `https://southamerica-east1-ww-blip-plugins.cloudfunctions.net`, enviando identificador do plugin, do bot e chave pública. A verificação tem cache de cinco minutos. Sem ativação, o formulário mostra a orientação de instalar o plugin pela Blip Store. Smart Sales e seus carrosséis têm tratamento próprio, incluindo `https://api.smartsales.whitewall.dev`.

Os comandos Blip usam os serviços AngularJS da sessão (`MessagingHubService` ou `BlipService`). A extensão não adiciona permissões ao contrato. Os fluxos gerados podem consultar buckets e chamar os serviços externos em execução; juntar as extensões não remove essa dependência.

O **Script AI** intercepta o editor Monaco e usa os endpoints `scriptassistant_chat` e `scriptassistant_complete`. As requisições podem conter código/contexto do editor, mensagens, identificador do bot/contrato e chave pública. Esses comportamentos são do componente original, preservado. Não foram feitas chamadas a esses serviços durante a validação local.

Outros recursos encontrados: título com nome do bot e seção, filtros/favoritos na lista de bots, ajustes de paginação, carregamento de imagens e cache de consultas do portal, renomeação de ações e assistência de código. A análise comprova o que o código implementa; não comprova disponibilidade atual dos serviços externos.

## O que foi unificado e ajustado

- Um manifesto MV3, nome **Blip Addons 2.0**, versão 2.0.0 e popup único com orientações, ambientes, snippets e tags.
- Os arquivos de execução do Better Blip Builder são copiados sem alteração e verificados por hash nos testes.
- O projeto Blip Addons é recompilado; seus recursos de fluxo, copiar/colar, estilo, tags, snippets e filtros permanecem incluídos.
- O título da aba fica sob responsabilidade do Better Blip Builder, que já mostra bot e seção, evitando dois módulos disputando o mesmo título.
- A ponte do Addons tem canal próprio e verifica origem, janela e formato das mensagens para não processar mensagens do outro módulo. Isso organiza os módulos; o contexto da página continua compartilhado com a própria Blip.
- As preferências são carregadas antes da injeção do listener e propagadas às abas quando mudam. A consulta de prontidão usa polling sem sobreposição e timeout das respostas.
- As instâncias de recursos são reaproveitadas entre ativação e limpeza; copiar/colar pode voltar a funcionar depois da navegação. Texto comum colado e edição em inputs não são tratados como blocos.
- Wrappers de funções preservam chamadas existentes. AutoTag deixa de substituir o fechamento do sidebar, preservando as modificações do módulo de integrações. A edição visual deixa de acumular wrappers a cada novo bloco.
- O provider de snippets é descartado no cleanup, retorna o formato Monaco atual e pode capturar o namespace pelo controlador do editor quando ele não está global.
- O build preserva nomes de classes usados como códigos de recursos, usa chunks locais e inclui recursos do Design System. Os imports de Google Fonts dos componentes compilados do popup são retirados para usar fallback local.
- O manifesto não contém o `key` ou `update_url` da instalação da Chrome Web Store, nem o service worker vazio. A única permissão de API é `storage`, além do acesso aos mesmos hosts `*.blip.ai` usados pelo primeiro componente.

## Limites

Os seletores DOM e as APIs AngularJS são internos da Blip e podem mudar. Os testes usam uma simulação desses elementos e serviços; não substituem o teste no contrato Amber real. A sessão de automação não expôs navegadores ou abas acessíveis. Nenhum bot do contrato foi editado ou publicado nesta execução.

As preferências de `chrome.storage.sync` do Addons antigo pertencem ao ID antigo e precisam ser reconfiguradas. A estrutura dos blocos de integração e o armazenamento do site foram preservados. Veja também os créditos e condições de cada base em `THIRD_PARTY_NOTICES.md`.
