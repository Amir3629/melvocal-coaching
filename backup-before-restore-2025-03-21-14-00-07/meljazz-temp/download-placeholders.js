const fs = require('fs');
const path = require('path');
const https = require('https');

// Define the directory paths
const PUBLIC_DIR = path.join(__dirname, 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const GALLERY_DIR = path.join(IMAGES_DIR, 'gallery');
const BACKGROUNDS_DIR = path.join(IMAGES_DIR, 'backgrounds');
const SERVICES_DIR = path.join(IMAGES_DIR, 'services');

// Create directories if they don't exist
function createDirectories() {
  [PUBLIC_DIR, IMAGES_DIR, GALLERY_DIR, BACKGROUNDS_DIR, SERVICES_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`Creating ${dir}...`);
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Download file from URL
function downloadImage(url, destination) {
  return new Promise((resolve, reject) => {
    // Skip if file already exists
    if (fs.existsSync(destination)) {
      console.log(`File already exists: ${destination}`);
      return resolve();
    }

    console.log(`Downloading ${url} to ${destination}...`);
    
    const file = fs.createWriteStream(destination);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image, status code: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${destination}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destination, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Main function to download all placeholder images
async function downloadPlaceholders() {
  createDirectories();
  
  // Define image mappings - placeholders from picsum.photos
  const imageMappings = [
    // Gallery images - people singing/performing
    ...Array.from({ length: 9 }, (_, i) => ({
      url: `https://picsum.photos/seed/gallery${i+1}/800/800`,
      destination: path.join(GALLERY_DIR, `performance${i+1}.jpg`)
    })),
    
    // Background images
    {
      url: 'https://picsum.photos/seed/hero/1600/900',
      destination: path.join(BACKGROUNDS_DIR, 'hero-bg.jpg')
    },
    {
      url: 'https://picsum.photos/seed/services/1600/900',
      destination: path.join(BACKGROUNDS_DIR, 'services-bg.jpg')
    },
    
    // Service images
    {
      url: 'https://picsum.photos/seed/singing/400/400',
      destination: path.join(SERVICES_DIR, 'singing.jpg')
    },
    {
      url: 'https://picsum.photos/seed/coaching/400/400',
      destination: path.join(SERVICES_DIR, 'coaching.jpg')
    },
    {
      url: 'https://picsum.photos/seed/workshop/400/400',
      destination: path.join(SERVICES_DIR, 'workshop.jpg')
    },
    {
      url: 'https://picsum.photos/seed/chor/400/400',
      destination: path.join(SERVICES_DIR, 'chor.jpg')
    }
  ];
  
  // Download all images
  const downloadPromises = imageMappings.map(({ url, destination }) => 
    downloadImage(url, destination)
  );
  
  try {
    await Promise.all(downloadPromises);
    console.log('✅ All placeholder images downloaded successfully!');
  } catch (error) {
    console.error('❌ Error downloading placeholder images:', error.message);
    throw error; // Rethrow to signal failure to the calling script
  }
}

// Run the download function
downloadPlaceholders().catch(error => {
  console.error('Failed to download placeholders:', error);
  process.exit(1);
}); 