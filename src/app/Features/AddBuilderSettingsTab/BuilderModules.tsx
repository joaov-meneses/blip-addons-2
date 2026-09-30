import * as React from 'react';
import { GlobalInactivityForm } from '~/Features/SetInactivity/GlobalInactivityForm';
import { SetGlobalTrackingsForm } from '~/Features/SetGlobalTrackings/SetGlobalTrackingsForm';
import { RemoveGlobalTrackingsForm } from '~/Features/RemoveGlobalTrackings/RemoveGlobalTrackingsForm';
import { InconsistenciesForm } from '~/Features/CheckInconsistencies/InconsistenciesForm';
import { StatisticsForms } from '@features/BotStatistics/StatisticsForms';
import { QualityCheck } from '@features/QualityCheck/Forms';
import { FixActionNamesForm } from '@features/FixActionNames/FixActionNamesForm';
import { ModuleKey } from '~/ModuleSettings';
import { t } from '../../../i18n';

export function builderModules(language: string): Array<{ key: ModuleKey; title: string; form: JSX.Element }> {
  return [
    { key: 'globalInactivity', title: t('sidebar.globalInactivity.title', language), form: <GlobalInactivityForm /> },
    { key: 'setGlobalTrackings', title: t('sidebar.setGlobalTrackings.title', language), form: <SetGlobalTrackingsForm /> },
    { key: 'removeGlobalTrackings', title: t('sidebar.removeGlobalTrackings.title', language), form: <RemoveGlobalTrackingsForm /> },
    { key: 'checkInconsistencies', title: t('sidebar.checkInconsistencies.title', language), form: <InconsistenciesForm /> },
    { key: 'botStatistics', title: t('sidebar.botStatistics.title', language), form: <StatisticsForms /> },
    { key: 'qualityChecker', title: t('sidebar.qualityChecker.title', language), form: <QualityCheck /> },
    { key: 'fixActionNames', title: t('sidebar.fixActionNames.title', language), form: <FixActionNamesForm idPrefix="general-" /> },
  ];
}
