import * as React from 'react';
import {
  Block,
  Input,
  Paragraph,
} from '@components';
import { RemoveGlobalTrackings, SetGlobalTrackings } from '~/Features';
import { setSettings, Settings } from '~/Settings';
import { createConfirmationAlert, removeOverlay } from '~/Utils';
import { t } from '../../../i18n';

const EmptyGlobalTrackings = (): JSX.Element => (
  <div className="addons-empty-hint">{t('sidebar.removeGlobalTrackings.validation.invalid')}</div>
);

export const RemoveGlobalTrackingsForm = (): JSX.Element => {
  const [globalExtras, setGlobalExtras] = React.useState(
    Settings.lastRemovedGlobalTrackings
  );
  const [error, setError] = React.useState([]);

  /**
   * Set the html template for each global extra
   *
   */
  const getGlobalTrackingLine = (): JSX.Element => {
    return (
      <div className="addons-tracking-list">
        {globalExtras.length === 0 && <EmptyGlobalTrackings />}

        {globalExtras.map((field, index) => {
          return (
            <div className="addons-tracking-row addons-tracking-row--single" key={index}>
              <div>
                <Input
                  value={field.key}
                  onChange={(e) => (field.key = e.target.value)}
                  onSubmit={handleSubmit}
                  errorMessage={error[index]}
                  label="Key"
                  type="text"
                />
              </div>
              <button type="button" className="addons-icon-action addons-row-remove"
                aria-label={`${t('sidebar.removeGlobalTrackings.horizontalStack.buttonRemove')} ${field.key || index + 1}`}
                onClick={() => removeLine(index)}><span aria-hidden="true">×</span></button>
            </div>
          );
        })}
      </div>
    );
  };

  /**
   * add a new line in the globalExtra list
   *
   */
  const addNewLine = (): void => {
    setGlobalExtras([...globalExtras, { key: '' }]);
  };

  /**
   * remove a line in the globalExtra list
   *
   * @param index The index of globalExtra list
   */
  const removeLine = (index: number): void => {
    setError([]);
    setGlobalExtras(globalExtras.filter((_, i) => i !== index));
  };

  /**
   * Get the empties global extras in the list
   *
   * @param globalExtras The trackings that will be removed
   */
  const getEmptyExtras = (globalExtras: any): any[] => {
    return globalExtras.filter((currentExtra) => currentExtra.key === '');
  };

  /**
   * Check for empty values in globalExtras list
   *
   * @param globalExtras The trackings that will be removed
   */
  const hasKeyOrValueEmpty = (globalExtras: any): boolean => {
    const emptyExtras = getEmptyExtras(globalExtras);
    return emptyExtras.length > 0;
  };

  /**
   * Set an error message in the empty lines
   *
   * @param globalExtras The trackings that will be removed
   */
  const setErrorFields = (globalExtras: any): string[] => {
    const errorMessage = 'Preencha todos os campos';
    const emptyExtrasIndexs = globalExtras.map((extra, index) => {
      if (extra.key === '') {
        return index;
      }
    });

    const arrayOfErrors = new Array(globalExtras.length);
    emptyExtrasIndexs.forEach((extraIndex) => {
      arrayOfErrors[extraIndex] = errorMessage;
    });

    return arrayOfErrors;
  };

  /**
   * Check the globalExtras and call the RemoveGlobalTrackings method, to remove the global actions
   *
   */
  const handleSubmit = (): void => {
    if (hasKeyOrValueEmpty(globalExtras)) {
      const arrayOfErrors = setErrorFields(globalExtras);
      setError(arrayOfErrors);
      return;
    }

    setSettings({ lastRemovedGlobalTrackings: globalExtras });
    setError(new Array(globalExtras.length));

    createConfirmationAlert({
      onCancel: removeOverlay,
      onConfirm: () => {
        new RemoveGlobalTrackings().handle(globalExtras);
        removeOverlay();
      },
    });
  };

  /**
   * Call the SetGlobalTrackings method, to remove all the global actions
   *
   */
  const onRemove = (): void => {
    createConfirmationAlert({
      onCancel: removeOverlay,
      onConfirm: () => {
        new SetGlobalTrackings().handle({}, true);
        removeOverlay();
      },
    });
  };

  return (
    <Block>
      <Paragraph>
        {t('sidebar.removeGlobalTrackings.paragraph1.text1')}
        <br />
        <b>{t('sidebar.removeGlobalTrackings.paragraph1.text2')}</b>
      </Paragraph>

      <Block marginTop={2}>
        {getGlobalTrackingLine()}

        <div className="addons-form-actions">
          <button type="button" className="addons-action addons-action--secondary" onClick={addNewLine}>
            {t('sidebar.removeGlobalTrackings.horizontalStack.buttonAdd')}
          </button>
        </div>

        <div className="addons-form-actions">
          <button type="button" className="addons-action addons-action--primary" onClick={handleSubmit}>
            {t('sidebar.removeGlobalTrackings.horizontalStack.buttonRemove')}
          </button>

          <button type="button" className="addons-action addons-action--secondary" onClick={onRemove}>
            {t('sidebar.removeGlobalTrackings.horizontalStack.buttonRemoveAll')}
          </button>
        </div>

        <div className="addons-form-note"><Paragraph>
          {t('sidebar.removeGlobalTrackings.paragraph2.text1')}{' '}
          <b>{t('sidebar.removeGlobalTrackings.paragraph2.text2')}</b>{' '}
          {t('sidebar.removeGlobalTrackings.paragraph2.text3')}
        </Paragraph></div>
      </Block>
    </Block>
  );
};
