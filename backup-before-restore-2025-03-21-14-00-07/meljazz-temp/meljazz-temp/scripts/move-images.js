const fs = require('fs');
const path = require('path');

// Function to ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Function to copy file
function copyFile(src, dest) {
  fs.copyFileSync(src, dest);
  console.log(`Copied ${src} to ${dest}`);
}

// Ensure all required directories exist
ensureDir('public/images/gallery');
ensureDir('public/images/about');
ensureDir('public/images/services');
ensureDir('public/images/backgrounds');

// Move files from assets/images
const assetFiles = [
  { src: 'assets/images/profile.jpg', dest: 'public/images/about/profile.jpg' },
  { src: 'assets/images/workshop-1.jpg', dest: 'public/images/services/workshop.jpg' },
  { src: 'assets/images/studio-1.jpg', dest: 'public/images/services/studio.jpg' },
  { src: 'assets/images/private-lessons.jpg', dest: 'public/images/services/private-lessons.jpg' },
  { src: 'assets/images/piano-1.jpg', dest: 'public/images/services/piano.jpg' },
  { src: 'assets/images/performance-1.jpg', dest: 'public/images/services/performance.jpg' },
  { src: 'assets/images/online-coaching.jpg', dest: 'public/images/services/online.jpg' },
];

// Move files from assets root
const rootAssetFiles = [
  { src: 'assets/photo_1_2025-02-23_22-12-02.jpg', dest: 'public/images/gallery/performance1.jpg' },
  { src: 'assets/photo_2_2025-02-23_22-12-02.jpg', dest: 'public/images/gallery/performance2.jpg' },
  { src: 'assets/photo_3_2025-02-23_22-12-02.jpg', dest: 'public/images/gallery/performance3.jpg' },
  { src: 'assets/photo_4_2025-02-23_22-12-02.jpg', dest: 'public/images/gallery/performance4.jpg' },
  { src: 'assets/photo_5_2025-02-23_22-12-02.jpg', dest: 'public/images/gallery/performance5.jpg' },
];

// Copy all files
[...assetFiles, ...rootAssetFiles].forEach(({ src, dest }) => {
  if (fs.existsSync(src)) {
    copyFile(src, dest);
  } else {
    console.log(`Warning: Source file ${src} does not exist`);
  }
}); 