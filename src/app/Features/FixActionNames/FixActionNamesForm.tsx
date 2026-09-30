import * as React from 'react';
import { Paragraph } from '~/Components';
import { RestoreButton } from '~/Components/RestoreButton';
import { Settings, setSettings, subscribeSettings } from '~/Settings';
import { createConfirmationAlert, removeOverlay } from '~/Utils';
import { t } from '../../../i18n';
import { FixActionNames } from '.';
import { ActionNamePlan, normalizeActionNameRules } from './rules';

const ruleLabels = ['track', 'script', 'http', 'command', 'variable'];

export const FixActionNamesForm = ({ idPrefix = '' }: { idPrefix?: string }): JSX.Element => {
  const [rules, setRules] = React.useState(() => normalizeActionNameRules(Settings.actionNameRules));
  const [result, setResult] = React.useState<ActionNamePlan | null>(null);
  const [error, setError] = React.useState('');

  React.useEffect(() => subscribeSettings(() => {
    setRules(normalizeActionNameRules(Settings.actionNameRules));
    setResult(null);
    setError('');
  }), []);

  const apply = (): void => {
    setResult(null);
    const currentRules = normalizeActionNameRules(Settings.actionNameRules);
    const simplify = Settings.actionNameSimplifyVariables;
    if (!currentRules.some(rule => rule.enabled)) { setError(t('sidebar.fixActionNames.selectType')); return; }
    if (currentRules.some(rule => rule.enabled && !rule.template.trim())) {
      setError(t('sidebar.fixActionNames.emptyTemplate'));
      return;
    }
    try {
      // Availability check is read-only. Confirmation recalculates against the live flow.
      new FixActionNames().handle(currentRules, simplify, true);
      setError('');
      createConfirmationAlert({
        onCancel: removeOverlay,
        onConfirm: () => {
          removeOverlay();
          try {
            const plan = new FixActionNames().handle(currentRules, simplify, false);
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

  const reset = (): void => {
    setSettings({ actionNameRules: normalizeActionNameRules(null), actionNameSimplifyVariables: true });
    setResult(null);
    setError('');
  };

  return <div id={`${idPrefix}fix-action-names-form`}>
    <Paragraph>{t('sidebar.fixActionNames.description')}</Paragraph>
    <div className="addons-rule-summary">
      <strong>{rules.filter(rule => rule.enabled).length} {t('sidebar.fixActionNames.typesActive')}</strong>
      <div className="addons-rule-chips">{rules.map((rule, index) => rule.enabled &&
        <span key={rule.type}>{t(`sidebar.fixActionNames.${ruleLabels[index]}`)}</span>)}</div>
    </div>
    <Paragraph>{t('sidebar.fixActionNames.configureInPopup')}</Paragraph>
    <div className="addons-form-actions addons-form-actions--full">
      <button id={`${idPrefix}fix-action-names-apply`} type="button"
        className="addons-action addons-action--primary" onClick={apply}>
        {t('sidebar.fixActionNames.apply')}
      </button>
      <RestoreButton id={`${idPrefix}fix-action-names-reset`}
        label={t('sidebar.fixActionNames.reset')} onClick={reset} />
    </div>
    <div className="addons-form-note"><Paragraph>{t('sidebar.fixActionNames.saved')}</Paragraph></div>
    {error && <p role="alert">{error}</p>}
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
  </div>;
};
