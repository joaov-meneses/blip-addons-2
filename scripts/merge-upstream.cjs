const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const base = path.resolve(process.argv[2], 'src');
const incoming = path.resolve('vendor/blip-addons-1.3.9/src');
const current = path.resolve('src');
const output = path.resolve('analysis/upstream-merge');
fs.mkdirSync(output, { recursive: true });
const normalize = text => text.replace(/\r\n/g, '\n').trimEnd() + '\n';
const files = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
  entry.isDirectory() ? files(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
const report = [];
for (const file of files(incoming)) {
  const relative = path.relative(incoming, file);
  const originalPath = path.join(base, relative), target = path.join(current, relative);
  const next = normalize(fs.readFileSync(file, 'utf8'));
  const original = fs.existsSync(originalPath) ? normalize(fs.readFileSync(originalPath, 'utf8')) : null;
  if (next === original) continue;
  let merged = next, status = original === null ? 'added' : 'updated';
  if (original !== null && fs.existsSync(target)) {
    const ours = normalize(fs.readFileSync(target, 'utf8'));
    if (ours !== original) {
      for (const [name, content] of [['ours', ours], ['base', original], ['theirs', next]]) fs.writeFileSync(path.join(output, name), content);
      const result = spawnSync('git', ['merge-file', '-p', '-L', 'Blip Addons 2.0', '-L', 'base 1.0.2', '-L', 'Blip Addons 1.3.9',
        path.join(output, 'ours'), path.join(output, 'base'), path.join(output, 'theirs')], { encoding: 'utf8' });
      if (result.status < 0 || result.status > 127) throw new Error(result.stderr);
      merged = result.stdout;
      status = result.status ? 'conflict' : 'merged';
    }
  }
  report.push({ file: relative.replaceAll('\\', '/'), status });
  if (status === 'conflict') {
    const conflict = path.join(output, relative + '.conflict');
    fs.mkdirSync(path.dirname(conflict), { recursive: true }); fs.writeFileSync(conflict, merged);
  } else {
    fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, merged);
  }
}
fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ counts: report.reduce((counts, item) => ({ ...counts, [item.status]: (counts[item.status] || 0) + 1 }), {}),
  conflicts: report.filter(item => item.status === 'conflict').map(item => item.file) }, null, 2));
