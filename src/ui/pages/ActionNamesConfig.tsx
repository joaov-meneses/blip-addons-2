import * as React from 'react';
import { Settings, setSettings } from '~/Settings';
import { ActionNameRule, normalizeActionNameRules } from '~/Features/FixActionNames/rules';
import { t } from 'src/i18n';

const fields = [
  { key: 'track', help: '{{category}}, {{action}}' },
  { key: 'script', help: '{{outputVariable}}' },
  { key: 'http', help: '{{responseBodyVariable}}, {{method}}, {{uri}}' },
  { key: 'command', help: '{{variable}}, {{method}}, {{uri}}' },
  { key: 'variable', help: '{{value}}, {{variable}}' },
];

export const ActionNamesConfig = (): JSX.Element => {
  const [rules, setRules] = React.useState(() => normalizeActionNameRules(Settings.actionNameRules));
  const [simplify, setSimplify] = React.useState(Settings.actionNameSimplifyVariables);
  const [message, setMessage] = React.useState('');
  const [hasError, setHasError] = React.useState(false);

  const updateRule = (index: number, patch: Partial<ActionNameRule>): void => {
    setRules(current => current.map((rule, i) => i === index ? { ...rule, ...patch } : rule));
    setMessage('');
  };

  const save = (): void => {
    if (!rules.some(rule => rule.enabled)) {
      setHasError(true);
      setMessage(t('sidebar.fixActionNames.selectType'));
      return;
    }
    if (rules.some(rule => rule.enabled && !rule.template.trim())) {
      setHasError(true);
      setMessage(t('sidebar.fixActionNames.emptyTemplate'));
      return;
    }
    setSettings({ actionNameRules: rules, actionNameSimplifyVariables: simplify });
    setHasError(false);
    setMessage(t('toastContainer.actionNamesConfig.saved'));
  };

  const reset = (): void => {
    const defaults = normalizeActionNameRules(null);
    setRules(defaults);
    setSimplify(true);
    setSettings({ actionNameRules: defaults, actionNameSimplifyVariables: true });
    setHasError(false);
    setMessage(t('toastContainer.actionNamesConfig.restored'));
  };

  return <div id="addons-action-names-config" className="addons-popup-action-names">
    <p className="addons-page-intro">{t('toastContainer.actionNamesConfig.description')}</p>
    <div className="addons-popup-rule-list">{rules.map((rule, index) => (
      <section className="addons-popup-rule" key={rule.type}>
        <label className="addons-popup-rule-heading">
          <span className="addons-popup-rule-name">{t(`sidebar.fixActionNames.${fields[index].key}`)}</span>
          <input type="checkbox" name={`popup-fix-action-${rule.type}`}
            checked={rule.enabled} onChange={event => updateRule(index, { enabled: event.target.checked })} />
        </label>
        <label className="addons-popup-field">
          <span>{t('sidebar.fixActionNames.template')}</span>
          <input type="text" data-action-name-type={rule.type} value={rule.template}
            maxLength={500} disabled={!rule.enabled}
            onChange={event => updateRule(index, { template: event.target.value })} />
        </label>
        <small>{t('toastContainer.actionNamesConfig.availableFields')} {fields[index].help}</small>
      </section>
    ))}</div>
    <label className="addons-popup-check-row">
      <input type="checkbox" name="popup-fix-action-simplify" checked={simplify}
        onChange={event => { setSimplify(event.target.checked); setMessage(''); }} />
      <span>{t('sidebar.fixActionNames.simplify')}</span>
    </label>
    <div className="addons-popup-actions">
      <button type="button" className="addons-popup-button addons-popup-button--primary" onClick={save}>
        {t('toastContainer.actionNamesConfig.save')}
      </button>
      <button type="button" className="addons-popup-button addons-popup-button--quiet" onClick={reset}>
        {t('sidebar.fixActionNames.reset')}
      </button>
    </div>
    {message && <p role={hasError ? 'alert' : 'status'} className={hasError ? 'addons-popup-error' : 'addons-popup-success'}>{message}</p>}
  </div>;
};
