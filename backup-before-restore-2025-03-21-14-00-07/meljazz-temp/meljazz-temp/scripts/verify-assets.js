const fs = require('fs');
const path = require('path');

const requiredAssets = {
  'images/preview-poster.webp': 'Video preview poster',
  'videos/preview.mp4': 'Preview video',
  'images/musical-ai-bg.jpg': 'Musical background',
  'favicon.ico': 'Favicon'
};

function createPlaceholderAsset(filePath, label) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const ext = path.extname(filePath).toLowerCase();
  
  if (ext === '.webp' || ext === '.jpg') {
    // Create a simple SVG as placeholder
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#2A2A2A"/>
  <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">${label}</text>
</svg>`;
    fs.writeFileSync(filePath.replace(/\.(webp|jpg)$/, '.svg'), svg);
  } else if (ext === '.mp4') {
    // Create an empty video file
    fs.writeFileSync(filePath, Buffer.from([]))
  } else if (ext === '.ico') {
    // Create a simple favicon
    fs.writeFileSync(filePath, Buffer.from([0,0,1,0,1,0,16,16,0,0,1,0,24,0,24,24,0,0]));
  }
}

// Check and create missing assets
Object.entries(requiredAssets).forEach(([assetPath, label]) => {
  const fullPath = path.join(process.cwd(), 'public', assetPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`Creating placeholder for: ${assetPath}`);
    createPlaceholderAsset(fullPath, label);
  } else {
    console.log(`Found: ${assetPath}`);
  }
});

console.log('\nAsset verification complete!'); 