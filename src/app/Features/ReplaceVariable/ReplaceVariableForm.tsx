import * as React from 'react';
import { BdsButton } from 'blip-ds/dist/blip-ds-react';

import { Input, Paragraph, Block } from '~/Components';
import { showSuccessToast, showDangerToast } from '~/Utils';
import { ReplaceVariable } from './index'

const VALID_BLIP_VARIABLE_REGEX = /^[a-zA-Z][a-zA-Z0-9.@]+$/;

export const ReplaceVariableForm = (): JSX.Element => {
  const [originalVariableName, setOriginalVariableName] = React.useState('');
  const [newVariableName, setNewVariableName] = React.useState('');
  const [error, setError] = React.useState('');

  /**
   * Runs the 'SetInactivity' fature, thus adding the defined
   * waiting limit time to all blocks with input
   */
  const handleSubmit = (): void => {
    if (!VALID_BLIP_VARIABLE_REGEX.test(originalVariableName)) {
      setError('Preencha com um nome de variável válida no Blip');
      return;
    }

    if (!VALID_BLIP_VARIABLE_REGEX.test(newVariableName)) {
      setError('Preencha com um nome de variável válida no Blip');
      return;
    }

    setError('');

    const hasSuccess = new ReplaceVariable().handle(originalVariableName, newVariableName);

    if(hasSuccess){
        showSuccessToast("Variável alterada com sucesso!")
    } else {
        showDangerToast("Falha ao alterar o nome da variável!")
    }

    
  };

  return (
    <>
      <Paragraph>Insira o nome da variável que você deseja alterar.</Paragraph>

      <Block marginTop={2}>
        <Input
          value={originalVariableName}
          onChange={(e) => setOriginalVariableName(e.target.value)}
          onSubmit={handleSubmit}
          errorMessage={error}
          label="Nome atual da variável"
          type="string"
        />
      </Block>

      <Paragraph>Insira o novo nome da variável.</Paragraph>

      <Block marginTop={2}>
        <Input
          value={newVariableName}
          onChange={(e) => setNewVariableName(e.target.value)}
          onSubmit={handleSubmit}
          errorMessage={error}
          label="Novo nome da variável"
          type="string"
        />
      </Block>

      <Block marginTop={2}>
        <BdsButton type="submit" variant="primary" onClick={handleSubmit}>
            Renomear
        </BdsButton>

        <Paragraph>
            * Altera <b>TODAS</b> as ocorrências dessa variável no fluxo e renomeia
            para.
        </Paragraph>
      </Block>
    </>
  );
};
