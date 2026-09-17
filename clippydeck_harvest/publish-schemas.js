const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = path.join(__dirname, 'schemas');
const destination = path.join(root, 'website', 'static', 'schemas');

fs.mkdirSync(destination, {recursive: true});
for (const name of fs.readdirSync(source).filter((file) => file.endsWith('.schema.json'))) {
  fs.copyFileSync(path.join(source, name), path.join(destination, name));
  process.stdout.write(`published ${name}\n`);
}
