import { cp, mkdir } from 'node:fs/promises';

// Keep identical relative paths in Live Server and the published static site.
await mkdir('dist', { recursive: true });
for (const path of ['index.html', 'src', 'public']) {
  await cp(path, `dist/${path}`, { recursive: true });
}
await cp('public/robots.txt', 'dist/robots.txt');
console.info('Site estático gerado em dist. Não requer Vite para executar.');
