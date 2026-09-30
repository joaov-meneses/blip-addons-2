const fs = require('node:fs');
const path = require('node:path');
const webpack = require('webpack');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
if (path.dirname(dist) !== root || path.basename(dist) !== 'dist') throw new Error('Invalid output path');
fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(path.join(root, 'static'), dist, { recursive: true });
fs.copyFileSync(path.join(root, 'docs/INSTALACAO.md'), path.join(dist, 'INSTALACAO.md'));
fs.copyFileSync(path.join(root, 'docs/FIX-ACTION-NAMES.md'), path.join(dist, 'FIX-ACTION-NAMES.md'));
for (const name of ['blip-builder.js', 'inject.js', 'assets']) {
  fs.cpSync(path.join(root, 'vendor/better-blip-builder', name), path.join(dist, name), { recursive: true });
}
fs.mkdirSync(path.join(dist, 'licenses'), { recursive: true });
fs.copyFileSync(path.join(root, 'vendor/LICENSE.blip-addons'), path.join(dist, 'licenses/Blip-Addons.txt'));
fs.copyFileSync(path.join(root, 'THIRD_PARTY_NOTICES.md'), path.join(dist, 'licenses/THIRD_PARTY_NOTICES.md'));
// Stencil's popup components load their chunks and icons from this directory.
fs.cpSync(path.join(root, 'node_modules/blip-ds/dist/blip-ds'), path.join(dist, 'bds'), { recursive: true });
webpack(require('../webpack.config.js'), (error, stats) => {
  if (error) { console.error(error); process.exitCode = 1; return; }
  console.log(stats.toString({ colors: false, all: false, errors: true, warnings: true, timings: true }));
  if (stats.hasErrors()) process.exitCode = 1;
  else console.log('Blip Addons 2.0 gerado em dist/');
});
