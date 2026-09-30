# Instalar o Blip Addons 2.0

1. Extraia **Blip-Addons-2.5.1.zip** para uma pasta permanente.
2. No Chrome, abra `chrome://extensions` e ative **Modo do desenvolvedor**.
3. Desative **Better Blip Builder** e **Blip Addons** antigos para evitar execução duplicada.
4. Clique em **Carregar sem compactação** e escolha a pasta extraída que contém `manifest.json`.
5. Recarregue as abas abertas da Blip. O nome da nova extensão será **Blip Addons 2.0**.

Se estiver usando o projeto diretamente, selecione sua pasta `dist` no passo 4.
O ZIP é um pacote para extração: não é um CRX assinado nem instala ao arrastar o arquivo para o navegador.

## Atualizar uma instalação do Blip Addons 2.0

Substitua os arquivos na **mesma pasta** já carregada no Chrome, clique em **Recarregar** no cartão da extensão em `chrome://extensions` e recarregue as abas da Blip. Quem carregou a pasta `dist` deste projeto pode apenas recarregar a extensão e as abas. Mantendo a mesma identidade de instalação, as preferências existentes continuam disponíveis. Confirme a versão **2.5.1** no cartão da extensão. Ao atualizar da 2.2.0, as preferências de módulos usam os padrões da tabela abaixo. Escolhas já salvas na 2.3.0 são preservadas.

## Usar

- **Integrações**: no Builder, abra o menu de adicionar blocos → **Nova integração**. Abra a aba **Integração**, selecione um dos 13 serviços e configure a ação. Use vários blocos para combinar integrações no fluxo.
- **Utilitários**: abra as configurações gerais do Builder e selecione a aba **Builder 2.0**, à direita de **Ações globais**. Se as abas não couberem no painel, use a seta nativa. Expanda o módulo desejado. Abrir a aba não altera o fluxo.
- **Fix Action Names**: na última seção da aba (abaixo de Quality Checker quando habilitado), escolha os tipos e edite os modelos. Clique em **Aplicar** e confirme para renomear as ações do fluxo aberto. O ícone circular à direita restaura os modelos padrão antes da aplicação. [Veja os modelos e exemplos](FIX-ACTION-NAMES.md).
- **Comentários**: o menu dos blocos permite criar/editar comentários; o botão de comentários na barra reúne os comentários do fluxo.
- **Estilo dos blocos**: use a opção de edição no menu contextual dos blocos.
- **Ambientes, snippets, tags e DEV mode**: abra o popup da extensão no Chrome. O seletor permite português, inglês e espanhol. A opção **Integrações do Builder** explica as 13 integrações mantidas.

## Configurar os módulos

Abra o popup da extensão no Chrome, onde ficam as configurações de palavras-chave, e entre em **Módulos do Builder**. Cada chave liga/desliga a seção correspondente na aba **Builder 2.0**, ou o botão Nova integração.

| Módulo | Padrão |
| --- | --- |
| Inatividade global | Habilitado |
| Adicionar trackings globais | Habilitado |
| Remover trackings globais | Habilitado |
| Verificar inconsistências no fluxo | Desabilitado |
| Estatísticas do bot | Desabilitado |
| Quality Checker | Desabilitado |
| Fix Action Names | Habilitado |
| Nova integração | Habilitado |

As escolhas são salvas automaticamente em `chrome.storage.sync`, para todos os bots desta instalação, e chegam às abas abertas. O painel já aberto também se atualiza. Não é necessário recarregar a aba a cada mudança de preferência; o recarregamento é necessário ao instalar esta atualização.

Módulos desabilitados não são montados na aba. Se todos os sete estiverem desligados, ela orienta como reativá-los pelo popup. Desabilitar **Nova integração** oculta o botão de criação e bloqueia seus cliques, inclusive quando o menu é recriado durante a navegação. A edição de integrações existentes e os demais recursos do Better Blip Builder continuam disponíveis.

As preferências alteram os controles da extensão, sem remover ações, renomear títulos nem modificar dados já gravados nos fluxos.

## Preferências e compatibilidade

Esta instalação tem identidade própria. As configurações de `chrome.storage.sync` da extensão Blip Addons antiga não são migradas automaticamente: refaça as palavras-chave, snippets e tags no novo popup. Dados do Better Blip Builder já gravados no próprio fluxo, como `$whiteWallIntegration`, e preferências guardadas no armazenamento do site mantêm seus formatos.

As integrações que exigem plugin instalado/ativado continuam exigindo essa configuração na Blip Store. O pacote conserva os serviços da Wiv / White Wall, inclusive o Script AI. Selecionar um serviço não instala nem ativa seu plugin. O Quality Checker também depende do serviço externo original.

Build e 19 testes automatizados locais foram executados. A versão 2.5.0 foi conferida no Chrome conectado ao contrato Ember após recarga: a aba, os formulários, os botões e a confirmação foram verificados no tema escuro. As operações de aplicação em massa não foram executadas no bot real. Veja as capturas e os limites em `docs/VALIDACAO.md` do projeto-fonte.

Para validar no portal, prefira um fluxo de teste: confira a abertura de Nova integração, os 13 serviços, uma integração já instalada, a aba Builder 2.0 e copiar/colar entre dois bots de teste. Em Fix Action Names, clique em Aplicar, confira a confirmação e, se confirmar, abra as ações para verificar os títulos. As mudanças realizadas nos fluxos pelo usuário continuam sujeitas aos comandos normais de salvar/publicar da Blip.

Para voltar à versão anterior, desative esta extensão, reative as duas anteriores e recarregue as abas.
