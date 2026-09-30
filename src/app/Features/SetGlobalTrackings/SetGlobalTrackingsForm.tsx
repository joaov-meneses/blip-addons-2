import * as React from 'react';
import { BdsTypo } from 'blip-ds/dist/blip-ds-react';

import { SetGlobalTrackings } from '.';
import { setSettings, Settings } from '~/Settings';
import {
  Block,
  Input,
  Paragraph,
  Switch,
} from '@components';
import { createConfirmationAlert, removeOverlay } from '~/Utils';
import { t } from 'src/i18n';

const EmptyGlobalTrackings = (): JSX.Element => (
  <div className="addons-empty-hint">{t('sidebar.setGlobalTrackings.validation.invalid')}</div>
);

export const SetGlobalTrackingsForm = (): JSX.Element => {
  const [globalExtras, setGlobalExtras] = React.useState(
    Settings.lastGlobalTrackings
  );
  const [error, setError] = React.useState([]);
  const [shouldDeleteCurrentExtras, setShouldDeleteCurrentExtras] =
    React.useState(false);

  /**
   * Set the html tamplate for each global extra
   *
   */
  const getGlobalTrackingLine = (): JSX.Element => {
    return (
      <div className="addons-tracking-list">
        {globalExtras.length === 0 && <EmptyGlobalTrackings />}

        {globalExtras.map((field, index) => {
          return (
            <div className="addons-tracking-row" key={index}>
              <Input
                value={field.key}
                onChange={(e) => (field.key = e.target.value)}
                onSubmit={handleSubmit}
                errorMessage={error[index]}
                label="Key"
                type="text"
              />

              <div>
                <Input
                  value={field.value}
                  onChange={(e) => (field.value = e.target.value)}
                  onSubmit={handleSubmit}
                  errorMessage={error[index]}
                  label="Value"
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
    setGlobalExtras([...globalExtras, { key: '', value: '' }]);
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
   * @param globalExtras The trackings that will be setted
   */
  const getEmptyExtras = (globalExtras: any): any[] => {
    return globalExtras.filter(
      (currentExtra) => currentExtra.key === '' || currentExtra.value === ''
    );
  };

  /**
   * Check for empty values in globalExtras list
   *
   * @param globalExtras The trackings that will be setted
   */
  const hasKeyOrValueEmpty = (globalExtras: any): boolean => {
    const emptyExtras = getEmptyExtras(globalExtras);

    return emptyExtras.length > 0;
  };

  /**
   * Transform a list with key and value element in a object {key: value}
   *
   * @param previousExtra previous value in globalExtras array
   * @param currentExtra current value in globalExtras array
   */
  const listToObject = (previousExtra: any, currentExtra: any): any => {
    return { ...previousExtra, [currentExtra.key]: currentExtra.value };
  };

  /**
   * Set an error message in the empty lines
   *
   * @param globalExtras The trackings that will be setted
   */
  const setErrorFields = (globalExtras: any): string[] => {
    const errorMessage = t('sidebar.setGlobalTrackings.error.message');
    const emptyExtrasIndexs = globalExtras.map((extra, index) => {
      if (extra.key === '' || extra.value === '') {
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
   * Check the globalExtras and call the SetGlobalTrackings method, to set the global actions
   *
   */
  const handleSubmit = (): void => {
    if (hasKeyOrValueEmpty(globalExtras)) {
      const arrayOfErrors = setErrorFields(globalExtras);
      setError(arrayOfErrors);
      return;
    }

    const globalSettingsWillBeSetted = globalExtras.reduce(
      (previousExtra, currentExtra) =>
        listToObject(previousExtra, currentExtra),
      {}
    );

    setSettings({ lastGlobalTrackings: globalExtras });

    createConfirmationAlert({
      onCancel: () => removeOverlay(),
      onConfirm: () => {
        new SetGlobalTrackings().handle(
          globalSettingsWillBeSetted,
          shouldDeleteCurrentExtras
        );
        removeOverlay();
      },
    });

    setError(new Array(globalExtras.length));
  };

  return (
    <Block>
      <Paragraph>
        {t('sidebar.setGlobalTrackings.paragraph1.text1')}
        <br />
        <b>{t('sidebar.setGlobalTrackings.paragraph1.text2')}</b>
      </Paragraph>

      <Block marginTop={2} marginBottom={2}>
        {getGlobalTrackingLine()}

        <div className="addons-form-option">
          <Switch
            isChecked={shouldDeleteCurrentExtras}
            name="overwrite"
            onChange={(e) => setShouldDeleteCurrentExtras(e.target.checked)}
          />

          <BdsTypo bold="extra-bold" variant="fs-14">
            {t('sidebar.setGlobalTrackings.switch.label')}
          </BdsTypo>
        </div>

        <div className="addons-form-actions">
          <button type="button" className="addons-action addons-action--secondary" onClick={addNewLine}>
            {t('sidebar.setGlobalTrackings.horizontalStack.buttonAdd')}
          </button>

          <button type="button" className="addons-action addons-action--primary" onClick={handleSubmit}>
            {t('sidebar.setGlobalTrackings.horizontalStack.buttonDefine')}
          </button>
        </div>
      </Block>
    </Block>
  );
};
