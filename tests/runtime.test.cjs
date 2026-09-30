const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole, ResourceLoader } = require('jsdom');
const root = path.resolve(__dirname, '..');
const tick = () => new Promise(resolve => setTimeout(resolve, 30));

function builder(t) {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', error => errors.push(error.message));
  vc.on('warn', (...args) => errors.push(args.map(String).join(' ')));
  vc.on('error', (...args) => errors.push(args.map(String).join(' ')));
  const dom = new JSDOM(`<!doctype html><html><head></head><body>
    <div class="bot-name">Teste</div><div id="canvas"></div>
    <div class="builder-add-button"></div><div class="builder-icon-button-list"></div>
    <div id="main-content-area"></div>
    <bds-tab-item label="Ações"><actions></actions></bds-tab-item>
    <div class="tab-content"><actions></actions></div></body></html>`, {
    url: 'https://test.blip.ai/application/detail/test-bot/builder',
    runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: vc,
  });
  t.after(() => dom.window.close());
  const win = dom.window;
  Object.defineProperty(win.HTMLElement.prototype, 'innerText', {
    get() { return this.textContent; }, set(value) { this.textContent = value; },
  });
  const messages = [];
  win.postMessage = data => {
    messages.push(data);
    win.queueMicrotask(() => {
      // A real browser discards queued messages when the document is destroyed.
      if (!win.document?.documentElement) return;
      win.dispatchEvent(new win.MessageEvent('message', {
        data, source: win, origin: win.location.origin,
      }));
    });
  };
  const controller = {
    isLoading: false, flow: {}, selectedNodes: [], copiedStates: [],
    application: { name: 'Teste', shortName: 'test-bot' },
    $scope: { $watch: (key, cb) => cb(true) },
    createContentState: name => ({ id: 'new-block', $title: name, $position: { left: '0px', top: '0px' },
      $enteringCustomActions: [], $leavingCustomActions: [], $contentActions: [],
      $conditionOutputs: [], $defaultOutput: {} }),
    clearSearch() {}, toggleAddingBlocks() {}, closeSidebar() {},
    async addAndEditState(state) { this.flow[state.id] = state; this.editingState = state; },
    debouncedEditState(state) { this.editingState = state; },
    saveState(state) { this.saved = state; },
    addContentState() {}, duplicateStateObject() {}, addDeskState() {},
    ngToast: { success() {}, warning() {}, danger() {} },
    SidebarContentService: { getSidebars: () => [] },
  };
  class MonacoEditor { addEditorActions() { return 'original-editor-result'; } }
  win.angular = { element: () => ({ controller: () => controller, injector: () => ({
    get: name => name === 'monacoEditorDirective' ? [{ controller: MonacoEditor }] : null,
    has: name => name === 'monacoEditorDirective',
  }) }) };
  win.fetch = () => { throw new Error('Unexpected external request in local test'); };
  win.chrome = { runtime: { id: 'testextension', getURL: file => 'chrome-extension://testextension/' + file } };
  const load = file => win.eval(fs.readFileSync(path.join(root, 'dist', file), 'utf8'));
  const sendFeature = (code, type = 'run') => win.postMessage({ channel: 'blip-addons-2', isFeatureRequest: true, code, type, args: [] });
  return { win, messages, errors, controller, load, sendFeature, MonacoEditor };
}

