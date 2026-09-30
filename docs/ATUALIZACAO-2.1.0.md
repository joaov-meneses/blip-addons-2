# Atualização 2.1.0 — base Blip Addons 1.3.9

O nome da extensão continua **Blip Addons 2.0**. O número do pacote foi incrementado para **2.1.0**.

## Referência utilizada

O caminho informado estava sem os dois últimos caracteres do ID. A instalação encontrada foi:

`C:\Users\Joaov\AppData\Local\Google\Chrome\User Data\Profile 4\Extensions\gindjfmlebfgccocnjfeobedgeglpoeb\1.3.9_0`

O manifesto confirma **Blip Addons 1.3.9**. A entrega anterior usava o projeto local com manifesto 1.0.2, que não continha as novidades abaixo.

Foram recuperados **122 arquivos** dos mapas embutidos nos bundles `content.js`, `listener.js` e `popup.js` e dos módulos de tradução JSON: TypeScript/React, traduções, CSS e SVGs recompostos. Tipos sem representação nos bundles foram mantidos/complementados a partir do projeto anterior. Isso recupera os fontes distribuídos, não o histórico Git nem todos os arquivos do repositório original. Os hashes dos três bundles e a identificação da origem estão em `vendor/blip-addons-1.3.9/provenance.json`.

## Diferenças incorporadas

| Área | Base anterior | Atualização |
| --- | --- | --- |
| Popup | Ambientes, snippets e tags; painel inicial próprio da união | Organização de configurações da 1.3.9, idiomas e DEV mode; acesso adicional às integrações |
| Idioma | Textos principalmente em português | Português, inglês e espanhol, com bandeiras e seletor |
| Botões no Builder | Ícones antigos em listas HTML | Botões BDS atualizados; suporte à segunda barra de ferramentas |
| Painel Addons | Inatividade, trackings e inconsistências | Também estatísticas do bot e Quality Checker |
| Comentários | Ausentes | Criar, editar, buscar e remover comentários associados aos blocos; painel geral de comentários |
| DEV mode | Ausente | Seis ajustes: somente routers, cores por ambiente, espaçamento do Beholder, limpeza de header, dicas de ações/saídas e biblioteca de funções |
| Lista de bots | Filtro por ambiente | Controles BDS e cores de routers por ambiente |
| Contratos | Sem filtro adicional | Filtro e ajuste da lista de contratos |
| Serviços do router | Navegação padrão | Links diretos ao Builder dos serviços vinculados |
| Recursos/conteúdo | Sem botões extras | Copiar chave/conteúdo dos recursos |
| AutoTag | Atualização ao fechar o bloco | Atualização também ao trocar de bloco |

O **Quality Checker** abre o endereço externo `https://blip-extension-checklist-certificacao.cs.blip.ai/`. Sua disponibilidade não foi validada nesta sessão. As estatísticas são calculadas do fluxo carregado: blocos, ações HTTP, categorias únicas de tracking e scripts `ExecuteScript`.

Os comentários seguem o formato da 1.3.9: conteúdo em `flow.onboarding.addonsComments` e referências em `addonsSettings.commentsIdList` de cada bloco. Não são comentários enviados a outro serviço.

## Compatibilidade e correções durante a união

- O Better Blip Builder 3.0.46 permanece byte a byte igual, com suas 13 integrações e requisitos de ativação.
- O título da aba continua sob responsabilidade do Better Blip Builder para evitar conflito entre os dois módulos.
- A inicialização, canal de mensagens próprio, timeout, limpeza de listeners, snippets e nomes de classes preservados no build continuam aplicados.
- As funções de interceptação foram adaptadas para os novos recursos e preservam a execução/retorno original do controlador, sem acumular os mesmos callbacks.
- O popup usa a organização da nova base. Foram eliminadas categorias duplicadas de DEV mode e corrigidos os eventos dos switches para não alternarem recursivamente durante a renderização.
- As novas preferências são mescladas com os padrões, inclusive quando a instalação já tem configurações da versão 2.0.0.
- Corrigidas oito referências de tradução que não correspondiam às chaves dos arquivos distribuídos, cobrindo os três idiomas.
- A cópia de blocos limpa referências de comentários apenas no conteúdo copiado, preservando os comentários do bloco original e os metadados de integração.
- A restauração de estilo preserva os comentários; seletores e verificações de existência dos elementos de comentários foram corrigidos. O estado visual do botão de busca dos blocos comentados agora acompanha a ativação/desativação da busca.

## Entrega e validação

- `release/Blip-Addons-2.1.0.zip`: pacote para extrair e carregar no Chrome.
- `release/Blip-Addons-2.1.0-fonte.zip`: projeto recompilável com as referências recuperadas.
- `dist/`: extensão pronta para carregamento sem compactação.
- Os pacotes 2.0.0 anteriores permanecem em `release/` para referência.

Veja os resultados em [VALIDACAO.md](VALIDACAO.md). O Chrome permaneceu indisponível na conexão de automação; a confirmação visual e funcional no contrato Amber real continua pendente. Nenhum fluxo real foi alterado nesta atualização.
