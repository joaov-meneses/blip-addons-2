const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { transformSync } = require('esbuild');
const compiled = transformSync(fs.readFileSync(path.join(__dirname, '../src/app/Features/FixActionNames/rules.ts'), 'utf8'), {
  loader: 'ts', format: 'cjs', target: 'es2020',
}).code;
const engine = { exports: {} };
new Function('module', 'exports', compiled)(engine, engine.exports);
const { planActionNames, applyActionNames, normalizeActionNameRules } = engine.exports;
const defaults = () => normalizeActionNameRules(null);
const action = (type, settings, title = 'Original') => ({ type, settings, $title: title, conditions: [{ source: 'context' }] });

test('renames every supported action across blocks and nested flow without changing behavior or payloads', () => {
  const tracking = action('TrackEvent', { category: 'Conversão', action: 'OK', extras: { source: 'test' } });
  const script = action('ExecuteScript', { outputVariable: 'result', source: 'function run() { return 1; }' });
  const http = action('ProcessHttp', { responseBodyVariable: 'response', method: 'POST', body: '{"test":true}' });
  const command = action('ProcessCommand', { variable: 'contact', method: 'get' });
  const variable = action('SetVariable', { variable: 'next', value: '{{contact.name}} / {{input.content}}' });
  const v2 = action('ExecuteScriptV2', { outputVariable: 'resultV2' });
  const payload = action('TrackEvent', { category: 'Payload, not an action' });
  const flow = {
    onboarding: { $enteringCustomActions: [tracking, script], $leavingCustomActions: [] },
    fallback: { $leavingCustomActions: [http, command] },
    error: { $contentActions: [{ action: variable }, { action: action('SendMessage', { payload }) }] },
    subflow: { flow: { child: { $enteringCustomActions: [v2] } } },
    $whiteWallIntegration: { configuration: { payload } },
    addonsSettings: { saved: payload },
  };
  const snapshot = JSON.stringify(flow);
  const preview = planActionNames(flow, defaults());
  assert.equal(preview.changes.length, 6);
  assert.equal(JSON.stringify(flow), snapshot, 'preview does not mutate the flow');
  applyActionNames(flow, defaults());
  assert.equal(tracking.$title, 'Track "Conversão"');
  assert.equal(script.$title, 'Process "result"');
  assert.equal(http.$title, 'Request "response" using "POST"');
  assert.equal(command.$title, 'Request "contact" using "get"');
  assert.equal(variable.$title, 'Set "{contact.name} / {input.content}" to "next"');
  assert.equal(v2.$title, 'Process "resultV2"');
  assert.equal(payload.$title, 'Original');
  const again = applyActionNames(flow, defaults());
  assert.equal(again.changes.length, 0);
  assert.equal(again.unchanged, 6);
  preview.changes.forEach(change => { change.action.$title = change.before; });
  assert.equal(JSON.stringify(flow), snapshot, 'only action titles were changed');
});

test('expands each template independently, preserving replacement characters and runtime variables when requested', () => {
  const rules = defaults();
  rules[0].template = '{{ category }} / {{category}}';
  const first = action('TrackEvent', { category: '$& {{contact.name}}' });
  const second = action('TrackEvent', { category: 'Second' });
  const third = action('SetVariable', { value: false, variable: 0 });
  const items = [first, second, third];
  items.push(items); // Malformed cyclic references cannot loop forever.
  items.push(first); // Shared references count once.
  const plan = applyActionNames(items, rules, false);
  assert.equal(plan.changes.length, 3);
  assert.equal(first.$title, '$& {{contact.name}} / $& {{contact.name}}');
  assert.equal(second.$title, 'Second / Second');
  assert.equal(third.$title, 'Set "false" to "0"');
});

test('missing fields, disabled types and empty templates cannot produce undefined names or partial changes', () => {
  const rules = defaults();
  rules[1].enabled = false;
  const good = action('TrackEvent', { category: 'OK' });
  const missing = action('ProcessHttp', { method: 'GET' });
  const noSettings = action('TrackEvent', null);
  const objectValue = action('SetVariable', { value: { type: 'TrackEvent' }, variable: 'x' });
  const disabled = action('ExecuteScript', { outputVariable: 'keep' });
  const inherited = action('TrackEvent', Object.create({ category: 'not own' }));
  const flow = [null, good, missing, noSettings, objectValue, disabled, inherited];
  const result = applyActionNames(flow, rules);
  assert.equal(result.changes.length, 1);
  assert.equal(result.skipped.length, 4);
  assert.equal(missing.$title, 'Original');
  assert.equal(noSettings.$title, 'Original');
  assert.equal(objectValue.$title, 'Original');
  assert.equal(disabled.$title, 'Original');
  rules[0].template = 'Changed';
  rules[2].template = '  ';
  assert.throws(() => applyActionNames(flow, rules), /empty-template/);
  assert.equal(good.$title, 'Track "OK"', 'validation precedes all mutations');
  assert.equal(applyActionNames(flow, defaults().map(rule => ({ ...rule, enabled: false }))).changes.length, 0);
});

test('restores defaults safely from incomplete or malformed preferences', () => {
  const saved = normalizeActionNameRules([null, { type: 'TrackEvent', enabled: false, template: 'Evento {{category}}' },
    { type: 'ProcessHttp', enabled: 'yes', template: {} }, { type: '__proto__', enabled: true, template: 'bad' }]);
  assert.equal(saved.length, 5);
  assert.deepEqual(saved[0], { type: 'TrackEvent', enabled: false, template: 'Evento {{category}}' });
  assert.deepEqual(saved[2], defaults()[2]);
  saved[1].template = 'Edited';
  assert.equal(defaults()[1].template, 'Process "{{outputVariable}}"');
});