test('Fix Action Names confirms before changing the current flow and saves templates', async t => {
  const { win, controller, load, sendFeature, errors, messages } = builder(t);
  const tracking = { type: 'TrackEvent', $title: 'Original', settings: { category: 'Venda', action: 'OK' } };
  const script = { type: 'ExecuteScript', $title: 'Script original', settings: { outputVariable: 'result', source: 'function run() {}' } };
  const state = controller.createContentState('Test');
  state.$enteringCustomActions = [tracking, script];
  controller.flow.test = state;
  let digests = 0;
  controller.$scope.$evalAsync = () => { digests++; };
  const provider = win.document.createElement('bds-theme-provider');
  provider.setAttribute('theme', 'dark');
  provider.innerHTML = '<div id="node-content-tab"><bds-tab-group class="builder-sidebar-tabs">' +
    '<bds-tab-item label="Variáveis" open><form id="variablesForm"></form></bds-tab-item>' +
    '<bds-tab-item label="Versões"></bds-tab-item><bds-tab-item label="Ações globais"></bds-tab-item>' +
    '</bds-tab-group></div>';
  win.document.getElementById('main-content-area').appendChild(provider);
  load('js/listener.js');
  win.postMessage({ channel: 'blip-addons-2', isSettingsUpdate: true, isFromClient: false, newSettings: { modules: { qualityChecker: true } } });
  sendFeature('ADD_BUILDER_SETTINGS_TAB');
  await tick();
  const tab = provider.querySelector('#blip-addons-general-tab');
  const headers = [...tab.querySelectorAll('.addons-general-header')].map(node => node.textContent);
  assert.equal(headers[headers.indexOf('Quality Checker') + 1], 'Fix Action Names');
  const form = () => provider.querySelector('#general-fix-action-names-form');
  const input = () => form().querySelector('[data-action-name-type="TrackEvent"] bds-input');
  input().value = 'Evento {{category}} / {{category}}';
  input().dispatchEvent(new win.CustomEvent('bdsChange', { bubbles: true }));
  form().querySelector('[name="fix-action-ExecuteScript"]').click();
  assert.equal(form().querySelector('#general-fix-action-names-preview'), null);
  form().querySelector('#general-fix-action-names-apply').click();
  await tick();
  assert.equal(tracking.$title, 'Original');
  assert.ok(win.document.querySelector('bds-alert'));
  win.document.querySelector('bds-alert bds-button[variant="secondary"]').click();
  await tick();
  assert.equal(win.document.querySelector('bds-alert'), null);
  assert.equal(tracking.$title, 'Original');
  assert.equal(digests, 0);
  // A change made after opening the confirmation is read when confirmed.
  tracking.settings.category = 'Atual';
  form().querySelector('#general-fix-action-names-apply').click();
  await tick();
  assert.equal(tracking.$title, 'Original');
  win.document.querySelector('bds-alert bds-button[variant="primary"]').click();
  await tick();
  const settings = messages.filter(message => message.isSettingsUpdate).at(-1).newSettings;
  assert.equal(settings.actionNameRules[0].template, 'Evento {{category}} / {{category}}');
  assert.equal(settings.actionNameRules[1].enabled, false);
  assert.ok(!JSON.stringify(settings).includes('Venda'), 'flow data is never sent to settings storage');
  assert.equal(tracking.$title, 'Evento Atual / Atual');
  assert.equal(script.$title, 'Script original');
  assert.equal(script.settings.source, 'function run() {}');
  assert.equal(digests, 1);
  assert.match(form().querySelector('#general-fix-action-names-result').textContent, /1 ação\(ões\) renomeada\(s\)/);
  sendFeature('ADD_BUILDER_SETTINGS_TAB', 'cleanup');
  await tick();
  sendFeature('ADD_BUILDER_SETTINGS_TAB');
  await tick();
  assert.equal(input().value, 'Evento {{category}} / {{category}}');
  assert.equal(form().querySelector('[name="fix-action-ExecuteScript"]').checked, false);
  input().value = '';
  input().dispatchEvent(new win.CustomEvent('bdsChange', { bubbles: true }));
  form().querySelector('#general-fix-action-names-apply').click();
  await tick();
  assert.ok(form().querySelector('[role="alert"]'));
  assert.equal(tracking.$title, 'Evento Atual / Atual');
  form().querySelector('#general-fix-action-names-reset').click();
  await tick();
  assert.equal(input().value, 'Track "{{category}}"');
  controller.isLoading = true;
  form().querySelector('#general-fix-action-names-apply').click();
  await tick();
  assert.match(form().querySelector('[role="alert"]').textContent, /carregar/);
  assert.equal(tracking.$title, 'Evento Atual / Atual');
  assert.equal(errors.length, 0, errors.join('\n'));
});

