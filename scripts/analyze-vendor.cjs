const fs = require('node:fs');
const esbuild = require(process.argv[2] || 'esbuild');
fs.mkdirSync('analysis', { recursive: true });
for (const file of ['blip-builder', 'inject', 'popup']) {
  fs.writeFileSync(`analysis/${file}.readable.js`, esbuild.transformSync(
    fs.readFileSync(`vendor/better-blip-builder/${file}.js`, 'utf8'),
    { minify: false }
  ).code);
}
