const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const acorn = require('acorn');
const vm = require('node:vm');
const source = path.resolve(process.argv[2]);
const destination = path.resolve('vendor/blip-addons-1.3.9');
fs.mkdirSync(destination, { recursive: true });
const hashes = {};
const recovered = new Map();
for (const name of ['content.js', 'listener.js', 'popup.js']) {
  const file = path.join(source, 'js', name);
  const code = fs.readFileSync(file, 'utf8');
  hashes[`js/${name}`] = crypto.createHash('sha256').update(code).digest('hex');
  const match = code.match(/\/\/# sourceMappingURL=data:application\/json[^,]*;base64,([A-Za-z0-9+/=]+)\s*$/);
  if (!match) throw new Error(`Missing inline source map: ${name}`);
  const map = JSON.parse(Buffer.from(match[1], 'base64').toString('utf8'));
  for (let index = 0; index < map.sources.length; index++) {
    const match = map.sources[index].match(/(?:^|\/)src\/(.+)$/);
    if (!match || map.sources[index].includes('node_modules/') || map.sourcesContent[index] == null) continue;
    // Webpack adds query suffixes to generated loader wrappers; keep original sources.
    if (match[1].includes('?')) continue;
    const relative = `src/${match[1]}`;
    let content = map.sourcesContent[index];
    if (relative.endsWith('.css')) {
      const css = content.match(/\.push\(\[module\.id,\s*("(?:\\.|[^"\\])*")/);
      if (css) content = JSON.parse(css[1]);
    }
    if (relative.endsWith('.svg') && content.includes('createElement')) {
      const module = { exports: {} };
      const transformed = require('esbuild').transformSync(content, { format: 'cjs' }).code;
      vm.runInNewContext(transformed, { module, exports: module.exports, require(name) {
        if (name !== 'react') throw new Error('Unexpected SVG dependency');
        return require('react');
      } });
      content = require('react-dom/server').renderToStaticMarkup(require('react').createElement(module.exports.default)) + '\n';
    }
    if (recovered.has(relative) && recovered.get(relative) !== content) throw new Error(`Conflicting source: ${relative}`);
    recovered.set(relative, content);
    const target = path.resolve(destination, relative);
    if (!target.startsWith(destination + path.sep)) throw new Error(`Invalid source: ${relative}`);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
  const ast = acorn.parse(code, { ecmaVersion: 'latest' });
  const bundleBody = ast.body[0].expression.callee.body.body;
  const modules = bundleBody.find(node => node.type === 'VariableDeclaration' &&
    node.declarations.some(item => item.id.name === '__webpack_modules__'));
  for (const property of modules.declarations.find(item => item.id.name === '__webpack_modules__').init.properties) {
    const name = property.key.value;
    if (!name?.startsWith('./src/') || !name.endsWith('.json')) continue;
    const assignment = property.value.body.body.find(node => node.type === 'ExpressionStatement' && node.expression.type === 'AssignmentExpression');
    const value = assignment.expression.right;
    if (value.type !== 'CallExpression' || value.callee.object.name !== 'JSON' || value.callee.property.name !== 'parse') throw new Error(`Unexpected JSON module: ${name}`);
    const content = JSON.stringify(JSON.parse(value.arguments[0].value), null, 2) + '\n';
    const relative = name.slice(2);
    const target = path.resolve(destination, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
    recovered.set(relative, content);
  }
}
for (const file of ['manifest.json', 'popup.html']) fs.copyFileSync(path.join(source, file), path.join(destination, file));
fs.cpSync(path.join(source, 'icons'), path.join(destination, 'icons'), { recursive: true });
fs.writeFileSync(path.join(destination, 'provenance.json'), JSON.stringify({
  extensionId: 'gindjfmlebfgccocnjfeobedgeglpoeb', version: '1.3.9',
  method: 'sourcesContent from inline source maps in installed bundles',
  hashes, recoveredFiles: recovered.size,
}, null, 2) + '\n');
console.log(`Recovered ${recovered.size} sources into ${destination}`);
