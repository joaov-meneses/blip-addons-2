import * as React from 'react';
import { BdsButton,BdsTypo } from 'blip-ds/dist/blip-ds-react';
import { Paragraph, Block, Switch, Flex } from '~/Components';
import { TrackingsInconsistencies } from '@features/CheckInconsistencies/Trackings';
import { CheckLoopsOnFlow } from '@features/CheckInconsistencies/LoopsAndMaxBlocks';
import { TautologyInconsistencies } from '@features/CheckInconsistencies/Tautology';
import { showSuccessToast, showWarningToast } from '~/Utils';

const MAX_STATES_WITHOUT_INPUT = 35;

export const InconsistenciesForm = (): JSX.Element => {
  const [tautologyInconsistenceMessage, setTautologyMessage] = React.useState();
  const [loopBlocksMessage, setLoopBlocksMessage] = React.useState();
  const [trackingInconsistenceMessage, setTrackingInconsistenceMessage] =
    React.useState();
  const [isLoopCheckEnabled, setIsLoopCheckEnabled] = React.useState(true);
  const [isTrackingCheckEnabled, setIsTrackingCheckEnabled] = React.useState(true);
  const [isTautologyCheckEnabled, setIsTautologyCheckEnabled] = React.useState(true);

  /**
   * Runs the 'CheckInconsistencies' fature, thus check for Inconsistencies on the flow
   */
  const handleInconsistencies = (): void => {

    let loopCheck: any = {
      hasInconsistencies: false,
      message: ''
    };

    let trackingCheck: any = {
      hasInconsistencies: false,
      message: ''
    };

    let tautologyCheck: any = {
      hasInconsistencies: false,
      message: ''
    };

    if(isLoopCheckEnabled) {
      loopCheck = new CheckLoopsOnFlow().handle();
      setLoopBlocksMessage(loopCheck.message);
    }

    if(isTrackingCheckEnabled){
      trackingCheck = new TrackingsInconsistencies().handle(false);
      setTrackingInconsistenceMessage(trackingCheck.message);
    }

    if(isTautologyCheckEnabled){
      tautologyCheck = new TautologyInconsistencies().handle(false);
      setTautologyMessage(tautologyCheck.message);
    }

    if (
      loopCheck?.hasInconsistencies ||
      trackingCheck?.hasInconsistencies ||
      tautologyCheck?.hasInconsistencies
    ) {
      showWarningToast('Foi encontrada alguma inconsistência no fluxo.');
    } else {
      showSuccessToast('Não foi encontrada nenhuma inconsistência no fluxo.');
    }
  };

  /*
  Adicionar um checkbox com quais inconsistencias gostaria que fossem verificadas
  */
  return (
    <>
      <Paragraph>Este recurso irá procurar por</Paragraph>
      <ul
        style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: '#607b99' }}
      >
        <li>Registros de eventos que podem ter a action vazia</li>
        <li>Loops no fluxo</li>
        <li>
          Cascata de blocos com mais de {MAX_STATES_WITHOUT_INPUT} blocos sem
          entrada do usuário
        </li>
        <li>
          Condições de saída de blocos ou de execução de ações com tautologia
        </li>
      </ul>

      <Flex marginTop={2}>
          <Switch
            isChecked={isLoopCheckEnabled}
            name="isLoopCheckEnabled"
            onChange={(e) => setIsLoopCheckEnabled(e.target.checked)}
          />

          <Block marginLeft={2}>
            <BdsTypo bold="extra-bold" variant="fs-14">
              Verificar a existência de loops
            </BdsTypo>
          </Block>
      </Flex>

      <Flex marginTop={2}>
          <Switch
            isChecked={isTrackingCheckEnabled}
            name="isTrackingCheckEnabled"
            onChange={(e) => setIsTrackingCheckEnabled(e.target.checked)}
          />

          <Block marginLeft={2}>
            <BdsTypo bold="extra-bold" variant="fs-14">
              Verificar trackings potencialmente nulas
            </BdsTypo>
          </Block>
      </Flex>

      <Flex marginTop={2}>
          <Switch
            isChecked={isTautologyCheckEnabled}
            name="isTautologyCheckEnabled"
            onChange={(e) => setIsTautologyCheckEnabled(e.target.checked)}
          />

          <Block marginLeft={2}>
            <BdsTypo bold="extra-bold" variant="fs-14">
              Verificar tautologias
            </BdsTypo>
          </Block>
      </Flex>

      <Block marginTop={2}>
        <BdsButton
          type="submit"
          variant="primary"
          onClick={handleInconsistencies}
        >
          Verificar
        </BdsButton>
      </Block>

      <Block paddingY={1}>{loopBlocksMessage}</Block>

      <Block paddingY={1}>{trackingInconsistenceMessage}</Block>

      <Block paddingY={1}>{tautologyInconsistenceMessage}</Block>
    </>
  );
};