test('module defaults hide three panels and persisted changes update the Builder tab through storage', async t => {
  const { win, load, sendFeature, errors } = builder(t);
  let storageChanged;
  win.chrome.storage = {
    sync: { get: (key, callback) => callback({ settings: { language: 'ptbr', prodKey: ['live'] } }), set() {} },
    onChanged: { addListener: callback => { storageChanged = callback; } },
  };
  load('js/content.js');
  load('js/listener.js');
  const doc = win.document;
  const provider = doc.createElement('bds-theme-provider');
  provider.innerHTML = '<div id="node-content-tab"><bds-tab-group class="builder-sidebar-tabs">' +
    '<bds-tab-item label="Variáveis" open><form id="variablesForm"></form></bds-tab-item>' +
    '<bds-tab-item label="Versões"></bds-tab-item><bds-tab-item label="Ações globais"></bds-tab-item>' +
    '</bds-tab-group></div>';
  doc.getElementById('main-content-area').appendChild(provider);
  await tick();
  sendFeature('ADD_BUILDER_SETTINGS_TAB');
  await tick();
  const tab = provider.querySelector('#blip-addons-general-tab');
  const labels = () => [...tab.querySelectorAll('.addons-general-header')].map(node => node.textContent);
  const pt = JSON.parse(fs.readFileSync(path.join(root, 'src/locales/ptbr/common.json'), 'utf8'));
  const expectedDefaults = ['globalInactivity', 'setGlobalTrackings', 'removeGlobalTrackings', 'fixActionNames'];
  assert.deepEqual(labels(), expectedDefaults.map(key => pt.sidebar[key].title));
  assert.equal(doc.querySelector('.QualityCheck'), null);
  const enableAll = Object.fromEntries([...expectedDefaults, 'checkInconsistencies', 'botStatistics', 'qualityChecker', 'newIntegration'].map(key => [key, true]));
  storageChanged({ settings: { newValue: { modules: enableAll } } }, 'sync');
  await tick();
  assert.equal(labels().length, 7);
  assert.ok(doc.querySelector('.QualityCheck'));
  assert.equal(labels()[labels().indexOf('Quality Checker') + 1], 'Fix Action Names');
  const disableAll = Object.fromEntries(Object.keys(enableAll).map(key => [key, false]));
  storageChanged({ settings: { newValue: { modules: disableAll } } }, 'sync');
  await tick();
  assert.equal(labels().length, 0);
  assert.match(tab.textContent, /Nenhum módulo está habilitado/);
  assert.equal(doc.querySelector('.QualityCheck'), null);
  assert.equal(doc.querySelector('#general-fix-action-names-form'), null);
  // Invalid values cannot enable a disabled module; unknown keys are ignored.
  storageChanged({ settings: { newValue: { modules: { qualityChecker: 'true', unknown: true, fixActionNames: true } } } }, 'sync');
  await tick();
  assert.deepEqual(labels(), ['Fix Action Names']);
  storageChanged({ settings: { newValue: { modules: { globalInactivity: true } } } }, 'sync');
  await tick();
  assert.deepEqual(labels(), [pt.sidebar.globalInactivity.title, 'Fix Action Names']);
  assert.equal(doc.querySelector('#blips-extension-button'), null);
  assert.equal(errors.length, 0, errors.join('\n'));
});

test('New integration can be hidden and re-enabled without breaking existing integration editing', async t => {
  const { win, controller, load, errors, messages } = builder(t);
  let storageChanged, initialRead;
  win.chrome.storage = {
    sync: { get: (key, callback) => { initialRead = callback; } },
    onChanged: { addListener: callback => { storageChanged = callback; } },
  };
  const style = win.document.createElement('style');
  style.textContent = fs.readFileSync(path.join(root, 'dist/module-controls.css'), 'utf8');
  win.document.head.appendChild(style);
  load('js/integration-controls.js');
  load('blip-builder.js');
  await tick();
  load('inject.js');
  win.document.querySelector('script[data-ww-ext-script]').dispatchEvent(new win.Event('load'));
  await tick();
  const button = win.document.querySelector('.builder-add-button bds-button[icon="plugin"]');
  assert.ok(button);
  assert.equal(win.getComputedStyle(button).display, 'none', 'hidden until storage finishes loading');
  initialRead({ settings: { modules: { newIntegration: false } } });
  button.click();
  await tick();
  assert.equal(controller.flow['ww:new-block'], undefined);
  assert.equal(messages.filter(message => message.type === 'blip-builder-add-integration-block').length, 0);
  const nativeButton = win.document.createElement('button');
  win.document.querySelector('.builder-add-button').appendChild(nativeButton);
  let nativeClicks = 0; nativeButton.onclick = () => { nativeClicks++; }; nativeButton.click();
  assert.equal(nativeClicks, 1, 'ordinary Builder buttons continue working');
  const saved = controller.createContentState('Existing integration'); saved.id = 'ww:existing';
  saved.$whiteWallIntegration = { type: 'gsheets', configuration: {} }; controller.flow[saved.id] = saved;
  const config = { type: 'gsheets', configuration: { sheet: 'updated' } };
  win.postMessage({ type: 'blip-builder-update-state-property', payload: {
    stateId: saved.id, property: '$whiteWallIntegration', value: config,
  } });
  await tick();
  assert.equal(controller.saved.$whiteWallIntegration, config);
  storageChanged({ settings: { newValue: { modules: { newIntegration: true } } } }, 'sync');
  assert.notEqual(win.getComputedStyle(button).display, 'none');
  button.click();
  await tick();
  assert.ok(controller.flow['ww:new-block']);
  storageChanged({ settings: { newValue: { modules: { newIntegration: false } } } }, 'sync');
  assert.equal(win.getComputedStyle(button).display, 'none');
  delete controller.flow['ww:new-block'];
  const replacement = button.cloneNode(true); button.replaceWith(replacement);
  assert.equal(win.getComputedStyle(replacement).display, 'none', 'newly mounted buttons inherit the setting');
  // A delayed startup read must not override a newer storage change.
  initialRead({ settings: { modules: { newIntegration: true } } });
  assert.equal(win.document.documentElement.getAttribute('data-blip-addons-new-integration'), 'disabled');
  assert.equal(errors.length, 0, errors.join('\n'));
});

