import { execSync } from 'child_process';
import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const demoDir = path.join(root, 'demo');
const outputFile = path.join(root, '..', 'Пульс клиента — демо.html');

console.log('Сборка TypeScript...');
execSync('npx tsc -b', { cwd: root, stdio: 'inherit', shell: true });

console.log('Сборка Vite (один бандл)...');
execSync('npx vite build', {
  cwd: root,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, STANDALONE: '1' },
});

const htmlPath = path.join(demoDir, 'index.html');
if (!fs.existsSync(htmlPath)) {
  console.error('Не найден demo/index.html');
  process.exit(1);
}

let html = fs.readFileSync(htmlPath, 'utf8');

const cssMatch = html.match(/href="(\.\/assets\/[^"]+\.css)"/);
const jsMatch = html.match(/src="(\.\/assets\/[^"]+\.js)"/);

if (!cssMatch || !jsMatch) {
  console.error('Не удалось найти CSS/JS в index.html');
  process.exit(1);
}

const cssPath = path.join(demoDir, cssMatch[1].replace(/^\.\//, ''));
const jsPath = path.join(demoDir, jsMatch[1].replace(/^\.\//, ''));
const css = fs.readFileSync(cssPath, 'utf8');

console.log('Конвертация в формат для открытия без сервера...');
const iifeResult = await esbuild.build({
  entryPoints: [jsPath],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  write: false,
  minify: true,
  legalComments: 'none',
});

const js = iifeResult.outputFiles[0].text;

const routesSource = fs.readFileSync(path.join(root, 'src/config/routes.ts'), 'utf8');
const defaultPinMatch = routesSource.match(/DEFAULT_CLIENT_PIN = '([^']+)'/);
const defaultPin = defaultPinMatch?.[1] ?? 'UCE8O9';
const defaultHash = defaultPin ? `#/client/${defaultPin}` : '#/clients';

html = `<!DOCTYPE html>
<!-- Пульс клиента — автономная демо-версия для заказчика.
     Откройте этот файл двойным кликом в Google Chrome или Microsoft Edge.
     Выберите клиента в списке слева. -->
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Пульс клиента — SFA (демо)</title>
  <style>${css}</style>
</head>
<body>
  <div id="root"></div>
  <script>if(!location.hash||location.hash==='#/'||location.hash==='#')location.hash='${defaultHash}';</script>
  <script>${js}</script>
</body>
</html>
`;

fs.writeFileSync(outputFile, html, 'utf8');

const sizeKb = Math.round(fs.statSync(outputFile).size / 1024);
console.log('');
console.log('Готово:', outputFile);
console.log(`Размер: ${sizeKb} КБ — один файл, сервер не нужен.`);
