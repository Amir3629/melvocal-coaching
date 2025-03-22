const fs = require('fs');
const path = require('path');
const https = require('https');

const testimonials = [
  { 
    name: 'sarah',
    gender: 'female',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
  },
  { 
    name: 'thomas',
    gender: 'male',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
  },
  { 
    name: 'lisa',
    gender: 'female',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
  },
  { 
    name: 'michael',
    gender: 'male',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
  },
  { 
    name: 'julia',
    gender: 'female',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'
  },
  { 
    name: 'david',
    gender: 'male',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop'
  },
  { 
    name: 'anna',
    gender: 'female',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop'
  },
  { 
    name: 'james',
    gender: 'male',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
  },
  { 
    name: 'elena',
    gender: 'female',
    imageUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop'
  }
];

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    https.get(url, options, (response) => {
      if (response.statusCode === 200) {
        const writeStream = fs.createWriteStream(filepath);
        response.pipe(writeStream);
        writeStream.on('finish', () => {
          writeStream.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function generateProfilePictures() {
  const outputDir = path.join(process.cwd(), 'public/images/testimonials');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const testimonial of testimonials) {
    const outputPath = path.join(outputDir, `${testimonial.name}.jpg`);
    
    try {
      await downloadImage(testimonial.imageUrl, outputPath);
      console.log(`Downloaded profile picture for ${testimonial.name}`);
    } catch (error) {
      console.error(`Error downloading profile picture for ${testimonial.name}:`, error);
    }
  }
}

generateProfilePictures().catch(console.error); 