test('native settings tab mounts after global actions, inherits theme and follows module preferences without editing flows', async t => {
  const { win, controller, load, sendFeature, errors } = builder(t);
  const doc = win.document;
  const before = JSON.stringify(controller.flow);
  const provider = doc.createElement('bds-theme-provider'); provider.setAttribute('theme', 'dark');
  provider.innerHTML = '<div id="node-content-tab"><bds-tab-group class="builder-sidebar-tabs">' +
    '<bds-tab-item label="Variáveis" open><form id="variablesForm"></form></bds-tab-item>' +
    '<bds-tab-item label="Versões"></bds-tab-item><bds-tab-item label="Ações globais"></bds-tab-item>' +
    '</bds-tab-group></div>';
  doc.getElementById('main-content-area').appendChild(provider);
  load('js/listener.js');
  sendFeature('ADD_BUILDER_SETTINGS_TAB');
  await tick();
  const group = provider.querySelector('bds-tab-group');
  const tab = group.querySelector('#blip-addons-general-tab');
  assert.ok(tab);
  assert.deepEqual([...group.children].map(node => node.getAttribute('label')), ['Variáveis', 'Versões', 'Ações globais', 'Builder 2.0']);
  assert.equal(tab.closest('bds-theme-provider').getAttribute('theme'), 'dark');
  assert.equal(tab.querySelectorAll('.addons-general-section').length, 4);
  assert.equal(tab.querySelector('.QualityCheck'), null);
  assert.ok(tab.querySelector('#general-fix-action-names-form'));
  const header = tab.querySelector('[data-module="globalInactivity"] button');
  const body = tab.querySelector('#addons-general-globalInactivity');
  assert.equal(body.hidden, true);
  header.click();
  assert.equal(body.hidden, false);
  assert.equal(header.getAttribute('aria-expanded'), 'true');
  const define = body.querySelector('.addons-action--primary');
  define.click();
  await tick();
  const overlay = doc.querySelector('bds-alert').closest('bds-theme-provider');
  assert.equal(overlay.getAttribute('theme'), 'dark');
  overlay.querySelector('bds-button[variant="secondary"]').click();
  await tick();
  assert.equal(doc.querySelector('bds-alert'), null);
  assert.equal(JSON.stringify(controller.flow), before, 'opening panels and cancelling cannot change the bot');
  sendFeature('ADD_BUILDER_SETTINGS_TAB');
  await tick();
  assert.equal(group.querySelectorAll('#blip-addons-general-tab').length, 1);
  win.postMessage({ channel: 'blip-addons-2', isSettingsUpdate: true, isFromClient: false,
    newSettings: { modules: { qualityChecker: true, fixActionNames: false } } });
  await tick();
  assert.ok(tab.querySelector('.QualityCheck'));
  assert.equal(tab.querySelector('#general-fix-action-names-form'), null);
  // Keyboard navigation uses the live header list, including dynamically added tabs.
  const shadow = group.attachShadow({ mode: 'open' });
  shadow.innerHTML = Array.from({ length: 4 }, () => '<div class="tab_group__header__itens__item" tabindex="0"></div>').join('');
  const headers = [...shadow.children];
  headers[0].focus();
  headers[0].dispatchEvent(new win.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, composed: true }));
  assert.equal(shadow.activeElement, headers[3]);
  provider.setAttribute('theme', 'light');
  assert.equal(tab.closest('bds-theme-provider').getAttribute('theme'), 'light');
  // A block editing sidebar is not a general settings panel.
  provider.innerHTML = '<div id="node-content-tab"><bds-tab-group class="builder-sidebar-tabs"><bds-tab-item label="Ações"></bds-tab-item></bds-tab-group></div>';
  await tick();
  assert.equal(provider.querySelector('#blip-addons-general-tab'), null);
  provider.innerHTML = '<div id="node-content-tab"><bds-tab-group class="builder-sidebar-tabs"><bds-tab-item label="Variables"><form id="variablesForm"></form></bds-tab-item></bds-tab-group></div>';
  await tick();
  assert.ok(provider.querySelector('#blip-addons-general-tab'), 'reattaches when general settings are reopened');
  sendFeature('ADD_BUILDER_SETTINGS_TAB', 'cleanup');
  await tick();
  assert.equal(provider.querySelector('#blip-addons-general-tab'), null);
  assert.ok(provider.querySelector('#variablesForm'));
  assert.equal(errors.length, 0, errors.join('\n'));
});

