const fs = require('node:fs');
const path = require('node:path');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(item => item.isDirectory() ? walk(path.join(dir, item.name)) : [path.join(dir, item.name)]);
const keys = new Set();
for (const file of walk('src').filter(file => /\.tsx?$/.test(file))) {
  for (const match of fs.readFileSync(file, 'utf8').matchAll(/\bt\(\s*['"]([^'"]+)['"]/g)) {
    if (!match[1].endsWith('.')) keys.add(match[1]);
  }
}
const missing = [];
for (const lang of ['ptbr', 'en', 'es']) {
  const locale = JSON.parse(fs.readFileSync(`src/locales/${lang}/common.json`, 'utf8'));
  for (const key of keys) if (typeof key.split('.').reduce((value, part) => value?.[part], locale) !== 'string') missing.push({ lang, key });
}
console.log(JSON.stringify(missing, null, 2));
