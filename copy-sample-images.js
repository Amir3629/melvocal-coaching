const fs = require('fs');
const path = require('path');

// Define directories
const PLACEHOLDER_DIR = path.join(__dirname, 'public', 'images', 'placeholders');
const GALLERY_DIR = path.join(__dirname, 'public', 'images', 'gallery');
const BACKGROUNDS_DIR = path.join(__dirname, 'public', 'images', 'backgrounds');
const SERVICES_DIR = path.join(__dirname, 'public', 'images', 'services');

// Ensure directories exist
[GALLERY_DIR, BACKGROUNDS_DIR, SERVICES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Function to create an SVG placeholder image
function createSvgPlaceholder(width, height, text, bgColor = '#121212', textColor = '#C8A97E') {
  return `
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
</svg>
`.trim();
}

// Paths needed for gallery
const galleryPaths = [
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

// Paths needed for backgrounds
const backgroundPaths = [
  { file: 'hero-bg.jpg', width: 1920, height: 1080, text: 'Hero Background' },
  { file: 'services-bg.jpg', width: 1920, height: 1080, text: 'Services Background' },
];

// Paths needed for services
const servicePaths = [
  { file: 'singing.jpg', width: 600, height: 400, text: 'Singing Service' },
  { file: 'coaching.jpg', width: 600, height: 400, text: 'Coaching Service' },
  { file: 'workshop.jpg', width: 600, height: 400, text: 'Workshop Service' },
  { file: 'chor.jpg', width: 600, height: 400, text: 'Choir Service' },
];

// Create SVG placeholders and save them as JPG
console.log('Creating gallery images...');
galleryPaths.forEach(({ file, width, height, text }) => {
  const filePath = path.join(GALLERY_DIR, file);
  
  if (!fs.existsSync(filePath)) {
    const svgContent = createSvgPlaceholder(width, height, text);
    fs.writeFileSync(filePath, svgContent);
    console.log(`Created ${filePath}`);
  }
});

console.log('Creating background images...');
backgroundPaths.forEach(({ file, width, height, text }) => {
  const filePath = path.join(BACKGROUNDS_DIR, file);
  
  if (!fs.existsSync(filePath)) {
    const svgContent = createSvgPlaceholder(width, height, text, '#0A0A0A', '#8A7A5E');
    fs.writeFileSync(filePath, svgContent);
    console.log(`Created ${filePath}`);
  }
});

console.log('Creating service images...');
servicePaths.forEach(({ file, width, height, text }) => {
  const filePath = path.join(SERVICES_DIR, file);
  
  if (!fs.existsSync(filePath)) {
    const svgContent = createSvgPlaceholder(width, height, text, '#1A1A1A', '#C8A97E');
    fs.writeFileSync(filePath, svgContent);
    console.log(`Created ${filePath}`);
  }
});

// Create preview poster for video
const previewPath = path.join(__dirname, 'public', 'images', 'preview-poster.webp');
if (!fs.existsSync(previewPath)) {
  const svgContent = createSvgPlaceholder(1280, 720, 'Video Preview', '#000000', '#FFFFFF');
  fs.writeFileSync(previewPath, svgContent);
  console.log(`Created ${previewPath}`);
}

// Create music cursor image
const cursorDir = path.join(__dirname, 'public', 'images');
const cursorPath = path.join(cursorDir, 'music-cursor.png');
if (!fs.existsSync(cursorPath)) {
  const svgContent = createSvgPlaceholder(32, 32, '♪', '#000000', '#FFFFFF');
  fs.writeFileSync(cursorPath, svgContent);
  console.log(`Created ${cursorPath}`);
}

// Create audio placeholder
const audioDir = path.join(__dirname, 'public', 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const audioPath = path.join(audioDir, 'music-sample-1.mp3');
if (!fs.existsSync(audioPath)) {
  fs.writeFileSync(audioPath, 'Audio Placeholder');
  console.log(`Created ${audioPath}`);
}

console.log('✅ All placeholder images have been created successfully.');
console.log('🚀 You can now run the development server to see the website with placeholder images.'); 