test('original integration engine creates and saves integration blocks', async t => {
  const { win, controller, load, messages, errors } = builder(t);
  load('inject.js');
  win.postMessage({ type: 'blip-builder-add-integration-block' });
  await tick();
  assert.ok(controller.flow['ww:new-block']);
  assert.deepEqual(Object.keys(controller.flow['ww:new-block'].$whiteWallIntegration), []);
  assert.ok(messages.some(message => message.type === 'blip-builder-edit-state' && message.payload.isww));
  const config = { type: 'gsheets', configuration: { sheet: 'test' } };
  win.postMessage({ type: 'blip-builder-update-state-property', payload: {
    stateId: 'ww:new-block', property: '$whiteWallIntegration', value: config,
  } });
  await tick();
  assert.equal(controller.saved.$whiteWallIntegration, config);
  assert.equal(errors.length, 0, errors.join('\n'));
});

test('both runtimes coexist: integration UI has 13 options and Builder settings tab mounts', async t => {
  const { win, load, sendFeature, errors } = builder(t);
  load('blip-builder.js');
  await tick();
  load('inject.js');
  win.document.querySelector('script[data-ww-ext-script]').dispatchEvent(new win.Event('load'));
  load('js/listener.js');
  const provider = win.document.createElement('bds-theme-provider');
  provider.innerHTML = '<div id="node-content-tab"><bds-tab-group class="builder-sidebar-tabs">' +
    '<bds-tab-item label="Variáveis" open><form id="variablesForm"></form></bds-tab-item>' +
    '<bds-tab-item label="Versões"></bds-tab-item><bds-tab-item label="Ações globais"></bds-tab-item>' +
    '</bds-tab-group></div>';
  win.document.getElementById('main-content-area').appendChild(provider);
  sendFeature('ADD_BUILDER_SETTINGS_TAB');
  sendFeature('ADD_SIDEBAR');
  await tick();
  const integrationButton = [...win.document.querySelectorAll('.builder-add-button bds-button')][0];
  assert.ok(integrationButton, 'original integration button');
  integrationButton.click();
  await tick();
  const select = win.document.querySelector('bds-select[label="Integração"]');
  assert.ok(select, 'integration selector');
  assert.equal(select.querySelectorAll('bds-select-option').length, 13);
  assert.ok(provider.querySelector('#blip-addons-general-tab'), 'Builder settings tab');
  assert.equal(win.document.getElementById('blips-extension-button'), null, 'old star button is absent');
  assert.equal(errors.length, 0, errors.join('\n'));
});

