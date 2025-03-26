const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the directory paths
const PUBLIC_DIR = path.join(__dirname, 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const GALLERY_DIR = path.join(IMAGES_DIR, 'gallery');
const BACKGROUNDS_DIR = path.join(IMAGES_DIR, 'backgrounds');
const SERVICES_DIR = path.join(IMAGES_DIR, 'services');
const PLACEHOLDERS_DIR = path.join(IMAGES_DIR, 'placeholders');
const AUDIO_DIR = path.join(PUBLIC_DIR, 'audio');

// Create directories if they don't exist
function createDirectories() {
  console.log('📁 Creating directories if they don\'t exist...');
  
  [PUBLIC_DIR, IMAGES_DIR, GALLERY_DIR, BACKGROUNDS_DIR, SERVICES_DIR, PLACEHOLDERS_DIR, AUDIO_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`Creating ${dir}...`);
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Copy SVG placeholders to image locations
function copySvgPlaceholders() {
  if (!fs.existsSync(PLACEHOLDERS_DIR)) {
    console.log('Placeholders directory does not exist. Running placeholder.js first...');
    try {
      execSync('node placeholder.js', { stdio: 'inherit' });
    } catch (error) {
      console.error('Error running placeholder.js:', error.message);
      return;
    }
  }
  
  const placeholderMappings = [
    // Gallery images
    { 
      src: path.join(PLACEHOLDERS_DIR, 'gallery.svg'),
      destinations: Array.from({ length: 9 }, (_, i) => path.join(GALLERY_DIR, `performance${i+1}.jpg`))
    },
    // Background images
    { 
      src: path.join(PLACEHOLDERS_DIR, 'background.svg'),
      destinations: [
        path.join(BACKGROUNDS_DIR, 'hero-bg.jpg'),
        path.join(BACKGROUNDS_DIR, 'services-bg.jpg')
      ]
    },
    // Service images
    {
      src: path.join(PLACEHOLDERS_DIR, 'avatar.svg'),
      destinations: [
        path.join(SERVICES_DIR, 'singing.jpg'),
        path.join(SERVICES_DIR, 'coaching.jpg'),
        path.join(SERVICES_DIR, 'workshop.jpg'),
        path.join(SERVICES_DIR, 'chor.jpg')
      ]
    }
  ];
  
  placeholderMappings.forEach(mapping => {
    if (fs.existsSync(mapping.src)) {
      const content = fs.readFileSync(mapping.src);
      
      mapping.destinations.forEach(dest => {
        const destDir = path.dirname(dest);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        
        if (!fs.existsSync(dest)) {
          console.log(`Copying placeholder to ${dest}`);
          fs.writeFileSync(dest, content);
        }
      });
    } else {
      console.warn(`Source placeholder not found: ${mapping.src}`);
    }
  });
}

// Create placeholder images for local development
function createPlaceholderImages() {
  console.log('🖼️ Creating placeholder images...');
  
  const imagePaths = [
    path.join(BACKGROUNDS_DIR, 'hero-bg.jpg'),
    path.join(BACKGROUNDS_DIR, 'services-bg.jpg'),
    path.join(GALLERY_DIR, 'performance1.jpg'),
    path.join(GALLERY_DIR, 'performance2.jpg'),
    path.join(GALLERY_DIR, 'performance3.jpg'),
    path.join(GALLERY_DIR, 'performance4.jpg'),
    path.join(GALLERY_DIR, 'performance5.jpg'),
    path.join(GALLERY_DIR, 'performance6.jpg'),
    path.join(GALLERY_DIR, 'performance7.jpg'),
    path.join(GALLERY_DIR, 'performance8.jpg'),
    path.join(GALLERY_DIR, 'performance9.jpg'),
    path.join(SERVICES_DIR, 'singing.jpg'),
    path.join(SERVICES_DIR, 'coaching.jpg'),
    path.join(SERVICES_DIR, 'workshop.jpg'),
    path.join(SERVICES_DIR, 'chor.jpg'),
  ];
  
  // Check if each image exists, if not try to copy from placeholder
  imagePaths.forEach(imagePath => {
    if (!fs.existsSync(imagePath)) {
      console.log(`Image missing at: ${imagePath}`);
    } else {
      console.log(`Image already exists at: ${imagePath}`);
    }
  });

  // Try to run the download-placeholders script for better images
  console.log('Attempting to download better placeholder images...');
  try {
    execSync('node download-placeholders.js', { stdio: 'inherit' });
  } catch (error) {
    console.warn('Could not download placeholder images. Using SVG placeholders instead.');
    copySvgPlaceholders();
  }
}

// Create placeholder audio files
function createPlaceholderAudio() {
  console.log('🔊 Creating placeholder audio files...');
  
  const audioPaths = [
    path.join(AUDIO_DIR, 'music-sample-1.mp3'),
    path.join(AUDIO_DIR, 'music-sample-2.mp3'),
    path.join(AUDIO_DIR, 'music-sample-3.mp3'),
  ];
  
  audioPaths.forEach(audioPath => {
    if (!fs.existsSync(audioPath)) {
      console.log(`Creating placeholder for ${audioPath}...`);
      fs.writeFileSync(audioPath, 'Placeholder Audio');
    }
  });
}

// Main function
function main() {
  console.log('🚀 Setting up local development environment...');
  
  createDirectories();
  createPlaceholderImages();
  createPlaceholderAudio();
  
  console.log('✅ Setup complete!');
  console.log('\nNext steps:');
  console.log('1. If you have real assets, copy them to the public/images and public/audio directories');
  console.log('2. Run "npm run dev" to start the development server');
  console.log('3. Open http://localhost:3000 in your browser to view the site');
}

main(); 