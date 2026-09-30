import * as React from 'react';
import {
  BdsAlert,
  BdsAlertBody,
  BdsAlertHeader,
  BdsAlertActions,
  BdsButton,
} from 'blip-ds/dist/blip-ds-react';

import { Flex } from '@components/Flex';
import { t } from 'src/i18n';

export type ConfirmationAlertProps = {
  headerMessage?: string;
  bodyMessage?: JSX.Element;
  onConfirm: (...args: any[]) => any;
  onCancel: (...args: any[]) => any;
  mainMessage?: string;
  footnote?: string;
};

const HEADER_DEFAULT = t('sidebar.removeGlobalTrackings.confirmationAlert.headerMessage');

export const ConfirmationAlert = ({
  headerMessage = HEADER_DEFAULT,
  onConfirm,
  onCancel,
  mainMessage = t('sidebar.removeGlobalTrackings.confirmationAlert.mainMessage'),
  footnote = '',
}: ConfirmationAlertProps): JSX.Element => {
  return (
    <BdsAlert open>
      <BdsAlertHeader variant="system" icon="warning">
        {headerMessage}
      </BdsAlertHeader>

      <BdsAlertBody>
        {mainMessage}
        {footnote ? (
          <div style={{ color: '#607b99', marginTop: 8 }}>* {footnote}</div>
        ) : (
          <></>
        )}
      </BdsAlertBody>

      <BdsAlertActions>
        <Flex gap={5}>
          <BdsButton variant="secondary" onClick={onCancel}>
            {t('sidebar.removeGlobalTrackings.confirmationAlert.buttonCancel')}
          </BdsButton>

          <BdsButton variant="primary" onClick={onConfirm}>
            {t('sidebar.removeGlobalTrackings.confirmationAlert.buttonConfirm')}
          </BdsButton>
        </Flex>
      </BdsAlertActions>
    </BdsAlert>
  );
};
