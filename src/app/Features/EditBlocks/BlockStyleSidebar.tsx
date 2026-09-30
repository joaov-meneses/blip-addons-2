import { BdsButton } from 'blip-ds/dist/blip-ds-react';
import * as React from 'react';
import {
  Block,
  BlipAccordion,
  BlipAccordionItem,
  BlipAccordionHeader,
  BlipAccordionButton,
  BlipAccordionBody,
  Flex,
} from '~/Components';
import { ColorBlockOption } from './ChangeBlockColor';
import { ShapeBlockOption } from './ChangeBlockFormat';

export type BlipsSidebarProps = {
  onEditBackgorundColor: (color: string) => void;
  onEditTextColor: (color: string) => void;
  onEditShape: (shape: string) => void;
  onClose: () => void;
  onRestore: () => void;
};

export const BlockStyleSidebar = ({
  onEditBackgorundColor,
  onEditTextColor,
  onEditShape,
  onClose,
  onRestore,
}: BlipsSidebarProps): JSX.Element => {

  return (
    <>
      <div
        id="blips-custom-sidebar"
        className="sidebar-content-component left-entrance-animation position-left builder-sidebar ng-enter"
      >
        <div className="sidebar-content-header background-text-dark-5 bp-c-white ph5 pt2">
          <div className="sidebar-helper-header">
            <input
              className="bp-c-white w-100 sidebar-title"
              id="sidebar-title"
              maxLength={50}
              type="text"
              name="nodeName"
              value="Estilos do Bloco"
              readOnly
            />

            <div className="sidebar-helper-header__actions">
              <span>
                <i
                  className="icon-close cursor-pointer"
                  id="addictions-menu-close"
                  onClick={onClose}
                />
              </span>
            </div>
          </div>
        </div>

        <div className="sidebar-content-body">
          <Block paddingX={2.5} paddingY={1}>
            <BlipAccordion>
              <BlipAccordionItem borderTop={0}>
                <BlipAccordionHeader isFirst marginBottom={5}>
                  <BlipAccordionButton title="Alterar formato do Bloco" />
                </BlipAccordionHeader>
                <BlipAccordionBody>
                  <ShapeBlockOption onClick={onEditShape} />
                </BlipAccordionBody>
              </BlipAccordionItem>

              <BlipAccordionItem>
                <BlipAccordionHeader marginTop={5} marginBottom={5}>
                  <BlipAccordionButton title="Alterar cor do bloco" />
                </BlipAccordionHeader>
                <BlipAccordionBody>
                  <ColorBlockOption
                    defaultColor={'#ffffff'}
                    onSetColor={onEditBackgorundColor}
                  />
                </BlipAccordionBody>
              </BlipAccordionItem>

              <BlipAccordionItem>
                <BlipAccordionHeader marginTop={5} marginBottom={5}>
                  <BlipAccordionButton title="Alterar cor do titulo do bloco" />
                </BlipAccordionHeader>
                <BlipAccordionBody>
                  <ColorBlockOption
                    defaultColor={'#ffffff'}
                    onSetColor={onEditTextColor}
                  />
                </BlipAccordionBody>
              </BlipAccordionItem>
            </BlipAccordion>
          </Block>

          <Flex
            style={{
              marginTop: '1rem',
              paddingLeft: '2.5rem',
              paddingRight: '2.5rem',
              justifyContent: 'flex-end',
            }}
          >
            <BdsButton type="submit" variant="delete" onClick={onRestore}>
              Restaurar estilo padrão do bloco
            </BdsButton>
          </Flex>
        </div>
      </div>
    </>
  );
};
