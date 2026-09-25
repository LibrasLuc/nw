import sharp from 'sharp';

const input = 'assets/logo.png';
const output = 'assets/logo-transparente.png';
const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

for (let index = 0; index < data.length; index += 4) {
  const red = data[index];
  const green = data[index + 1];
  const blue = data[index + 2];
  const brightness = Math.max(red, green, blue);
  const warmth = Math.max(0, red - blue);
  const signal = brightness + warmth * .7;
  const alpha = Math.max(0, Math.min(255, Math.round((signal - 62) * 4.8)));
  data[index + 3] = alpha;
}

await sharp(data, { raw: info }).png({ compressionLevel: 9 }).toFile(output);
