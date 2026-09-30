import * as React from 'react';
import { BdsButton, BdsInputChips } from 'blip-ds/dist/blip-ds-react';

import { setSettings, Settings } from '~/Settings';
import { Paragraph } from '@components/Paragraph';
import { createToast } from '~/Utils';
import { t } from 'src/i18n';

export const KeywordsConfig = (): JSX.Element => {
  const [prodKey, setProdKey] = React.useState(Settings.prodKey);
  const [hmgKey, setHmgKey] = React.useState(Settings.hmgKey);
  const [betaKey, setBetaKey] = React.useState(Settings.betaKey);
  const [devKey, setDevKey] = React.useState(Settings.devKey);

  React.useEffect(() => {
    chrome.storage.sync.get('settings', ({ settings }) => {
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
      toastText: t('toastContainer.keywordConfig.toast.toastText'),
      toastTitle: t('toastContainer.keywordConfig.toast.toastTitle'),
      variant: 'success',
    });
  };

  return (
    <>
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <BdsInputChips
            label={t('toastContainer.keywordConfig.input1')}
            type="text"
            chips={prodKey}
            onBdsChangeChips={(e) => setProdKey(e.detail.data)}
          />

          <BdsInputChips
            label={t('toastContainer.keywordConfig.input2')}
            type="text"
            chips={hmgKey}
            onBdsChangeChips={(e) => setHmgKey(e.detail.data)}
          />

          <BdsInputChips
            label={t('toastContainer.keywordConfig.input3')}
            type="text"
            chips={betaKey}
            onBdsChangeChips={(e) => setBetaKey(e.detail.data)}
          />

          <BdsInputChips
            label={t('toastContainer.keywordConfig.input4')}
            type="text"
            chips={devKey}
            onBdsChangeChips={(e) => setDevKey(e.detail.data)}
          />

          <Paragraph>
            {t('toastContainer.keywordConfig.label')}
          </Paragraph>

          <div style={{ display: 'flex', justifyContent: 'right' }}>
            <BdsButton onClick={updateSettings} type="submit">
              {t('toastContainer.keywordConfig.saveButton')}
            </BdsButton>
          </div>
        </div>
      </div>
    </>
  );
};
