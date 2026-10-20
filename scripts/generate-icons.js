import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { join } from 'path';

const iconsDir = join(import.meta.dirname, '..', 'public', 'icons');
mkdirSync(iconsDir, { recursive: true });

async function createIcon(text, bgColor, filename) {
  // Create simple SVG with text
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor[0]}"/>
          <stop offset="100%" style="stop-color:${bgColor[1]}"/>
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="110" fill="url(#bg)"/>
      <text x="256" y="300" font-family="Arial, sans-serif" font-size="160" font-weight="bold" 
            fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>
  `;

  // Convert SVG to PNG at different sizes
  const sizes = [192, 512];
  
  for (const size of sizes) {
    const output = join(iconsDir, `${filename}-${size}.png`);
    await sharp(Buffer.from(svg))
      .resize(size, size, { fit: 'contain' })
      .png()
      .toFile(output);
    console.log(`✓ Created ${output}`);
  }
}

async function main() {
  console.log('🎨 Generating icons...\n');

  // Admin app - Purple
  await createIcon('🛡️', ['#5B21B6', '#7C3AED'], 'admin');
  
  // Merchant app - Green
  await createIcon('🏪', ['#059669', '#10B981'], 'merchant');
  
  // Client app - Orange
  await createIcon('🛍️', ['#D97706', '#F59E0B'], 'client');

  console.log('\n✅ Icons generated successfully!');
}

main().catch(console.error);