test('Addons ignores unrelated messages and ordinary pasted text; clipboard survives cleanup', async t => {
  const { win, load, sendFeature, errors, messages, controller } = builder(t);
  load('js/listener.js');
  win.postMessage(null);
  win.postMessage({ type: 'blip-builder-edit-state', payload: {} });
  win.postMessage({ isFeatureRequest: true, code: 'ADD_BUILDER_SETTINGS_TAB', type: 'run', args: [] });
  await tick();
  assert.equal(win.document.getElementById('blips-extension-button'), null);
  sendFeature('PASTE_BLOCK');
  await tick();
  const paste = text => {
    const event = new win.Event('paste', { bubbles: true });
    Object.defineProperty(event, 'clipboardData', { value: { getData: () => text } });
    win.document.body.dispatchEvent(event);
  };
  paste('ordinary text'); paste('null'); paste('{}');
  sendFeature('PASTE_BLOCK', 'cleanup');
  await tick();
  sendFeature('PASTE_BLOCK');
  await tick();
  const state = controller.createContentState('Copied integration');
  state.id = 'ww:copied';
  state.$whiteWallIntegration = { type: 'chatgpt', configuration: { test: true } };
  const node = win.document.createElement('builder-node'); node.id = state.id;
  win.document.body.appendChild(node);
  controller.selectNode = () => {};
  paste(JSON.stringify({ isCopyFromBlips: true, originBot: 'other-bot', blocksCode: JSON.stringify([state]) }));
  await tick();
  assert.equal(errors.length, 0, errors.join('\n'));
  assert.equal(controller.flow['ww:copied'].$whiteWallIntegration.type, 'chatgpt');
  assert.ok(messages.some(message => message.isHandshake));
  assert.equal(errors.length, 0, errors.join('\n'));
});

test('popup loads local chunks and persists language, DEV settings and all eight module switches', async t => {
  const missing = [], errors = [];
  let stored = {};
  class LocalResources extends ResourceLoader {
    fetch(url) {
      const parsed = new URL(url);
      if (parsed.protocol !== 'chrome-extension:') { missing.push(url); return null; }
      const file = path.join(root, 'dist', decodeURIComponent(parsed.pathname));
      if (!fs.existsSync(file)) { missing.push(file); return null; }
      return Promise.resolve(fs.readFileSync(file));
    }
  }
  const vc = new VirtualConsole();
  vc.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(fs.readFileSync(path.join(root, 'dist/popup.html'), 'utf8'), {
    url: 'chrome-extension://testextension/popup.html', runScripts: 'dangerously',
    resources: new LocalResources(), pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(win) {
      win.chrome = {
        runtime: { getURL: file => 'chrome-extension://testextension/' + file },
        storage: { sync: { get: (key, cb) => cb(stored), set: value => { stored = JSON.parse(JSON.stringify(value)); } } },
      };
      win.fetch = () => Promise.resolve({ text: () => Promise.resolve('<svg></svg>') });
      win.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
    },
  });
  t.after(() => dom.window.close());
  await new Promise(resolve => dom.window.addEventListener('load', resolve, { once: true }));
  await tick();
  const doc = dom.window.document;
  assert.match(doc.querySelector('h2').textContent, /Blip Addons 2.0/);
  assert.equal(doc.querySelectorAll('bds-select-option').length, 3);
  for (const name of ['Configuração de palavra-chave', 'Configuração dos snippets', 'Configuração das tags', 'Módulos do Builder', 'Configurações DEV mode', 'Integrações do Builder']) {
    [...doc.querySelectorAll('bds-button')].find(button => button.textContent.trim() === name).click();
    await tick();
    assert.equal(doc.querySelector('h2').textContent, name);
    if (name === 'Módulos do Builder') {
      assert.equal(doc.querySelectorAll('bds-switch').length, 8);
      for (const key of ['checkInconsistencies', 'botStatistics', 'qualityChecker']) {
        assert.equal(doc.querySelector(`bds-switch[name="${key}"]`).checked, false);
      }
      for (const key of ['globalInactivity', 'setGlobalTrackings', 'removeGlobalTrackings', 'fixActionNames', 'newIntegration']) {
        assert.equal(doc.querySelector(`bds-switch[name="${key}"]`).checked, true);
      }
      const toggle = (key, checked) => doc.querySelector(`bds-switch[name="${key}"]`)
        .dispatchEvent(new dom.window.CustomEvent('bdsChange', { bubbles: true, detail: { checked } }));
      toggle('botStatistics', true);
      toggle('fixActionNames', false);
      toggle('newIntegration', false);
      await tick();
      assert.equal(stored.settings.modules.botStatistics, true);
      assert.equal(stored.settings.modules.fixActionNames, false);
      assert.equal(stored.settings.modules.newIntegration, false);
      assert.equal(stored.settings.modules.qualityChecker, false);
      assert.equal(stored.settings.modules.globalInactivity, true);
      doc.querySelector('bds-button-icon[icon="arrow-left"]').click();
      await tick();
      [...doc.querySelectorAll('bds-button')].find(button => button.textContent.trim() === name).click();
      await tick();
      assert.equal(doc.querySelector('bds-switch[name="botStatistics"]').checked, true);
      assert.equal(doc.querySelector('bds-switch[name="newIntegration"]').checked, false);
    }
    if (name === 'Configurações DEV mode') {
      assert.equal(doc.querySelectorAll('bds-switch').length, 6);
      doc.querySelector('bds-switch[name="onlyRouters"]').dispatchEvent(new dom.window.CustomEvent('bdsChange', { bubbles: true, detail: { checked: true } }));
      await tick();
      assert.equal(stored.settings.devMode.onlyRouters, true);
      assert.equal(stored.settings.devMode.hideLibraryFunction, false);
    }
    if (name === 'Integrações do Builder') assert.equal(doc.querySelectorAll('.addons-integrations span').length, 13);
    doc.querySelector('bds-button-icon[icon="arrow-left"]').click();
    await tick();
  }
  doc.querySelector('bds-select').dispatchEvent(new dom.window.CustomEvent('bdsChange', { detail: { value: 'en' } }));
  await tick();
  assert.equal(stored.settings.language, 'en');
  assert.equal(errors.length, 0, errors.join('\n'));
  const english = JSON.parse(fs.readFileSync(path.join(root, 'src/locales/en/common.json'), 'utf8'));
  assert.equal(doc.querySelector('h2').textContent, english.toastContainer.title.replace('Blip Addons', 'Blip Addons 2.0'));
  assert.equal(missing.length, 0, missing.join('\n'));
  assert.equal(errors.length, 0, errors.join('\n'));
});

