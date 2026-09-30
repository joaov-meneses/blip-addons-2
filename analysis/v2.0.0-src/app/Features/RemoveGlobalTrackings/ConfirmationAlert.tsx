import * as React from 'react';
import {
  BdsAlert,
  BdsAlertBody,
  BdsAlertHeader,
  BdsAlertActions,
  BdsButton,
} from 'blip-ds/dist/blip-ds-react';

import { Flex } from '@components/Flex';

export type ConfirmationAlertProps = {
  headerMessage?: string;
  bodyMessage?: JSX.Element;
  onConfirm: (...args: any[]) => any;
  onCancel: (...args: any[]) => any;
  mainMessage?: string;
  footnote?: string;
};

const HEADER_DEFAULT = 'Atenção!';
const BODY_DEFAULT: JSX.Element = (
  <div>
    Você tem certeza que gostaria de executar esta ação? Isso irá alterar o
    fluxo definitivamente.
    <div style={{ color: '#607b99', marginTop: 8 }}>
      * Para desfazer esta ação recarregue a última versão publicada do fluxo.
    </div>
  </div>
);

export const ConfirmationAlert = ({
  headerMessage = HEADER_DEFAULT,
  bodyMessage = BODY_DEFAULT,
  onConfirm,
  onCancel,
  mainMessage='Você tem certeza que gostaria de executar esta ação? Isso irá alterar o fluxo definitivamente.',
  footnote='Para desfazer esta ação recarregue a última versão publicada do fluxo.'
}: ConfirmationAlertProps): JSX.Element => {
  return (
    <BdsAlert open>
      <BdsAlertHeader variant="delete" icon="warning">
        {headerMessage}
      </BdsAlertHeader>

      <BdsAlertBody>
        {mainMessage}
        <div style={{ color: '#607b99', marginTop: 8 }}>
          * {footnote}
        </div>
      </BdsAlertBody>

      <BdsAlertActions>
        <Flex gap={5}>
          <BdsButton variant="secondary" onClick={onCancel}>
            Cancelar
          </BdsButton>

          <BdsButton variant="delete" onClick={onConfirm}>
            Confirmar
          </BdsButton>
        </Flex>
      </BdsAlertActions>
    </BdsAlert>
  );
};
