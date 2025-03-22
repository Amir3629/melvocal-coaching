const fs = require('fs');
const path = require('path');

const requiredDirectories = [
  'public/images/backgrounds',
  'public/images/services',
  'public/images/gallery',
  'public/images/collaborations',
  'public/images/testimonials'
];

const requiredImages = {
  'backgrounds/hero-bg.jpg': 'Hero background',
  'backgrounds/contact-bg.jpg': 'Contact background',
  'services/private-lessons.jpg': 'Private lessons service',
  'services/performance.jpg': 'Performance service',
  'services/workshop.jpg': 'Workshop service',
  'services/piano.jpg': 'Piano service',
  'collaborations/bflat.svg': 'B-Flat logo',
  'collaborations/cvi.svg': 'CVI logo',
  'collaborations/jib.svg': 'JIB logo',
  'collaborations/philharmonie.svg': 'Philharmonie logo',
  'testimonials/david.svg': 'David testimonial',
  'testimonials/james.svg': 'James testimonial',
  'testimonials/anna.svg': 'Anna testimonial',
  'testimonials/sarah.svg': 'Sarah testimonial'
};

// Create placeholder images
function createPlaceholderImage(filePath, label) {
  const ext = path.extname(filePath).toLowerCase();
  const dir = path.dirname(filePath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (ext === '.svg') {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#2A2A2A"/>
  <text x="100" y="100" font-family="Arial" font-size="16" fill="white" text-anchor="middle">${label}</text>
</svg>`;
    fs.writeFileSync(filePath, svg);
  } else {
    // Create a simple colored rectangle for JPG/PNG
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#2A2A2A"/>
  <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">${label}</text>
</svg>`;
    fs.writeFileSync(filePath.replace(/\.(jpg|png)$/, '.svg'), svg);
  }
}

// Create directories
requiredDirectories.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Check and create missing images
Object.entries(requiredImages).forEach(([imagePath, label]) => {
  const fullPath = path.join(process.cwd(), 'public/images', imagePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`Creating placeholder for: ${imagePath}`);
    createPlaceholderImage(fullPath, label);
  } else {
    console.log(`Found: ${imagePath}`);
  }
});

console.log('\nImage verification complete!'); 