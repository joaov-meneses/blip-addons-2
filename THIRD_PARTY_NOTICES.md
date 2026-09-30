# Componentes de terceiros

Blip Addons 2.0 reúne duas bases fornecidas pelo usuário:

- **Blip Addons**: projeto `blips-extension`, manifesto 1.0.2, Copyright (c) 2022 Jota Júnior, licença MIT reproduzida em `vendor/LICENSE.blip-addons` (no pacote: `licenses/Blip-Addons.txt`). O código-fonte foi mantido e adaptado neste projeto.
- **Atualização Blip Addons 1.3.9**: extensão instalada de ID `gindjfmlebfgccocnjfeobedgeglpoeb`, com homepage `https://github.com/pmartinsesa/blip-addons`. Foram recuperados 122 arquivos a partir dos fontes/mapas e módulos JSON presentes no pacote, incorporando as mudanças à base anterior. Os SVGs foram recompostos a partir de seus componentes e o CSS extraído dos módulos do loader. A cópia de referência e os hashes dos bundles de origem ficam em `vendor/blip-addons-1.3.9`. Não havia arquivo adicional de licença no pacote instalado fornecido.
- **Better Blip Builder 3.0.46**: arquivos compilados da extensão de ID `nfdmafhaljeeonfglijopeoicnnpgleb`, autoria indicada no popup original: Wiv (https://wiv.com.br). Os arquivos de execução `blip-builder.js`, `inject.js` e `assets/` são preservados sem alterações. Não foi localizado arquivo de licença no pacote fornecido. A licença MIT do Blip Addons não se estende automaticamente a esse componente.

O pacote não inclui a chave pública de identificação nem a URL de atualização da extensão original no manifesto unificado. A identidade de instalação é independente.

As integrações, verificações de ativação e Script AI do componente Wiv continuam usando os serviços originais. As assinaturas, instalações na Blip Store e permissões do contrato continuam sendo exigidas pelo componente.

O Quality Checker da base 1.3.9 abre `https://blip-extension-checklist-certificacao.cs.blip.ai/` em um iframe quando o usuário aciona o botão correspondente. O funcionamento desse serviço externo depende de sua disponibilidade e permissões.

As dependências JavaScript mantêm seus avisos distribuídos nos arquivos `*.LICENSE.txt` gerados pelo build e nos arquivos do Blip Design System.
