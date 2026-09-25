import sharp from 'sharp';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
await mkdir('public/images', { recursive: true });
const logoSource = 'assets/logo-transparente.png';
const logo = sharp(logoSource);
const { width, height } = await logo.metadata();
await logo.extract({ left: Math.round(width * .04), top: Math.round(height * .30), width: Math.round(width * .93), height: Math.round(height * .39) }).resize(780).webp({ quality: 92, alphaQuality: 100 }).toFile('public/images/logo.webp');
await sharp(logoSource).extract({ left: Math.round(width * .29), top: Math.round(height * .30), width: Math.round(width * .43), height: Math.round(height * .24) }).resize(600).webp({ quality: 92, alphaQuality: 100 }).toFile('public/images/monogram.webp');
await sharp('public/images/monogram.webp').trim().resize(64,64,{fit:'contain'}).png().toFile('public/favicon.png');
// Original portraits can be supplied later without changing the layout.
const files = await readdir('assets');
const portraits = {};
for (const name of ['retrato-hero', 'retrato-sobre']) {
  const original = files.find(file => file.replace(/\.[^.]+$/, '') === name && /\.(png|jpe?g|webp)$/i.test(file));
  if (original) {
    await sharp(`assets/${original}`).trim().resize({ height: 1500, withoutEnlargement: true }).webp({ quality: 88 }).toFile(`public/images/${name}.webp`);
    portraits[name.replace('retrato-', '')] = `${name}.webp`;
  }
}
await writeFile('public/images/portraits.json', JSON.stringify(portraits));
