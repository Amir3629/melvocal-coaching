const fs = require('fs');
const path = require('path');

// Define the placeholder directory
const PLACEHOLDERS_DIR = path.join(__dirname, 'public', 'images', 'placeholders');

// Create directory if it doesn't exist
if (!fs.existsSync(PLACEHOLDERS_DIR)) {
  console.log(`Creating placeholder directory: ${PLACEHOLDERS_DIR}`);
  fs.mkdirSync(PLACEHOLDERS_DIR, { recursive: true });
}

// Define placeholder SVGs
const placeholders = {
  'gallery.svg': `<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="800" fill="#f0f0f0"/>
    <text x="400" y="400" font-family="Arial" font-size="32" text-anchor="middle" fill="#555">Gallery Image</text>
    <text x="400" y="450" font-family="Arial" font-size="20" text-anchor="middle" fill="#888">800 x 800</text>
  </svg>`,
  
  'background.svg': `<svg width="1600" height="900" xmlns="http://www.w3.org/2000/svg">
    <rect width="1600" height="900" fill="#e5e5e5"/>
    <text x="800" y="450" font-family="Arial" font-size="40" text-anchor="middle" fill="#666">Background Image</text>
    <text x="800" y="500" font-family="Arial" font-size="24" text-anchor="middle" fill="#999">1600 x 900</text>
  </svg>`,
  
  'avatar.svg': `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="400" fill="#f5f5f5"/>
    <circle cx="200" cy="150" r="70" fill="#ddd"/>
    <circle cx="200" cy="350" r="150" fill="#ddd"/>
    <text x="200" y="290" font-family="Arial" font-size="20" text-anchor="middle" fill="#888">Service Image</text>
  </svg>`,
  
  'logo.svg': `<svg width="200" height="80" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="80" fill="#fff"/>
    <text x="100" y="45" font-family="Arial" font-size="20" font-weight="bold" text-anchor="middle" fill="#333">LOGO</text>
  </svg>`
};

// Generate each placeholder
Object.entries(placeholders).forEach(([filename, content]) => {
  const filePath = path.join(PLACEHOLDERS_DIR, filename);
  
  console.log(`Creating placeholder: ${filePath}`);
  fs.writeFileSync(filePath, content);
});

console.log('✅ SVG placeholders created successfully'); 