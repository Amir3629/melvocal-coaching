#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing development environment for Vocal Coaching website...');
console.log('DEBUG: Script is running');

// Define directories
const PUBLIC_DIR = path.join(__dirname, 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const GALLERY_DIR = path.join(IMAGES_DIR, 'gallery');
const BACKGROUNDS_DIR = path.join(IMAGES_DIR, 'backgrounds');
const SERVICES_DIR = path.join(IMAGES_DIR, 'services');
const PLACEHOLDERS_DIR = path.join(IMAGES_DIR, 'placeholders');
const AUDIO_DIR = path.join(PUBLIC_DIR, 'audio');

// Create directory if it doesn't exist
const createDirIfNotExists = (dir) => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 1. Ensure directories exist
console.log('\n📁 Creating directories if they don\'t exist...');
[
  PUBLIC_DIR, 
  IMAGES_DIR, 
  GALLERY_DIR, 
  BACKGROUNDS_DIR, 
  SERVICES_DIR, 
  PLACEHOLDERS_DIR,
  AUDIO_DIR
].forEach(createDirIfNotExists);

// 2. SVG placeholder generator
function createSvgPlaceholder(width, height, text, bgColor = '#121212', textColor = '#C8A97E') {
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <rect width="100%" height="100%" fill="#1A1A1A" opacity="0.8"/>
  <text 
    x="50%" 
    y="50%" 
    font-family="Arial" 
    font-size="24" 
    font-weight="bold"
    fill="${textColor}" 
    text-anchor="middle" 
    dominant-baseline="middle"
  >
    ${text}
  </text>
</svg>`;
}

// 3. Create PNG placeholder for cursor
function createPngPlaceholder(filePath, text = '♪') {
  // For PNG, let's just create an SVG as a workaround since we can't easily create PNGs
  const svgContent = createSvgPlaceholder(32, 32, text, '#000000', '#FFFFFF');
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created placeholder for PNG (as SVG): ${filePath}`);
}

// 4. Create MP3 placeholder
function createMp3Placeholder(filePath) {
  // Just create an empty file since we can't easily create actual MP3s
  fs.writeFileSync(filePath, 'Audio Placeholder');
  console.log(`Created placeholder for MP3: ${filePath}`);
}

