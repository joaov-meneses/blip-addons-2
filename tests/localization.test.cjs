const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
test('every static UI translation exists in Portuguese, English and Spanish', () => {
  const missing = JSON.parse(execFileSync(process.execPath, [path.join(__dirname, '../scripts/audit-translations.cjs')], { encoding: 'utf8' }));
  assert.deepEqual(missing, []);
});