test('1.3.9 toolbar, comments and statistics coexist with integration metadata', async t => {
  const { win, load, controller, sendFeature, errors } = builder(t);
  const doc = win.document;
  const secondToolbar = doc.createElement('div'); secondToolbar.className = 'builder-icon-button-list'; doc.body.appendChild(secondToolbar);
  const onboarding = controller.createContentState('Start'); onboarding.id = 'onboarding';
  const state = controller.createContentState('Integration'); state.id = 'ww:commented';
  state.$whiteWallIntegration = { type: 'gsheets', configuration: { sheet: 'test' } };
  state.$leavingCustomActions = [{ type: 'ProcessHttp', settings: {} }, { type: 'TrackEvent', settings: { category: 'Example' } }];
  controller.flow = { onboarding, [state.id]: state }; controller.selectedNodes = [{ id: state.id }]; controller.searchedStates = [];
  const node = doc.createElement('builder-node'); node.id = state.id; node.className = 'selected-node';
  node.innerHTML = '<div class="builder-node-container"><div ng-if="!$ctrl.isSubflowBlock"></div></div><div class="builder-node-menu"><div class="builder-node-context-menu"></div></div>';
  doc.body.appendChild(node);
  const provider = doc.createElement('bds-theme-provider');
  provider.innerHTML = '<div id="node-content-tab"><bds-tab-group class="builder-sidebar-tabs">' +
    '<bds-tab-item label="Variáveis" open><form id="variablesForm"></form></bds-tab-item>' +
    '<bds-tab-item label="Versões"></bds-tab-item><bds-tab-item label="Ações globais"></bds-tab-item>' +
    '</bds-tab-group></div>';
  doc.getElementById('main-content-area').appendChild(provider);
  load('js/listener.js');
  win.postMessage({ channel: 'blip-addons-2', isSettingsUpdate: true, isFromClient: false,
    newSettings: { modules: { botStatistics: true, qualityChecker: true } } });
  for (const code of ['ADD_BUILDER_SETTINGS_TAB', 'CLEAN_ENVIRONMENT', 'ADD_FLOW_COMMENTS_SIDEBAR', 'ADD_COMMENTS_OF_BLOCKS']) sendFeature(code);
  await tick();
  assert.equal(secondToolbar.querySelector('#blips-extension-button'), null);
  assert.ok(secondToolbar.querySelector('#flowcomments-button'));
  const tab = provider.querySelector('#blip-addons-general-tab');
  assert.match(tab.textContent, /Estatísticas do Bot/);
  assert.match(tab.textContent, /Quality Checker/);
  node.querySelector('.add-comment-block-option').click();
  await tick();
  const editor = doc.getElementById('blip-addons-add-comment-sidebar');
  [...editor.querySelectorAll('bds-button')].find(button => button.textContent.trim() === 'Adicionar comentário').click();
  await tick();
  const input = editor.querySelector('bds-input');
  input.value = 'Verificar retorno da integração';
  input.dispatchEvent(new win.CustomEvent('bdsChange', { bubbles: true }));
  await tick();
  [...editor.querySelectorAll('bds-button')].find(button => button.textContent.trim() === 'Salvar').click();
  await tick();
  const comment = Object.values(onboarding.addonsComments)[0];
  assert.equal(comment.text, 'Verificar retorno da integração');
  assert.equal(state.addonsSettings.commentsIdList[0], comment.id);
  assert.ok(node.querySelector('[prop="addons-comment-icon"]'));
  editor.querySelector('bds-button[icon="eye-closed"]').click();
  await tick();
  assert.equal(controller.searchedStates[0], state.id);
  editor.querySelector('bds-button[icon="eye-open"]').click();
  await tick();
  assert.equal(controller.searchedStates.length, 0);
  let clipboard;
  Object.defineProperty(win.navigator, 'clipboard', { value: { writeText: text => { clipboard = text; return Promise.resolve(); } } });
  sendFeature('COPY_BLOCK'); await tick();
  doc.body.dispatchEvent(new win.Event('copy', { bubbles: true }));
  await tick();
  assert.equal(state.addonsSettings.commentsIdList[0], comment.id, 'copy must not alter source comments');
  const copy = JSON.parse(JSON.parse(clipboard).blocksCode)[0];
  assert.equal(copy.$whiteWallIntegration.type, 'gsheets');
  assert.equal(copy.addonsSettings.commentsIdList.length, 0);
  assert.equal(errors.length, 0, errors.join('\n'));
});

