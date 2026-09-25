import { readFile, writeFile } from 'node:fs/promises';
const origin = process.env.SITE_URL;
if (origin) {
  const url = new URL(origin);
  if (url.protocol !== 'https:') throw new Error('SITE_URL deve usar HTTPS.');
  const base = url.href.replace(/\/$/, '');
  let html = await readFile('dist/index.html', 'utf8');
  html = html.replace('</head>', `<link rel="canonical" href="${base}/"><meta property="og:url" content="${base}/"><meta property="og:image" content="${base}/public/images/logo.webp"></head>`);
  await writeFile('dist/index.html', html);
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${base}/</loc></url></urlset>`);
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
} else {
  console.info('SEO: defina SITE_URL com o domínio oficial para gerar canonical e sitemap.');
}
