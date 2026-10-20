import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const originalIcon = join(__dirname, '..', 'uploads', 'ChatGPT Image 19 أكتوبر 2026، 08_53_37 م.png');
const outputDir = join(__dirname, '..', 'public', 'assets', 'originals');

mkdirSync(outputDir, { recursive: true });

// Border colors for each app
const borderColors = {
  admin: { r: 91, g: 33, b: 182 }, // #5B21B6 purple
  merchant: { r: 5, g: 150, b: 105 }, // #059669 green (same as original)
  client: { r: 5, g: 150, b: 105 }, // #059669 green (same as original)
};

async function addColoredBorder(inputPath, outputPath, borderColor, borderWidth = 20) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  
  // Create a border overlay
  const border = Buffer.from(
    `<svg width="${metadata.width}" height="${metadata.height}">
      <rect width="100%" height="100%" fill="none" stroke="rgb(${borderColor.r},${borderColor.g},${borderColor.b})" stroke-width="${borderWidth}" rx="20%"/>
    </svg>`
  );

  await image
    .composite([{ input: border, top: 0, left: 0 }])
    .png()
    .toFile(outputPath);
}

async function main() {
  console.log('🎨 Processing icons with original colors...\n');

  for (const [app, color] of Object.entries(borderColors)) {
    const outputPath = join(outputDir, `${app}-icon-512.png`);
    console.log(`📱 Creating ${app} icon with border color: rgb(${color.r},${color.g},${color.b})`);
    await addColoredBorder(originalIcon, outputPath, color);
    console.log(`✓ Created ${outputPath}\n`);
  }

  console.log('✅ All icons processed successfully!');
}

main().catch(console.error);
