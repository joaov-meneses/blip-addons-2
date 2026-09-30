import * as React from 'react';
import { BdsButton } from 'blip-ds/dist/blip-ds-react';
import { t } from 'src/i18n';

const BACKGROUND_STYLE = {
  position: 'fixed',
  top: '0',
  bottom: '0',
  left: '0',
  right: '0',
  backgroundColor: 'rgb(0,0,0, 0.7)',
  zIndex: '1000',
};

const MODAL_STYLE = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  padding: '10px 10px 100px 10px',
  backgroundColor: '#fff',
  borderRadius: '10px',
  color: 'black',
  width: '75%',
  height: '90%',
};

export default function Modal({ isOpen, children, setOpenModal }) {
  if (isOpen) {
    return (
      <div style={BACKGROUND_STYLE as React.CSSProperties}>
        <div style={MODAL_STYLE as React.CSSProperties}>
          {children}
          {/* <button onClick={setOpenModal}> Fechar </button> */}
          <BdsButton onClick={setOpenModal}>{t('modal.button')}</BdsButton>
        </div>
      </div>
    );
  }

  return null;
}
