import * as React from 'react';
import Modal from '../../Components/Modal';
import './style.css';
import { BdsButton } from 'blip-ds/dist/blip-ds-react';
import { t } from 'src/i18n';

export const QualityCheck = (): JSX.Element => {
  const [openModal, setOpenModal] = React.useState(false);

  return (
    <div className="QualityCheck">
      <BdsButton onClick={() => setOpenModal(true)}>
        {t('sidebar.qualityChecker.button.label')}
      </BdsButton>
      <Modal isOpen={openModal} setOpenModal={() => setOpenModal(!openModal)}>
        <iframe
          src="https://blip-extension-checklist-certificacao.cs.blip.ai/"
          width="100%"
          height="100%"
        ></iframe>
      </Modal>
    </div>
  );
};
