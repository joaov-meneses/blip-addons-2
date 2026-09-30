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
      setError('Preencha com um valor entre 1 e 1380');
      return;
    }

    const time = Number(waitingTime);
    const isTimeValid = time > 0 && time < 1380;

    if (!isTimeValid) {
      setError('Utilize números entre 1 e 1380');
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
        Todos os blocos que esperam por uma entrada do usuário terão seu limite
        de espera setados para o valor abaixo.
        <br />
        <b>Você ainda precisa publicar o fluxo</b>
      </Paragraph>

      <Block marginTop={2}>
        <Input
          value={waitingTime}
          onChange={(e) => setWaitingTime(e.target.value)}
          onSubmit={handleSubmit}
          errorMessage={error}
          label="Limite de espera (em minutos)"
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
              Manter limite de espera se já estiver definido
            </BdsTypo>
          </Block>
        </Flex>

        <HorizontalStack marginTop={2}>
          <BdsButton type="submit" variant="primary" onClick={handleSubmit}>
            Definir
          </BdsButton>

          <BdsButton variant="delete" onClick={handleRemove}>
            Remover*
          </BdsButton>
        </HorizontalStack>

        <Paragraph>
          * Remove o limite de espera de <b>TODOS</b> os inputs.
        </Paragraph>
      </Block>
    </>
  );
};
