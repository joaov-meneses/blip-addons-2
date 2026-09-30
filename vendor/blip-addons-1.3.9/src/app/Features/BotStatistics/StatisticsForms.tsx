import * as React from 'react';
import { BotStatistics } from '.';
import { t } from 'src/i18n';

export const StatisticsForms = (): JSX.Element => {
  const [statisticsObj, setStatisticsObj] = React.useState(
    new BotStatistics().handle()
  );

  return (
    <ul>
      <li>
        <b>
          {' '}
          {t('sidebar.botStatistics.list.item1')} {statisticsObj.numberOfBlocks}
        </b>
      </li>
      <li>
        <b> {t('sidebar.botStatistics.list.item2')}</b>
        <ul>
          <li>
            {t('sidebar.botStatistics.list.item3')}{' '}
            {statisticsObj.numberOfHttpActions}
          </li>
          <li>
            {t('sidebar.botStatistics.list.item4')}{' '}
            {statisticsObj.numberOfUniqueTrackings}
          </li>
          <li>
            {t('sidebar.botStatistics.list.item5')}{' '}
            {statisticsObj.numberOfScriptsAction}
          </li>
        </ul>
      </li>
    </ul>
  );
};
