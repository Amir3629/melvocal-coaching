const fs = require('fs');
const path = require('path');
const https = require('https');

const requiredImages = {
  'backgrounds/hero-bg.jpg': 'Hero background',
  'backgrounds/services-bg.jpg': 'Services background',
  'backgrounds/contact-bg.jpg': 'Contact background',
  'services/private-lessons.jpg': 'Private lessons service',
  'services/jazz.jpg': 'Jazz service',
  'services/performance.jpg': 'Performance service',
  'services/piano.jpg': 'Piano service',
  'collaborations/bflat.svg': 'B-Flat logo',
  'collaborations/cvi.svg': 'CVI logo',
  'collaborations/jib.svg': 'JIB logo',
  'collaborations/philharmonie.svg': 'Philharmonie logo',
  'public/favicon.ico': 'Favicon'
};

const imagePaths = [
  // Gallery images
  '/vocal-coaching/images/gallery/performance1.jpg',
  '/vocal-coaching/images/gallery/performance2.jpg',
  '/vocal-coaching/images/gallery/performance3.jpg',
  '/vocal-coaching/images/gallery/performance4.jpg',
  '/vocal-coaching/images/gallery/performance5.jpg',
  '/vocal-coaching/images/gallery/performance6.jpg',
  '/vocal-coaching/images/gallery/performance7.jpg',
  '/vocal-coaching/images/gallery/performance8.jpg',
  '/vocal-coaching/images/gallery/performance9.jpg',
  
  // Collaboration logos
  '/vocal-coaching/images/collaborations/bflat.svg',
  '/vocal-coaching/images/collaborations/cvi.svg',
  '/vocal-coaching/images/collaborations/jib.svg',
  '/vocal-coaching/images/collaborations/philharmonie.svg',
  
  // Service images
  '/vocal-coaching/images/services/private-lessons.jpg',
  '/vocal-coaching/images/services/performance.jpg',
  '/vocal-coaching/images/services/workshop.jpg',
  '/vocal-coaching/images/services/piano.jpg'
];

const baseUrl = 'https://amir3629.github.io';

// Create directories if they don't exist
function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
}

// Create a placeholder image
function createPlaceholderImage(filePath, label) {
  const ext = path.extname(filePath).toLowerCase();
  
  if (ext === '.svg') {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#2A2A2A"/>
  <text x="100" y="100" font-family="Arial" font-size="16" fill="white" text-anchor="middle">${label}</text>
</svg>`;
    fs.writeFileSync(filePath, svg);
  } else {
    // Create a simple colored rectangle for JPG
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#2A2A2A"/>
  <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">${label}</text>
</svg>`;
    fs.writeFileSync(filePath.replace(/\.jpg$/, '.svg'), svg);
  }
}

// Verify all required images
Object.entries(requiredImages).forEach(([imagePath, label]) => {
  const fullPath = path.join(process.cwd(), 'public/images', imagePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`Missing: ${imagePath}`);
    ensureDirectoryExists(fullPath);
    createPlaceholderImage(fullPath, label);
  } else {
    console.log(`Found: ${imagePath}`);
  }
});

async function checkImage(path) {
  return new Promise((resolve) => {
    const url = baseUrl + path;
    https.get(url, (res) => {
      console.log(`${path}: ${res.statusCode === 200 ? '✅ OK' : '❌ Failed'} (${res.statusCode})`);
      resolve(res.statusCode === 200);
    }).on('error', (err) => {
      console.log(`${path}: ❌ Error - ${err.message}`);
      resolve(false);
    });
  });
}

async function checkAllImages() {
  console.log('Checking image accessibility on GitHub Pages...\n');
  
  const results = await Promise.all(imagePaths.map(checkImage));
  
  const successful = results.filter(Boolean).length;
  const total = imagePaths.length;
  
  console.log(`\nSummary:`);
  console.log(`✅ ${successful} images accessible`);
  console.log(`❌ ${total - successful} images not accessible`);
  console.log(`Total: ${total} images checked`);
}

checkAllImages(); 