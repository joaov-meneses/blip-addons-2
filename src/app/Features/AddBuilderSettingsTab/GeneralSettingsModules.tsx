import * as React from 'react';
import { BdsIcon, BdsTypo } from 'blip-ds/dist/blip-ds-react';
import { builderModules } from './BuilderModules';
import { useModuleSettings } from '~/useModuleSettings';
import { t } from '../../../i18n';
import './style.css';

export const GeneralSettingsModules = (): JSX.Element => {
  const { modules, language } = useModuleSettings();
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const items = builderModules(language).filter(item => modules[item.key]);
  return <div className="blip-addons-general sidebar-inner-content">
    {items.length ? items.map((item, index) => <React.Fragment key={item.key}>
      {index > 0 && <div className="addons-general-divider builder-line-divider-h w-100 mv4" />}
      <section className="addons-general-section" data-module={item.key}>
        <button type="button" className="addons-general-header item-header"
          aria-expanded={!!expanded[item.key]} aria-controls={`addons-general-${item.key}`}
          onClick={() => setExpanded(current => ({ ...current, [item.key]: !current[item.key] }))}>
          <BdsIcon name={expanded[item.key] ? 'arrow-down' : 'arrow-right'} size="small" theme="outline" />
          <BdsTypo tag="span" variant="fs-16" className="ttu b">{item.title}</BdsTypo>
        </button>
        <div id={`addons-general-${item.key}`} className="addons-general-body" hidden={!expanded[item.key]}>
          {item.form}
        </div>
      </section>
    </React.Fragment>) : <p>{t('toastContainer.modulesConfig.empty', language)}</p>}
  </div>;
};
