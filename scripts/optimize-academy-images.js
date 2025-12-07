#!/usr/bin/env node
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, '..', 'public', 'academy');

const optimizations = [
  {
    input: 'academy-cathedral-ceiling.png',
    output: 'academy-cathedral-hero.jpg',
    width: 1920,
    height: 1080,
    quality: 78
  },
  {
    input: 'academy-study-desk.png',
    output: 'academy-study-desk.jpg',
    width: 1600,
    height: 1000,
    quality: 78
  },
  {
    input: 'academy-staircase-ladder.png',
    output: 'academy-ladder.jpg',
    width: 1600,
    height: 1600,
    quality: 80
  },
  {
    input: 'academy-grand-hall.png',
    output: 'academy-grand-hall.jpg',
    width: 1920,
    height: 1080,
    quality: 78
  }
];

async function optimizeImages() {
  console.log('🖼️  Optimizing Academy images...\n');

  for (const config of optimizations) {
    const inputPath = path.join(publicDir, config.input);
    const outputPath = path.join(publicDir, config.output);

    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Skipping ${config.input} - file not found`);
      continue;
    }

    try {
      const info = await sharp(inputPath)
        .resize(config.width, config.height, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: config.quality, progressive: true })
        .toFile(outputPath);

      const inputSize = fs.statSync(inputPath).size;
      const outputSize = info.size;
      const savings = ((inputSize - outputSize) / inputSize * 100).toFixed(1);

      console.log(`✅ ${config.output}`);
      console.log(`   ${(inputSize / 1024 / 1024).toFixed(2)}MB → ${(outputSize / 1024 / 1024).toFixed(2)}MB (${savings}% smaller)`);
      console.log(`   ${info.width}×${info.height}\n`);
    } catch (error) {
      console.error(`❌ Error processing ${config.input}:`, error.message);
    }
  }

  console.log('🎉 Optimization complete!');
}

optimizeImages().catch(console.error);
