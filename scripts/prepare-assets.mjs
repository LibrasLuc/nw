import sharp from 'sharp';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
await mkdir('public/images', { recursive: true });
const logoSource = 'assets/logo-transparente.png';
const logo = sharp(logoSource);
const { width, height } = await logo.metadata();
await logo.extract({ left: Math.round(width * .04), top: Math.round(height * .30), width: Math.round(width * .93), height: Math.round(height * .39) }).resize(780).webp({ quality: 92, alphaQuality: 100 }).toFile('public/images/logo.webp');
await sharp(logoSource).extract({ left: Math.round(width * .29), top: Math.round(height * .30), width: Math.round(width * .43), height: Math.round(height * .24) }).resize(600).webp({ quality: 92, alphaQuality: 100 }).toFile('public/images/monogram.webp');
const faviconBackground = { r: 43, g: 45, b: 44, alpha: 1 };
const faviconMark = await sharp('public/images/monogram.webp')
  .trim()
  .resize(330, 250, { fit: 'inside' })
  .png()
  .toBuffer();

for (const size of [32, 180, 512]) {
  const markWidth = Math.round(size * .64);
  const markHeight = Math.round(size * .49);
  const mark = await sharp(faviconMark)
    .resize(markWidth, markHeight, { fit: 'inside' })
    .png()
    .toBuffer();
  const metadata = await sharp(mark).metadata();
  const filename = size === 180 ? 'apple-touch-icon.png' : `favicon-${size}.png`;
  await sharp({ create: { width: size, height: size, channels: 4, background: faviconBackground } })
    .composite([{
      input: mark,
      left: Math.round((size - metadata.width) / 2),
      top: Math.round((size - metadata.height) / 2),
    }])
    .png()
    .toFile(`public/${filename}`);
}
await sharp('public/favicon-512.png').resize(64, 64).png().toFile('public/favicon.png');
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
