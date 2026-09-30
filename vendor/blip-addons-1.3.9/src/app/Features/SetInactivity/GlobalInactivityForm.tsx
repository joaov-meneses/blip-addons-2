import * as React from 'react';
import { BdsButton, BdsTypo } from 'blip-ds/dist/blip-ds-react';

import {
  Input,
  Paragraph,
  Switch,
  HorizontalStack,
  Flex,
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

        <Flex marginTop={2}>
          <Switch
            isChecked={shouldKeep}
            name="overwrite"
            onChange={(e) => setShouldKeep(e.target.checked)}
          />

          <Block marginLeft={2}>
            <BdsTypo bold="extra-bold" variant="fs-14">
              {t('sidebar.globalInactivity.switch.label')}
            </BdsTypo>
          </Block>
        </Flex>

        <HorizontalStack marginTop={2}>
          <BdsButton type="submit" variant="primary" onClick={handleSubmit}>
            {t('sidebar.globalInactivity.horizontalStack.buttonSubmit')}
          </BdsButton>

          <BdsButton variant="delete" onClick={handleRemove}>
            {t('sidebar.globalInactivity.horizontalStack.buttonRemove')}
          </BdsButton>
        </HorizontalStack>

        <Paragraph>
          {t('sidebar.globalInactivity.paragraph2.text1')}{' '}
          <b>{t('sidebar.globalInactivity.paragraph2.text2')}</b>{' '}
          {t('sidebar.globalInactivity.paragraph2.text3')}
        </Paragraph>
      </Block>
    </>
  );
};
