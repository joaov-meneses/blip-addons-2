import * as React from 'react';
import { BdsButton, BdsInputChips } from 'blip-ds/dist/blip-ds-react';

import { setSettings, Settings } from '~/Settings';
import { Paragraph } from '@components/Paragraph';
import { createToast } from '~/Utils';

export const KeywordsConfig = (): JSX.Element => {
  const [prodKey, setProdKey] = React.useState(Settings.prodKey);
  const [hmgKey, setHmgKey] = React.useState(Settings.hmgKey);
  const [betaKey, setBetaKey] = React.useState(Settings.betaKey);
  const [devKey, setDevKey] = React.useState(Settings.devKey);

  React.useEffect(() => {
    chrome.storage.sync.get('settings', ({ settings = Settings }) => {
      setProdKey(settings.prodKey);
      setHmgKey(settings.hmgKey);
      setBetaKey(settings.betaKey);
      setDevKey(settings.devKey);
    });
  }, []);

  const updateSettings = (): void => {
    setSettings({
      prodKey,
      hmgKey,
      betaKey,
      devKey,
    });

    createToast({
      toastText: 'Dados salvo com sucesso',
      toastTitle: 'Sucesso novo toast!',
      variant: 'success',
    });
  };

  return (
    <>
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <BdsInputChips
            label="Palavres chaves da PRODUÇÃO"
            type="text"
            chips={prodKey}
            onBdsChangeChips={(e) => setProdKey(e.detail.data)}
          />

          <BdsInputChips
            label="Palavres chaves de HOMOLOGAÇÃO"
            type="text"
            chips={hmgKey}
            onBdsChangeChips={(e) => setHmgKey(e.detail.data)}
          />

          <BdsInputChips
            label="Palavres chaves de BETA"
            type="text"
            chips={betaKey}
            onBdsChangeChips={(e) => setBetaKey(e.detail.data)}
          />

          <BdsInputChips
            label="Palavres chaves de DESENVOLVIMENTO"
            type="text"
            chips={devKey}
            onBdsChangeChips={(e) => setDevKey(e.detail.data)}
          />

          <Paragraph>
            * Recarregue as páginas do builder abertas para carregar os novos
            ajustes.
          </Paragraph>

          <div style={{ display: 'flex', justifyContent: 'right' }}>
            <BdsButton onClick={updateSettings} type="submit">
              Salvar
            </BdsButton>
          </div>
        </div>
      </div>
    </>
  );
};
