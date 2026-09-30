import * as React from 'react';
import { v4 as uuid } from 'uuid';
import { BdsButton, BdsIcon } from 'blip-ds/dist/blip-ds-react';
import {
  Block,
  HorizontalStack,
  Input,
  Paragraph,
  Stack,
  Title,
} from '@components';
import { RemoveGlobalTrackings, SetGlobalTrackings } from '~/Features';
import { setSettings, Settings } from '~/Settings';
import { createConfirmationAlert, removeOverlay } from '~/Utils';

const EmptyGlobalTrackings = (): JSX.Element => {
  return (
    <Block
      borderRadius="5px"
      borderColor="rgba(0, 0, 0, 0.2)"
      borderStyle="dashed"
      borderWidth="1px"
    >
      <Stack padding={2}>
        <BdsIcon size="xxx-large" theme="outline" name="warning" />
        <Block marginTop={1}>
          <Title>Ainda não há trackings</Title>
        </Block>
        <Paragraph>Você ainda não adicionou nenhuma tracking</Paragraph>
      </Stack>
    </Block>
  );
};

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
      <div>
        {globalExtras.length === 0 && <EmptyGlobalTrackings />}

        {globalExtras.map((field, index) => {
          return (
            <div className="flex items-center mb2" key={uuid()}>
              <div className="w-90">
                <Input
                  value={field.key}
                  onChange={(e) => (field.key = e.target.value)}
                  onSubmit={handleSubmit}
                  errorMessage={error[index]}
                  label="Key"
                  type="text"
                />
              </div>
              <div className="flex">
                <i
                  className="self-center icon-close lh-solid cursor-pointer ml2"
                  onClick={() => removeLine(index)}
                />
              </div>
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
        Todos os blocos terão as tracking especificadas removidas das ações de
        registro.
        <br />
        <b>Você ainda precisa publicar o fluxo</b>
      </Paragraph>

      <Block marginTop={2}>
        {getGlobalTrackingLine()}

        <HorizontalStack marginTop={2}>
          <BdsButton size="tall" variant="dashed" onClick={addNewLine}>
            Adicionar
          </BdsButton>
        </HorizontalStack>

        <HorizontalStack marginTop={2}>
          <BdsButton type="submit" variant="primary" onClick={handleSubmit}>
            Remover
          </BdsButton>

          <BdsButton variant="delete" onClick={onRemove}>
            Remover Todas *
          </BdsButton>
        </HorizontalStack>

        <Paragraph>
          * Remove as trackings globais de <b>TODAS</b> as actions.
        </Paragraph>
      </Block>
    </Block>
  );
};
