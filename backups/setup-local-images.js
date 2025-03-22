const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the directory paths
const PUBLIC_DIR = path.join(__dirname, 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const GALLERY_DIR = path.join(IMAGES_DIR, 'gallery');
const BACKGROUNDS_DIR = path.join(IMAGES_DIR, 'backgrounds');
const AUDIO_DIR = path.join(PUBLIC_DIR, 'audio');

// Create directories if they don't exist
function createDirectories() {
  console.log('📁 Creating directories if they don\'t exist...');
  
  [PUBLIC_DIR, IMAGES_DIR, GALLERY_DIR, BACKGROUNDS_DIR, AUDIO_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`Creating ${dir}...`);
      fs.mkdirSync(dir, { recursive: true });
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
  ];
  
  // Create placeholder images
  imagePaths.forEach(imagePath => {
    if (!fs.existsSync(imagePath)) {
      console.log(`Creating placeholder for ${imagePath}...`);
      
      const width = path.dirname(imagePath).includes('gallery') ? 800 : 1200;
      const height = path.dirname(imagePath).includes('gallery') ? 800 : 800;
      
      // Generate a placeholder image using npx
      try {
        console.log(`Generating placeholder image at ${imagePath}...`);
        // If you have npx/node available, you can use this to generate placeholder images
        // execSync(`npx @squoosh/cli --resize '{"enabled":true,"width":${width},"height":${height}}' -d ${path.dirname(imagePath)} ${__dirname}/placeholder.png -o ${path.basename(imagePath)}`);
        
        // For now, let's just create an empty file as a placeholder
        fs.writeFileSync(imagePath, 'Placeholder Image');
      } catch (error) {
        console.error(`Error creating placeholder for ${imagePath}:`, error.message);
      }
    }
  });
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