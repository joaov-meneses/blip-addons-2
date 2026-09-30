# Blip Addons 2.0

Extensão Chrome Manifest V3 que reúne o **Better Blip Builder 3.0.46** e o **Blip Addons 1.3.9**, incluindo a interface e os recursos da versão instalada fornecida pelo usuário. Versão atual do pacote: **2.6.2**.

- [ZIP para instalação facilitada: Blip-Addons-2.6.2.zip](instalacao/Blip-Addons-2.6.2.zip). Ele já vem com a pasta `dist` pronta e está incluído no repositório.
- Quem recompilar o projeto também pode selecionar a pasta `dist/` gerada localmente.
- [Instruções de instalação](docs/INSTALACAO.md).
- [Habilitar/desabilitar módulos e Nova integração](docs/INSTALACAO.md#configurar-os-módulos).
- [Análise do funcionamento e da união](docs/ANALISE.md).
- [Diferenças e atualização para a base 1.3.9](docs/ATUALIZACAO-2.1.0.md).
- [Fix Action Names: configuração, funcionamento e atualização 2.2.0](docs/FIX-ACTION-NAMES.md).
- [Validação](docs/VALIDACAO.md).
- [Créditos e licenças](THIRD_PARTY_NOTICES.md).

## Instalação rápida no Chrome

1. Baixe o [ZIP de instalação](instalacao/Blip-Addons-2.6.2.zip) deste repositório e **extraia** seu conteúdo em uma pasta permanente. Dentro da extração haverá uma pasta chamada `dist`, que contém `manifest.json`.
2. No Chrome, acesse `chrome://extensions` e ative **Modo do desenvolvedor** no canto superior direito.
3. Clique em **Carregar sem compactação** e selecione **a pasta `dist` extraída**. Selecione a pasta, não o arquivo ZIP nem a pasta acima dela.
4. Confirme que **Blip Addons 2.0** aparece na lista e recarregue as abas da Blip que já estavam abertas.

Para evitar recursos duplicados, desative as extensões antigas **Better Blip Builder** e **Blip Addons** se estiverem instaladas. O ZIP é para extração e carregamento sem compactação; não precisa de Node.js para instalar. Veja [instruções de atualização e uso](docs/INSTALACAO.md).

## Recompilar

Node.js 22 e npm. No PowerShell, dentro desta pasta:

```powershell
npm ci --legacy-peer-deps
npm run build
npm test
npm run package
```

`npm run package` recompila, testa, atualiza o ZIP pronto em `instalacao/` e gera os ZIPs de distribuição e fontes em `release/`, além dos hashes SHA-256. `dist/` e `release/` ficam fora do Git; o ZIP em `instalacao/` é o arquivo distribuído pelo repositório.
`npm ci` usa o lockfile; `--legacy-peer-deps` mantém a compatibilidade das dependências do projeto original.

## Estrutura

| Pasta | Conteúdo |
| --- | --- |
| `src/` | Código TypeScript/React do Blip Addons adaptado |
| `vendor/better-blip-builder/` | Arquivos compilados originais preservados |
| `vendor/blip-addons-1.3.9/` | Fontes recuperados dos mapas da versão instalada, manifesto, ícones e hashes de origem |
| `static/` | Manifesto unificado, popup e ícones |
| `scripts/` | Build, ajustes de empacotamento e criação dos ZIPs |
| `tests/` | Testes de manifesto, integridade e execução em DOM simulado |
| `docs/` | Instalação, análise e resultados |

O projeto não depende das pastas originais para recompilar. O Better Blip Builder é distribuído aqui como componente compilado: formatar seu JavaScript para análise não recupera o projeto-fonte original.

No caso do Blip Addons 1.3.9, foi possível recuperar os fontes presentes nos mapas embutidos. O pacote contém os botões atualizados do Builder, comentários, estatísticas, Quality Checker, português/inglês/espanhol, DEV mode, filtros de contratos e recursos de copiar conteúdo. A página de integrações fica acessível no mesmo popup.

A versão 2.2.0 acrescenta **Fix Action Names**, abaixo de Quality Checker no painel do Builder: cinco modelos configuráveis, seleção de tipos de ação, prévia e aplicação dos nomes ao fluxo aberto. As preferências são salvas pela extensão.

A versão 2.3.0 acrescenta **Módulos do Builder** no popup, com oito controles persistentes. Verificar inconsistências, Estatísticas do bot e Quality Checker começam desabilitados. Os sete módulos do painel e o botão Nova integração podem ser ligados/desligados, com atualização das abas abertas.

A versão 2.4.0 acrescenta a aba nativa **Blip Builder 2.0** à direita de **Ações globais**, em **Configurações gerais**. Os formulários são compartilhados com a estrelinha e respeitam as mesmas preferências. A aba herda o provedor de tema do Builder e usa os componentes BDS já presentes no portal.

A versão 2.5.0 renomeia essa aba para **Builder 2.0**, concentra os utilitários nela e remove a estrelinha da barra lateral. Os formulários usam botões e espaçamento consistentes com o tema da Blip. Em Fix Action Names, **Aplicar** abre a confirmação antes de alterar o fluxo; o ícone à direita restaura os modelos padrão.

A versão 2.5.1 corrige a inicial maiúscula do botão **Definir** em Inatividade global.

A versão 2.6.0 reorganiza o popup em navegação lateral inspirada no projeto Create Templates. Os modelos de **Fix Action Names** passam a ser configurados em **Nomes das ações** no popup; o painel do Builder mostra um resumo, **Aplicar** e a restauração de padrões. Os botões de inatividade e trackings usam toda a largura disponível e os comandos de adicionar linha têm borda tracejada.

A versão 2.6.1 reduz a altura e a tipografia das linhas de ações em **Configuração das tags** no popup.

A versão 2.6.2 remove o botão **Reportar um problema** do menu lateral do popup.
