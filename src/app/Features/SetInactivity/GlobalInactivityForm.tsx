import * as React from 'react';
import { BdsTypo } from 'blip-ds/dist/blip-ds-react';

import {
  Input,
  Paragraph,
  Switch,
  Block,
} from '~/Components';
import { setSettings, Settings } from '~/Settings';
import { SetInactivity } from '@features/SetInactivity';
import { RemoveInactivity } from '@features/RemoveInactivity';
import { createConfirmationAlert, removeOverlay } from '~/Utils';
import { t } from '../../../i18n';

export const GlobalInactivityForm = (): JSX.Element => {
  const [waitingTime, setWaitingTime] = React.useState(
    Settings.lastGlobalInactivityTime
  );
  const [shouldKeep, setShouldKeep] = React.useState(false);
  const [error, setError] = React.useState('');

  /**
   * Runs the 'SetInactivity' fature, thus adding the defined
   * waiting limit time to all blocks with input
   */
  const handleSubmit = (): void => {
    if (!waitingTime) {
      setError(t('sidebar.globalInactivity.validation.required'));
      return;
    }

    const time = Number(waitingTime);
    const isTimeValid = time > 0 && time < 1380;

    if (!isTimeValid) {
      setError(t('sidebar.globalInactivity.validation.invalid'));
      return;
    }

    setError('');
    setSettings({
      lastGlobalInactivityTime: waitingTime,
    });

    createConfirmationAlert({
      onCancel: removeOverlay,
      onConfirm: () => {
        new SetInactivity().handle(time, shouldKeep);
        removeOverlay();
      },
    });
  };

  /**
   * Runs the 'RemoveInactivity' feature, thus removing the defined
   * waiting limit time to all blocks with input
   */
  const handleRemove = (): void => {
    createConfirmationAlert({
      onCancel: () => removeOverlay(),
      onConfirm: () => {
        new RemoveInactivity().handle();
        removeOverlay();
      },
    });
  };

  return (
    <>
      <Paragraph>
        {t('sidebar.globalInactivity.paragraph1.text1')}
        <br />
        <b>{t('sidebar.globalInactivity.paragraph1.text2')}</b>
      </Paragraph>

      <Block marginTop={2}>
        <Input
          value={waitingTime}
          onChange={(e) => setWaitingTime(e.target.value)}
          onSubmit={handleSubmit}
          errorMessage={error}
          label={t('sidebar.globalInactivity.input.label')}
          type="number"
        />

        <div className="addons-form-option">
          <Switch
            isChecked={shouldKeep}
            name="overwrite"
            onChange={(e) => setShouldKeep(e.target.checked)}
          />

          <BdsTypo bold="extra-bold" variant="fs-14">
            {t('sidebar.globalInactivity.switch.label')}
          </BdsTypo>
        </div>

        <div className="addons-form-actions">
          <button type="button" className="addons-action addons-action--primary" onClick={handleSubmit}>
            {t('sidebar.globalInactivity.horizontalStack.buttonSubmit')}
          </button>

          <button type="button" className="addons-action addons-action--secondary" onClick={handleRemove}>
            {t('sidebar.globalInactivity.horizontalStack.buttonRemove')}
          </button>
        </div>

        <div className="addons-form-note"><Paragraph>
          {t('sidebar.globalInactivity.paragraph2.text1')}{' '}
          <b>{t('sidebar.globalInactivity.paragraph2.text2')}</b>{' '}
          {t('sidebar.globalInactivity.paragraph2.text3')}
        </Paragraph></div>
      </Block>
    </>
  );
};
