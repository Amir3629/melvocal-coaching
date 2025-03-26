const fs = require('fs');
const https = require('https');
const path = require('path');

const videos = [
  'hFdMHvB6-Jk',
  'ZvWZr6TNh9Y',
  'r58-5DBfMpY',
  '0zARqh3xwnw',
  'AWsarzdZ1u8',
  'GidIMbCmtyk',
  'QgZKO_f5FlM'
];

const thumbnailDir = path.join(__dirname, '../public/images/thumbnails');

// Create the directory if it doesn't exist
if (!fs.existsSync(thumbnailDir)) {
  fs.mkdirSync(thumbnailDir, { recursive: true });
}

// Download thumbnails
videos.forEach((videoId, index) => {
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const fileName = index === 0 ? 'warmup-1.jpg' :
                   index === 1 ? 'warmup-2.jpg' :
                   index === 2 ? 'range.jpg' :
                   index === 3 ? 'breathing.jpg' :
                   index === 4 ? 'control.jpg' :
                   index === 5 ? 'pitch.jpg' : 'pro.jpg';
  
  const filePath = path.join(thumbnailDir, fileName);
  
  https.get(thumbnailUrl, (response) => {
    const fileStream = fs.createWriteStream(filePath);
    response.pipe(fileStream);
    
    fileStream.on('finish', () => {
      console.log(`Downloaded: ${fileName}`);
      fileStream.close();
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${fileName}:`, err.message);
  });
}); 