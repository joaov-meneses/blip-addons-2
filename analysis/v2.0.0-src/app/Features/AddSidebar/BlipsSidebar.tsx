import * as React from 'react';

import {
  Block,
  BlipAccordion,
  BlipAccordionItem,
  BlipAccordionHeader,
  BlipAccordionButton,
  BlipAccordionBody,
} from '~/Components';
import { GlobalInactivityForm } from '~/Features/SetInactivity/GlobalInactivityForm';
import { SetGlobalTrackingsForm } from '~/Features/SetGlobalTrackings/SetGlobalTrackingsForm';
import { RemoveGlobalTrackingsForm } from '~/Features/RemoveGlobalTrackings/RemoveGlobalTrackingsForm';
import { InconsistenciesForm } from '~/Features/CheckInconsistencies/InconsistenciesForm';
import { ReplaceVariableForm } from '~/Features/ReplaceVariable/ReplaceVariableForm';

export type BlipsSidebarProps = {
  onClose: () => void;
};

export const BlipsSidebar = ({ onClose }: BlipsSidebarProps): JSX.Element => {
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
              value="Blip Addons 2.0"
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
                <BlipAccordionHeader isFirst>
                  <BlipAccordionButton title="Adicionar inatividade global" />
                </BlipAccordionHeader>
                <BlipAccordionBody>
                  <GlobalInactivityForm />
                </BlipAccordionBody>
              </BlipAccordionItem>

              <BlipAccordionItem>
                <BlipAccordionHeader marginTop={5}>
                  <BlipAccordionButton title="Adicionar trackings globais" />
                </BlipAccordionHeader>
                <BlipAccordionBody>
                  <SetGlobalTrackingsForm />
                </BlipAccordionBody>
              </BlipAccordionItem>

              <BlipAccordionItem>
                <BlipAccordionHeader marginTop={5}>
                  <BlipAccordionButton title="Remover trackings globais" />
                </BlipAccordionHeader>
                <BlipAccordionBody>
                  <RemoveGlobalTrackingsForm />
                </BlipAccordionBody>
              </BlipAccordionItem>

              <BlipAccordionItem>
                <BlipAccordionHeader marginTop={5}>
                  <BlipAccordionButton title="Verificar inconsistências no fluxo" />
                </BlipAccordionHeader>
                <BlipAccordionBody>
                  <InconsistenciesForm />
                </BlipAccordionBody>
              </BlipAccordionItem>

              {/* <BlipAccordionItem>
                <BlipAccordionHeader marginTop={5}>
                  <BlipAccordionButton title="Renomear variável" />
                </BlipAccordionHeader>
                <BlipAccordionBody>
                  <ReplaceVariableForm />
                </BlipAccordionBody>
              </BlipAccordionItem> */}
            </BlipAccordion>
          </Block>
        </div>
      </div>
    </>
  );
};
