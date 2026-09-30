# Fix Action Names — pacote 2.5.0

A seção **Fix Action Names** fica na aba **Builder 2.0** das configurações gerais, imediatamente abaixo de **Quality Checker** quando esse módulo está habilitado.

## Como usar

1. Abra o bot no Builder, entre em **Configurações gerais → Builder 2.0** e expanda **Fix Action Names**.
2. Marque os tipos de ação que deseja renomear e edite seus modelos.
3. Clique em **Aplicar**. A janela de confirmação aparece antes de qualquer mudança no fluxo. **Cancelar** preserva os nomes atuais.
4. Ao confirmar, a extensão calcula os nomes usando o fluxo atual e altera somente o campo `$title` das ações selecionadas. O resultado mostra a contagem e até dez exemplos de antes/depois.
5. Revise o fluxo e use os comandos normais de salvar/publicar do Builder. A extensão não chama a publicação.

Os modelos são compartilhados entre os bots desta instalação, como as outras preferências do Addons. São salvos em `chrome.storage.sync` após a confirmação. Nomes gerados, valores de ações e conteúdo do fluxo não são enviados ao armazenamento de preferências.

O botão com ícone de seta circular à direita de **Aplicar** preenche novamente os padrões abaixo. Ele não desfaz nomes já aplicados. Para salvar os padrões restaurados, clique em **Aplicar** e confirme.

## Modelos iniciais

| Tipo | Modelo |
| --- | --- |
| TrackEvent | `Track "{{category}}"` |
| ExecuteScript / ExecuteScriptV2 | `Process "{{outputVariable}}"` |
| ProcessHttp | `Request "{{responseBodyVariable}}" using "{{method}}"` |
| ProcessCommand | `Request "{{variable}}" using "{{method}}"` |
| SetVariable | `Set "{{value}}" to "{{variable}}"` |

Um marcador `{{campo}}` lê a propriedade direta `settings.campo` da ação. Exemplos: `Evento {{category}}: {{action}}`, `HTTP {{method}} — {{responseBodyVariable}}` ou `Definir {{variable}}`. Pode repetir um marcador no mesmo modelo. Texto fixo também é aceito. Não são avaliadas expressões JavaScript nem caminhos como `settings.campo` dentro dos marcadores.

A opção de exibir `{variavel}` nos nomes começa ligada para acompanhar o script original. Por exemplo, se `settings.value` for `{{contact.name}}`, o nome gerado poderá ser `Set "{contact.name}" to "nome"`. Desligando essa opção, o título conserva as chaves duplas. O valor real em `settings.value` permanece igual em ambos os casos.

## O que foi aproveitado e ajustado no script

O arquivo fornecido `fixActionNames.js` lê um JSON exportado de um caminho fixo, percorre os objetos, identifica cinco tipos de ação e sobrescreve `$title` com os valores encontrados em `settings`. O argumento `property` da função `modifyProperty` não é utilizado. Ao final, o script sobrescreve o arquivo JSON original.

A implementação no Addons opera diretamente em `getController().flow`, usando o controlador AngularJS do canvas, como os utilitários existentes. Percorre o fluxo carregado, incluindo ações de entrada, saída e conteúdo e estruturas aninhadas. Não busca outros bots nem subfluxos que não estejam presentes nesse objeto. A categoria de script também contempla `ExecuteScriptV2`, já reconhecida pela base 1.3.9.

As substituições são feitas independentemente para cada ação, incluindo todas as ocorrências dos marcadores e espaços ao redor do nome do campo. Valores com `$&` são tratados como texto. Os tipos desmarcados e os demais tipos de ação são preservados. Configurações, payloads de mensagens, metadados de integrações e comentários não são tratados como ações para renomear.

Quando um marcador não existe, é nulo ou corresponde a um objeto/array, a ação é ignorada e mantém seu título; o painel mostra a contagem e até cinco exemplos dos campos problemáticos. Valores `0` e `false` são válidos. Modelos vazios de tipos selecionados impedem a aplicação. Referências cíclicas ou repetidas não provocam loops ou contagens duplicadas.

## Como funcionam as opções globais já existentes

- **Inatividade global**: percorre os blocos, identifica entradas que esperam resposta e altera `input.expiration`. Exclui os blocos `onboarding`, `fallback` e `error` e as entradas com `bypass`. A opção de manter tempos já preenchidos limita quais entradas serão alteradas.
- **Adicionar trackings globais**: percorre `$enteringCustomActions` e `$leavingCustomActions`, seleciona as ações `TrackEvent` existentes e altera `settings.extras`. Pode mesclar as propriedades ou substituir as extras atuais. Essa rotina não cria novos eventos `TrackEvent` nos blocos.

Nesses recursos, “global” indica uma operação em vários blocos do fluxo aberto. Fix Action Names segue o mesmo acesso ao fluxo, com confirmação e modelos configuráveis.

## Validação

Build concluído e 19 testes automatizados aprovados. Os testes verificam os modelos, V2, campos ausentes, repetição, valores de variáveis, preservação das configurações, confirmação e cancelamento sem mutação, tipos desmarcados e persistência ao reabrir a aba.

A interface 2.5.0 foi inspecionada no Chrome conectado ao contrato Ember. O botão **Aplicar** abriu a confirmação e o cancelamento encerrou a janela sem alterar o fluxo. O ícone de restauração e a disposição dos controles foram conferidos no tema escuro. Nenhum bot real foi alterado nesta entrega.
