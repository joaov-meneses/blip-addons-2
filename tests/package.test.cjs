const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const manifest = JSON.parse(fs.readFileSync(path.join(dist, 'manifest.json'), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

test('single MV3 identity, scoped permissions and every declared asset exists', () => {
  assert.equal(manifest.name, 'Blip Addons 2.0');
  assert.equal(manifest.version, require('../package.json').version);
  assert.equal(manifest.manifest_version, 3);
  assert.deepEqual(manifest.permissions, ['storage']);
  assert.equal(manifest.key, undefined);
  assert.equal(manifest.update_url, undefined);
  const files = [...Object.values(manifest.icons), manifest.action.default_popup,
    ...manifest.content_scripts.flatMap(script => [...script.js, ...(script.css || [])]),
    ...manifest.web_accessible_resources.flatMap(rule => rule.resources)];
  for (const file of files) assert.ok(fs.existsSync(path.join(dist, file)), file);
  for (const rule of manifest.web_accessible_resources) assert.deepEqual(rule.matches, ['*://*.blip.ai/*']);
  assert.equal(manifest.content_scripts[0].run_at, 'document_start');
  assert.equal(manifest.content_scripts[0].all_frames, true);
  assert.deepEqual(manifest.content_scripts[0].js, ['js/integration-controls.js']);
});

test('Better Blip Builder runtime is byte-for-byte preserved', () => {
  for (const name of ['blip-builder.js', 'inject.js', 'assets/inject.css', 'assets/CascadiaMono.ttf']) {
    assert.equal(digest(path.join(dist, name)), digest(path.join(root, 'vendor/better-blip-builder', name)), name);
  }
});

test('all entry scripts parse without eval-based development bundles', () => {
  for (const file of ['blip-builder.js', 'inject.js', 'js/content.js', 'js/listener.js', 'js/popup.js', 'js/integration-controls.js']) {
    const code = fs.readFileSync(path.join(dist, file), 'utf8');
    new vm.Script(code, { filename: file });
    assert.equal(/eval\(/.test(code), false, file + ': no eval');
    assert.equal(/^\/\/# sourceMappingURL=data:/m.test(code), false, file + ': no inline JS map');
  }
});
