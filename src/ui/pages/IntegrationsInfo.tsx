import * as React from 'react';
import { Settings } from '~/Settings';

const integrations = ['ChatGPT', 'Active Campaign', 'RD Station', 'Tray', 'Google Sheets',
  'FAQ GPT', 'OpenAI Text to Speech', 'Gemini', 'Smart Sales', 'Smart Sales: Carrosséis',
  'Bitrix 24', 'Exact Spotter / Exact Sales', 'Dynamics 365'];
const copy = {
  ptbr: ['No Builder, abra o menu de adicionar blocos e escolha Nova integração. Na aba Integração do bloco, selecione o serviço e configure a ação.',
    'Use um bloco por integração. Você pode combinar vários blocos no mesmo fluxo.',
    'Os plugins que exigem instalação ou ativação na Blip Store continuam dependendo dessa configuração. Os serviços e o Script AI são fornecidos pela Wiv / White Wall.'],
  en: ['In Builder, open the add-block menu and choose New integration. On the block’s Integration tab, select a service and configure its action.',
    'Use one block per integration. You can combine multiple blocks in the same flow.',
    'Plugins that require installation or activation in the Blip Store still need that setup. Integration services and Script AI are provided by Wiv / White Wall.'],
  es: ['En Builder, abre el menú para añadir bloques y elige Nueva integración. En la pestaña Integración del bloque, selecciona el servicio y configura la acción.',
    'Usa un bloque por integración. Puedes combinar varios bloques en el mismo flujo.',
    'Los plugins que requieren instalación o activación en Blip Store siguen necesitando esa configuración. Wiv / White Wall proporciona los servicios y Script AI.'],
};
export const IntegrationsInfo = (): JSX.Element => {
  const text = copy[Settings.language] || copy.ptbr;
  return <div><p>{text[0]}</p><p>{text[1]}</p>
    <div className="addons-integrations">{integrations.map(name => <span key={name}>{name}</span>)}</div>
    <p className="addons-note">{text[2]}</p></div>;
};
