import * as React from 'react';
import { Input, Paragraph } from '~/Components';
import { Settings, setSettings } from '~/Settings';
import { createConfirmationAlert, removeOverlay } from '~/Utils';
import { t } from '../../../i18n';
import { FixActionNames } from '.';
import { ActionNameRule, ActionNamePlan, normalizeActionNameRules } from './rules';

export const FixActionNamesForm = ({ idPrefix = '' }: { idPrefix?: string }): JSX.Element => {
  const [rules, setRules] = React.useState(() => normalizeActionNameRules(Settings.actionNameRules));
  const [simplify, setSimplify] = React.useState(Settings.actionNameSimplifyVariables);
  const [result, setResult] = React.useState<ActionNamePlan | null>(null);
  const [error, setError] = React.useState('');
  const fields = [
    { label: t('sidebar.fixActionNames.track'), help: '{{category}}, {{action}}' },
    { label: t('sidebar.fixActionNames.script'), help: '{{outputVariable}}' },
    { label: t('sidebar.fixActionNames.http'), help: '{{responseBodyVariable}}, {{method}}, {{uri}}' },
    { label: t('sidebar.fixActionNames.command'), help: '{{variable}}, {{method}}, {{uri}}' },
    { label: t('sidebar.fixActionNames.variable'), help: '{{value}}, {{variable}}' },
  ];

  const updateRule = (index: number, patch: Partial<ActionNameRule>): void => {
    setRules(current => current.map((rule, i) => i === index ? { ...rule, ...patch } : rule));
    setResult(null);
    setError('');
  };

  const apply = (): void => {
    setResult(null);
    if (!rules.some(rule => rule.enabled)) { setError(t('sidebar.fixActionNames.selectType')); return; }
    if (rules.some(rule => rule.enabled && !rule.template.trim())) { setError(t('sidebar.fixActionNames.emptyTemplate')); return; }
    try {
      // Check availability without changing the flow. Confirm recalculates against the current flow.
      new FixActionNames().handle(rules, simplify, true);
      setError('');
      createConfirmationAlert({
        onCancel: removeOverlay,
        onConfirm: () => {
          removeOverlay();
          try {
            const plan = new FixActionNames().handle(rules, simplify, false);
            setSettings({ actionNameRules: rules, actionNameSimplifyVariables: simplify });
            setResult(plan);
            setError('');
          } catch (error) {
            setError(t('sidebar.fixActionNames.unavailable'));
          }
        },
      });
    } catch (error) {
      setError(t('sidebar.fixActionNames.unavailable'));
    }
  };

  return (
    <div id={`${idPrefix}fix-action-names-form`}>
      <Paragraph>{t('sidebar.fixActionNames.description')}</Paragraph>
      <Paragraph>{t('sidebar.fixActionNames.help')}</Paragraph>
      <div className="addons-rule-list">{rules.map((rule, index) => (
        <div className="addons-rule" key={rule.type}>
          <label className="addons-rule-label">
            <input type="checkbox" name={`fix-action-${rule.type}`} checked={rule.enabled}
              onChange={event => updateRule(index, { enabled: event.target.checked })} />
            <strong>{fields[index].label}</strong>
          </label>
          <div data-action-name-type={rule.type}>
            <Input type="text" label={t('sidebar.fixActionNames.template')} value={rule.template}
              onChange={event => updateRule(index, { template: event.target.value })}
              helperMessage={fields[index].help} disabled={!rule.enabled} maxLength={500} />
          </div>
        </div>
      ))}</div>
      <div className="addons-form-option addons-form-option--checkbox">
        <label className="addons-rule-label">
          <input type="checkbox" name="fix-action-simplify" checked={simplify} onChange={event => {
            setSimplify(event.target.checked); setResult(null); setError('');
          }} />
          <span>{t('sidebar.fixActionNames.simplify')}</span>
        </label>
      </div>
      <div className="addons-form-actions addons-form-actions--fix">
        <button id={`${idPrefix}fix-action-names-apply`} type="button"
          className="addons-action addons-action--primary" onClick={apply}>
          {t('sidebar.fixActionNames.apply')}
        </button>
        <button id={`${idPrefix}fix-action-names-reset`} type="button"
          className="addons-icon-action addons-reset-action" title={t('sidebar.fixActionNames.reset')}
          aria-label={t('sidebar.fixActionNames.reset')} onClick={() => {
          setRules(normalizeActionNameRules(null)); setSimplify(true); setResult(null); setError('');
        }}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M20 11a8 8 0 1 1-2.2-5.5M20 4v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg></button>
      </div>
      <div className="addons-form-note"><Paragraph>{t('sidebar.fixActionNames.saved')}</Paragraph></div>
      {error && <p role="alert" style={{ color: '#c22637' }}>{error}</p>}
      {result && <div id={`${idPrefix}fix-action-names-result`} role="status" aria-live="polite" style={{ overflowWrap: 'anywhere' }}>
        <p><strong>{result.changes.length} {t('sidebar.fixActionNames.applied')}</strong></p>
        <p>{result.unchanged} {t('sidebar.fixActionNames.unchanged')} · {result.skipped.length} {t('sidebar.fixActionNames.skipped')}</p>
        {!!result.changes.length && <>
          <p>{t('sidebar.fixActionNames.sample')}</p>
          <ol style={{ paddingLeft: 20 }}>
            {result.changes.slice(0, 10).map((change, index) => <li key={index} style={{ marginBottom: 8 }}>
              <small>{change.action.type}</small><br />
              <span>{change.before || t('sidebar.fixActionNames.untitled')}</span><br />
              <strong>→ {change.after}</strong>
            </li>)}
          </ol>
        </>}
        {!!result.skipped.length && <>
          <p>{t('sidebar.fixActionNames.missing')}</p>
          <ul style={{ paddingLeft: 20 }}>{result.skipped.slice(0, 5).map((item, index) => (
            <li key={index}>{item.type}: {item.missing.join(', ') || t('sidebar.fixActionNames.emptyTemplate')}</li>
          ))}</ul>
        </>}
        <Paragraph>{t('sidebar.fixActionNames.saveFlow')}</Paragraph>
      </div>}
    </div>
  );
};
