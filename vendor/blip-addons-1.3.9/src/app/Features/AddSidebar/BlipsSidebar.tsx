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
import { StatisticsForms } from '@features/BotStatistics/StatisticsForms';
import { QualityCheck } from '@features/QualityCheck/Forms';
import { t } from '../../../i18n';
import { Settings } from '~/Settings';

export type BlipsSidebarProps = {
  onClose: () => void;
};

export const BlipsSidebar = ({ onClose }: BlipsSidebarProps): JSX.Element => {
  const [currentLanguage] = React.useState(Settings.language);

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
              value={t('sidebar.title')}
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
                  <BlipAccordionButton title={t('sidebar.globalInactivity.title')} />
                </BlipAccordionHeader>
                <BlipAccordionBody>
                  <GlobalInactivityForm />
                </BlipAccordionBody>
              </BlipAccordionItem>

              <BlipAccordionItem>
                <BlipAccordionHeader marginTop={5}>
                  <BlipAccordionButton title={t('sidebar.setGlobalTrackings.title')} />
                </BlipAccordionHeader>
                <BlipAccordionBody>
                  <SetGlobalTrackingsForm />
                </BlipAccordionBody>
              </BlipAccordionItem>

              <BlipAccordionItem>
                <BlipAccordionHeader marginTop={5}>
                  <BlipAccordionButton title={t('sidebar.removeGlobalTrackings.title')} />
                </BlipAccordionHeader>
                <BlipAccordionBody>
                  <RemoveGlobalTrackingsForm />
                </BlipAccordionBody>
              </BlipAccordionItem>

              <BlipAccordionItem>
                <BlipAccordionHeader marginTop={5}>
                  <BlipAccordionButton title={t('sidebar.checkInconsistencies.title')} />
                </BlipAccordionHeader>
                <BlipAccordionBody>
                  <InconsistenciesForm />
                </BlipAccordionBody>
              </BlipAccordionItem>

              <BlipAccordionItem>
                <BlipAccordionHeader marginTop={5}>
                  <BlipAccordionButton title={t('sidebar.botStatistics.title')} />
                </BlipAccordionHeader>
                <BlipAccordionBody>
                  <StatisticsForms />
                </BlipAccordionBody>
              </BlipAccordionItem>

              <BlipAccordionItem>
                <BlipAccordionHeader marginTop={5}>
                  <BlipAccordionButton title={t('sidebar.qualityChecker.title')} />
                </BlipAccordionHeader>
                <BlipAccordionBody>
                  <QualityCheck />
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