// 5. Create WebP placeholder
function createWebpPlaceholder(filePath, width, height, text) {
  const svgContent = createSvgPlaceholder(width, height, text, '#000000', '#FFFFFF');
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created placeholder for WebP (as SVG): ${filePath}`);
}

// 6. Create placeholder images
console.log('\n🖼️ Creating placeholder SVGs...');
const placeholderImages = [
  { file: 'background.svg', width: 1200, height: 800, text: 'Background Image Placeholder' },
  { file: 'gallery.svg', width: 800, height: 800, text: 'Gallery Image Placeholder' },
  { file: 'avatar.svg', width: 400, height: 400, text: 'Avatar Placeholder' },
  { file: 'hero.svg', width: 1600, height: 900, text: 'Hero Image Placeholder' },
];

placeholderImages.forEach(({ file, width, height, text }) => {
  const filePath = path.join(PLACEHOLDERS_DIR, file);
  if (!fs.existsSync(filePath)) {
    const svgContent = createSvgPlaceholder(width, height, text);
    fs.writeFileSync(filePath, svgContent);
    console.log(`Created ${filePath}`);
  }
});

// 7. Create gallery images - note that we need to create these in both /images/gallery and /vocal-coaching/images/gallery paths
console.log('\n🖼️ Creating gallery JPG placeholders...');
const galleryImages = [
  { file: 'performance1.jpg', width: 800, height: 800, text: 'Gallery Image 1' },
  { file: 'performance2.jpg', width: 800, height: 800, text: 'Gallery Image 2' },
  { file: 'performance3.jpg', width: 800, height: 800, text: 'Gallery Image 3' },
  { file: 'performance4.jpg', width: 800, height: 800, text: 'Gallery Image 4' },
  { file: 'performance5.jpg', width: 800, height: 800, text: 'Gallery Image 5' },
  { file: 'performance6.jpg', width: 800, height: 800, text: 'Gallery Image 6' },
  { file: 'performance7.jpg', width: 800, height: 800, text: 'Gallery Image 7' },
  { file: 'performance8.jpg', width: 800, height: 800, text: 'Gallery Image 8' },
  { file: 'performance9.jpg', width: 800, height: 800, text: 'Gallery Image 9' },
];

// Create gallery images in both regular path and vocal-coaching path
galleryImages.forEach(({ file, width, height, text }) => {
  // Regular path
  const filePath = path.join(GALLERY_DIR, file);
  if (!fs.existsSync(filePath)) {
    const svgContent = createSvgPlaceholder(width, height, text);
    fs.writeFileSync(filePath, svgContent);
    console.log(`Created ${filePath}`);
  }
  
  // Also create in vocal-coaching path for local development compatibility
  const vocalCoachingPath = path.join(PUBLIC_DIR, 'vocal-coaching', 'images', 'gallery');
  createDirIfNotExists(vocalCoachingPath);
  const vocalCoachingFilePath = path.join(vocalCoachingPath, file);
  if (!fs.existsSync(vocalCoachingFilePath)) {
    const svgContent = createSvgPlaceholder(width, height, text);
    fs.writeFileSync(vocalCoachingFilePath, svgContent);
    console.log(`Created ${vocalCoachingFilePath}`);
  }
});

// 8. Create background images - also in both paths
console.log('\n🖼️ Creating background JPG placeholders...');
const backgroundImages = [
  { file: 'hero-bg.jpg', width: 1920, height: 1080, text: 'Hero Background' },
  { file: 'services-bg.jpg', width: 1920, height: 1080, text: 'Services Background' },
];

// Create background images in both paths
backgroundImages.forEach(({ file, width, height, text }) => {
  // Regular path
  const filePath = path.join(BACKGROUNDS_DIR, file);
  if (!fs.existsSync(filePath)) {
    const svgContent = createSvgPlaceholder(width, height, text, '#0A0A0A', '#8A7A5E');
    fs.writeFileSync(filePath, svgContent);
    console.log(`Created ${filePath}`);
  }
  
  // Also create in vocal-coaching path
  const vocalCoachingPath = path.join(PUBLIC_DIR, 'vocal-coaching', 'images', 'backgrounds');
  createDirIfNotExists(vocalCoachingPath);
  const vocalCoachingFilePath = path.join(vocalCoachingPath, file);
  if (!fs.existsSync(vocalCoachingFilePath)) {
    const svgContent = createSvgPlaceholder(width, height, text, '#0A0A0A', '#8A7A5E');
    fs.writeFileSync(vocalCoachingFilePath, svgContent);
    console.log(`Created ${vocalCoachingFilePath}`);
  }
});

// 9. Create service images - also in both paths
console.log('\n🖼️ Creating service JPG placeholders...');
const serviceImages = [
  { file: 'singing.jpg', width: 600, height: 400, text: 'Singing Service' },
  { file: 'coaching.jpg', width: 600, height: 400, text: 'Coaching Service' },
  { file: 'workshop.jpg', width: 600, height: 400, text: 'Workshop Service' },
  { file: 'chor.jpg', width: 600, height: 400, text: 'Choir Service' },
];

// Create service images in both paths
serviceImages.forEach(({ file, width, height, text }) => {
  // Regular path
  const filePath = path.join(SERVICES_DIR, file);
  if (!fs.existsSync(filePath)) {
    const svgContent = createSvgPlaceholder(width, height, text, '#1A1A1A', '#C8A97E');
    fs.writeFileSync(filePath, svgContent);
    console.log(`Created ${filePath}`);
  }
  
  // Also create in vocal-coaching path
  const vocalCoachingPath = path.join(PUBLIC_DIR, 'vocal-coaching', 'images', 'services');
  createDirIfNotExists(vocalCoachingPath);
  const vocalCoachingFilePath = path.join(vocalCoachingPath, file);
  if (!fs.existsSync(vocalCoachingFilePath)) {
    const svgContent = createSvgPlaceholder(width, height, text, '#1A1A1A', '#C8A97E');
    fs.writeFileSync(vocalCoachingFilePath, svgContent);
    console.log(`Created ${vocalCoachingFilePath}`);
  }
});

// 10. Create other important assets - also in both paths
console.log('\n🖼️ Creating other necessary assets...');

// Preview poster in regular path
const previewPath = path.join(IMAGES_DIR, 'preview-poster.webp');
if (!fs.existsSync(previewPath)) {
  createWebpPlaceholder(previewPath, 1280, 720, 'Video Preview');
}

// Music cursor in both paths
const cursorPath = path.join(IMAGES_DIR, 'music-cursor.png');
if (!fs.existsSync(cursorPath)) {
  createPngPlaceholder(cursorPath, '♪');
}

// Music cursor in vocal-coaching path
const vocalCoachingImagesPath = path.join(PUBLIC_DIR, 'vocal-coaching', 'images');
createDirIfNotExists(vocalCoachingImagesPath);
const cursorVocalCoachingPath = path.join(vocalCoachingImagesPath, 'music-cursor.png');
if (!fs.existsSync(cursorVocalCoachingPath)) {
  createPngPlaceholder(cursorVocalCoachingPath, '♪');
}

// Create placeholders directory in vocal-coaching path
const vocalCoachingPlaceholdersPath = path.join(vocalCoachingImagesPath, 'placeholders');
createDirIfNotExists(vocalCoachingPlaceholdersPath);

// Copy placeholders to vocal-coaching path
placeholderImages.forEach(({ file, width, height, text }) => {
  const vocalCoachingFilePath = path.join(vocalCoachingPlaceholdersPath, file);
  if (!fs.existsSync(vocalCoachingFilePath)) {
    const svgContent = createSvgPlaceholder(width, height, text);
    fs.writeFileSync(vocalCoachingFilePath, svgContent);
    console.log(`Created ${vocalCoachingFilePath}`);
  }
});

// Fix avatar placeholder with wrong extension
const wrongAvatarPath = path.join(PLACEHOLDERS_DIR, 'avatar.svgg');
const correctAvatarPath = path.join(PLACEHOLDERS_DIR, 'avatar.svg');
if (fs.existsSync(wrongAvatarPath)) {
  console.log(`Fixing incorrect avatar placeholder extension ${wrongAvatarPath} -> ${correctAvatarPath}`);
  fs.renameSync(wrongAvatarPath, correctAvatarPath);
} else if (!fs.existsSync(correctAvatarPath)) {
  console.log(`Creating new avatar placeholder at ${correctAvatarPath}`);
  const svgContent = createSvgPlaceholder(400, 400, 'Avatar Placeholder');
  fs.writeFileSync(correctAvatarPath, svgContent);
}

// Also check in vocal-coaching path
const wrongVocalCoachingAvatarPath = path.join(vocalCoachingPlaceholdersPath, 'avatar.svgg');
const correctVocalCoachingAvatarPath = path.join(vocalCoachingPlaceholdersPath, 'avatar.svg');
if (fs.existsSync(wrongVocalCoachingAvatarPath)) {
  console.log(`Fixing incorrect avatar placeholder extension ${wrongVocalCoachingAvatarPath} -> ${correctVocalCoachingAvatarPath}`);
  fs.renameSync(wrongVocalCoachingAvatarPath, correctVocalCoachingAvatarPath);
} else if (!fs.existsSync(correctVocalCoachingAvatarPath)) {
  console.log(`Creating new avatar placeholder at ${correctVocalCoachingAvatarPath}`);
  const svgContent = createSvgPlaceholder(400, 400, 'Avatar Placeholder');
  fs.writeFileSync(correctVocalCoachingAvatarPath, svgContent);
}

// 11. Audio samples
const audioSamples = [
  'music-sample-1.mp3',
  'music-sample-2.mp3',
  'music-sample-3.mp3',
];

// Create audio directory in vocal-coaching path
const vocalCoachingAudioPath = path.join(PUBLIC_DIR, 'vocal-coaching', 'audio');
createDirIfNotExists(vocalCoachingAudioPath);

// Create audio samples in both paths
audioSamples.forEach(file => {
  // Regular path
  const filePath = path.join(AUDIO_DIR, file);
  if (!fs.existsSync(filePath)) {
    createMp3Placeholder(filePath);
  }
  
  // Also create in vocal-coaching path
  const vocalCoachingFilePath = path.join(vocalCoachingAudioPath, file);
  if (!fs.existsSync(vocalCoachingFilePath)) {
    createMp3Placeholder(vocalCoachingFilePath);
  }
  
  // Also create in audio/audio path as seen in error logs
  const doubleAudioPath = path.join(PUBLIC_DIR, 'audio', 'audio');
  createDirIfNotExists(doubleAudioPath);
  const doubleAudioFilePath = path.join(doubleAudioPath, file);
  if (!fs.existsSync(doubleAudioFilePath)) {
    createMp3Placeholder(doubleAudioFilePath);
  }
});

// 12. Check for all required dependencies
console.log('\n📦 Checking for required dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  
  const requiredDependencies = [
    '@headlessui/react',
    'framer-motion',
    'lucide-react',
    'next',
    'react',
    'react-dom',
    'i18next',
    'react-i18next',
    'tailwindcss',
  ];
  
  const missingDependencies = [];
  requiredDependencies.forEach(dep => {
    if (!packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]) {
      missingDependencies.push(dep);
    }
  });
  
  if (missingDependencies.length > 0) {
    console.log(`Missing dependencies: ${missingDependencies.join(', ')}`);
    console.log('Installing missing dependencies...');
    execSync(`npm install ${missingDependencies.join(' ')}`, { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully.');
  } else {
    console.log('✅ All required dependencies are installed.');
  }
} catch (error) {
  console.error('Error checking dependencies:', error);
}

// 13. Create or update .env.local
console.log('\n🔧 Setting up environment variables...');
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  const envContent = `
# Base URL for development
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_ENV=development
  `.trim();
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local with default configuration.');
} else {
  console.log('✅ .env.local already exists.');
}

console.log('\n✅ Development environment setup complete!');
console.log('\n🚀 You can now run:');
console.log('  npm run dev');
console.log('  and open http://localhost:3003 in your browser to see the website.\n'); 