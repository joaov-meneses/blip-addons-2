/* eslint-disable func-style */
import * as React from 'react';
import { Input, HorizontalStack } from '@components';
import { BdsButton } from 'blip-ds/dist/blip-ds-react';

export type EditableInputAddonsProps = {
  defaultValue: string;
  isDeletable?: boolean;
  isSearchable?: boolean;
  id: string;
  onChange: (value: string) => void;
  onRemove?: (id: string) => void;
  onSearch?: (id: string, isActivatingSearch: boolean) => void;
  cols?: number;
  rows?: number;
};

export const EditableInputAddons = ({
  defaultValue,
  cols = 42,
  rows = 8,
  isDeletable = false,
  isSearchable = false,
  id,
  onChange,
  onRemove,
  onSearch,
}: EditableInputAddonsProps): JSX.Element => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [textValue, setTextValue] = React.useState(defaultValue);
  const [currentTextValue, setCurrentTextValue] = React.useState(defaultValue);
  const [isSeaching, setIsSearching] = React.useState(false);

  const setInputValue = (text: string): void => {
    setTextValue(text);
    onChange(text);
    setIsEditing(false);
  };

  const resetCurrentInputValue = (text: string): void => {
    setCurrentTextValue(text);
    setIsEditing(false);
  };

  const SearchHandler = (): void => {
    const next = !isSeaching;
    setIsSearching(next);
    onSearch(id, next);
  };

  return (
    <>
      <HorizontalStack>
        <Input
        onSubmit={(e) => setTextValue(e.target.value)}
        onChange={(e) => setCurrentTextValue(e.target.value)}
        value={currentTextValue}
        type="text"
        label="Comentário"
        rows={rows}
        cols={cols}
        isTextarea={true}
        disabled={!isEditing}
      />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
          {isDeletable ? (
            <div style={{ cursor: 'pointer' }}>
              <BdsButton variant="secondary" size='short' icon="trash" color="red" onClick={() => onRemove(id)} />
            </div>
          ) : (
            <></>
          )}

          {isSearchable ? (
            <div style={{ cursor: 'pointer' }}>
              <BdsButton
                variant="secondary"
                size='short'
                icon={isSeaching ? 'eye-open' : 'eye-closed'}
                onClick={() => SearchHandler()}
              />
            </div>
          ) : (
            <></>
          )}

          <div style={{ cursor: 'pointer' }}>
            <BdsButton
              style={{ alignSelf: 'start' }}
              variant="secondary"
              icon="notes"
              size='short'
              onClick={() => setIsEditing(!isEditing)}
            />
            {isEditing ? (
              <>
                <BdsButton
                  style={{ alignSelf: 'start' }}
                  variant="secondary"
                  icon="check"
                  size='short'
                  onClick={() => setInputValue(currentTextValue)}
                />
                <BdsButton
                  style={{ alignSelf: 'start' }}
                  variant="secondary"
                  icon="close"
                  size='short'
                  onClick={() => resetCurrentInputValue(textValue)}
                />
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </HorizontalStack>
    </>
  );
};
