import * as React from 'react';
import { BdsButton, BdsIcon } from 'blip-ds/dist/blip-ds-react';
import { v4 as uuid } from 'uuid';
import { setSettings, Settings } from '~/Settings';
import {
  Block,
  Flex,
  HorizontalStack,
  Input,
  Paragraph,
  Stack,
  BlipAccordion,
  BlipAccordionItem,
  BlipAccordionHeader,
  BlipAccordionButton,
  BlipAccordionBody,
} from '@components';
import { createToast } from '~/Utils';

const NOT_EMPTY_REGEX = /.+/i;

const EmptySnippets = (): JSX.Element => {
  return (
    <Block
      borderRadius="5px"
      borderColor="rgba(0, 0, 0, 0.2)"
      borderStyle="dashed"
      borderWidth="1px"
    >
      <Stack padding={2}>
        <BdsIcon size="xxx-large" theme="outline" name="warning" />
        <Paragraph>Você ainda não adicionou nenhum Snippet</Paragraph>
      </Stack>
    </Block>
  );
};

export const SnippetsConfig = (): JSX.Element => {
  const [personalSnippets, setPersonalSnippets] = React.useState(
    Settings.personalSnippets
  );
  const [error, setError] = React.useState([]);

  React.useEffect(() => {
    chrome.storage.sync.get('settings', ({ settings = Settings }) => {
      setPersonalSnippets(settings.personalSnippets || []);
    });
  }, []);

  const updateSettings = (): void => {
    const hasRepeated =
      Array.from(
        new Set(personalSnippets.map((personalSnippet) => personalSnippet.key))
      ).length < personalSnippets.length;

    if (hasRepeated) {
      return createToast({
        toastText: 'Não podem haver 2 snippets com o mesmo nome',
        toastTitle: 'Falha ao salvar os Snippets!',
        variant: 'warning',
        duration: 3,
      });
    }

    const hasEmpty = personalSnippets.find(
      (snippet) =>
        !NOT_EMPTY_REGEX.test(snippet.key) ||
        !NOT_EMPTY_REGEX.test(snippet.value)
    );
    
    if (hasEmpty) {
      return createToast({
        toastText: 'Todos os snippets devem ter um conteúdo não vazio',
        toastTitle: 'Falha ao salvar os Snippets!',
        variant: 'warning',
        duration: 3,
      });
    }

    setSettings({
      personalSnippets,
    });

    createToast({
      toastText: 'Dados atualizados com sucesso',
      toastTitle: 'Sucesso!',
      variant: 'success',
      duration: 2,
    });
  };

  const getSnippetLine = (): JSX.Element => {
    return (
      <div>
        {personalSnippets.length === 0 && <EmptySnippets />}

        <Block width="100%">
          <BlipAccordion>
            {personalSnippets.map((field, index) => {
              return (
                <BlipAccordionItem borderTop={0} key={field.id}>
                  <BlipAccordionHeader>
                    <Flex className="justify-between">
                      <BlipAccordionButton
                        title={field.key || 'Novo Snippet'}
                      />
                      <div style={{ alignSelf: 'center', cursor: 'pointer' }}>
                        <BdsIcon
                          name="trash"
                          color="red"
                          onClick={() => removeLine(index)}
                        />
                      </div>
                    </Flex>
                  </BlipAccordionHeader>
                  <BlipAccordionBody>
                    <Flex gap={1} style={{ marginBottom: '12px' }}>
                      <div style={{ width: '95%' }}>
                        <Input
                          value={field.key}
                          onChange={(e) => {
                            setPersonalSnippets(
                              personalSnippets.map((personalSnippets, i) => {
                                return i === index
                                  ? { ...personalSnippets, key: e.target.value }
                                  : personalSnippets;
                              })
                            );

                            field.key = e.target.value;
                          }}
                          errorMessage={error[index]}
                          label="Nome do Snippet"
                          type="text"
                        />

                        <div className="ml2" style={{ marginTop: '4px' }}>
                          <Input
                            value={field.value}
                            onChange={(e) => (field.value = e.target.value)}
                            errorMessage={error[index]}
                            label="Código a ser gerado"
                            type="text"
                            isTextarea={true}
                            rows={5}
                          />
                        </div>
                      </div>
                    </Flex>
                  </BlipAccordionBody>
                </BlipAccordionItem>
              );
            })}
          </BlipAccordion>
          <br />
          <Paragraph>
            * Recarregue as páginas do builder abertas para carregar os novos
            snippets.
          </Paragraph>
        </Block>
      </div>
    );
  };

  /**
   * add a new line in the personalSnippets list
   *
   */
  const addNewLine = (): void => {
    setPersonalSnippets([
      ...personalSnippets,
      { id: uuid(), key: '', value: '' },
    ]);
  };

  /**
   * remove a line in the personalSnippets list
   *
   * @param index The index of personalSnippets list
   */
  const removeLine = (index: number): void => {
    setError([]);
    const newPersonalSnippets = personalSnippets.filter((_, i) => i !== index);
    setPersonalSnippets(newPersonalSnippets);
    setSettings({ personalSnippets: newPersonalSnippets });

    createToast({
      toastText: 'Snippet removido com sucesso',
      toastTitle: 'Sucesso!',
      variant: 'success',
    });
  };

  return (
    <Block padding={0}>
      <Paragraph>Adicione aqui os seus snippets personalizados!</Paragraph>

      <Block marginTop={2} marginBottom={2}>
        {getSnippetLine()}

        <HorizontalStack marginTop={2}>
          <BdsButton variant="dashed" onClick={addNewLine}>
            Add Snippet
          </BdsButton>

          <BdsButton type="submit" variant="primary" onClick={updateSettings}>
            Salvar
          </BdsButton>
        </HorizontalStack>
      </Block>
    </Block>
  );
};