test('content bootstrap waits for storage and synchronizes page settings without a write loop', async t => {
  const { win, load, messages, errors } = builder(t);
  let releaseStorage, storageChanged, writes = 0;
  win.chrome.storage = {
    sync: { get: (key, callback) => { releaseStorage = callback; }, set: () => { writes++; } },
    onChanged: { addListener: callback => { storageChanged = callback; } },
  };
  load('js/content.js');
  assert.equal(win.document.querySelector('script[src$="listener.js"]'), null);
  releaseStorage({ settings: { personalSnippets: [{ key: 'saved', value: 'return 42;' }], isAutoTagActive: true } });
  assert.ok(win.document.querySelector('script[src$="listener.js"]'));
  load('js/listener.js');
  await tick();
  const synced = messages.find(message => message.isSettingsUpdate && !message.isFromClient);
  assert.equal(synced.newSettings.personalSnippets[0].key, 'saved');
  storageChanged({ settings: { newValue: { isAutoTagActive: false } } }, 'sync');
  await tick();
  const updates = messages.filter(message => message.isSettingsUpdate);
  assert.equal(updates[updates.length - 1].newSettings.isAutoTagActive, false);
  assert.equal(writes, 0);
  assert.equal(errors.length, 0, errors.join('\n'));
});

test('snippets capture non-global Monaco, preserve the editor wrapper and dispose on cleanup', async t => {
  const { win, load, sendFeature, MonacoEditor, errors } = builder(t);
  let registrations = 0, disposals = 0, provider;
  const monaco = { languages: {
    CompletionItemKind: { Snippet: 27 },
    registerCompletionItemProvider(language, value) {
      assert.equal(language, 'javascript'); registrations++; provider = value;
      return { dispose() { disposals++; } };
    },
  } };
  load('js/listener.js');
  win.postMessage({ channel: 'blip-addons-2', isSettingsUpdate: true, isFromClient: false,
    newSettings: { personalSnippets: [{ key: 'example', value: 'return true;' }] } });
  sendFeature('MONACO_SNIPPET');
  await tick();
  assert.equal(win.monaco, undefined);
  assert.equal(new MonacoEditor().addEditorActions(monaco), 'original-editor-result');
  sendFeature('MONACO_SNIPPET');
  await tick();
  assert.equal(registrations, 1);
  assert.equal(provider.provideCompletionItems().suggestions[0].label, 'example');
  sendFeature('MONACO_SNIPPET', 'cleanup');
  await tick();
  assert.equal(disposals, 1);
  sendFeature('MONACO_SNIPPET');
  await tick();
  assert.equal(registrations, 2);
  assert.equal(errors.length, 0, errors.join('\n'));
});
