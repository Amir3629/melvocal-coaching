const fs = require('fs');
const path = require('path');

// Ensure the music directory exists
const musicDir = path.join(__dirname, '../public/images/music');
if (!fs.existsSync(musicDir)) {
  fs.mkdirSync(musicDir, { recursive: true });
}

// List of music image filenames
const musicImages = [
  'jazz-piano.jpg',
  'vocal-jazz.jpg',
  'jazz-standards.jpg',
  'original-jazz.jpg',
  'jazz-ensemble.jpg',
  'vocal-coaching.jpg',
  'piano-solo.jpg'
];

// Generate a simple SVG for each image
musicImages.forEach((filename) => {
  const title = filename.replace('.jpg', '').replace(/-/g, ' ');
  const svgContent = `
<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="500" fill="#222" />
  <circle cx="250" cy="250" r="200" fill="#333" />
  <circle cx="250" cy="250" r="50" fill="#000" />
  <circle cx="250" cy="250" r="15" fill="#444" />
  <text x="250" y="350" font-family="Arial" font-size="24" fill="#ccc" text-anchor="middle">${title}</text>
  <path d="M 100 250 A 150 150 0 0 1 400 250" stroke="#555" stroke-width="2" fill="none" />
  <path d="M 130 200 A 120 120 0 0 1 370 200" stroke="#555" stroke-width="2" fill="none" />
  <path d="M 150 300 A 100 100 0 0 0 350 300" stroke="#555" stroke-width="2" fill="none" />
</svg>
  `;

  // Convert SVG to base64 and create a simple HTML file that renders as an image
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <style>
    body, html { margin: 0; padding: 0; height: 100%; display: flex; align-items: center; justify-content: center; background: #000; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <img src="data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}" alt="${title}" />
</body>
</html>
  `;

  fs.writeFileSync(path.join(musicDir, filename), htmlContent);
  console.log(`Generated placeholder for ${filename}`);
});

console.log('All music placeholders generated successfully!'); 