const fs = require('fs');
const path = require('path');

// Create an SVG placeholder image
function createPlaceholderSVG(width, height, text) {
  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#121212"/>
  <rect width="100%" height="100%" fill="#1A1A1A" opacity="0.8"/>
  <text 
    x="50%" 
    y="50%" 
    font-family="Arial" 
    font-size="24" 
    font-weight="bold"
    fill="#C8A97E" 
    text-anchor="middle" 
    dominant-baseline="middle"
  >
    ${text}
  </text>
</svg>
  `.trim();
}

// Save SVG files
function savePlaceholderImages() {
  console.log('Creating placeholder SVG images...');
  
  // Create public/images/placeholders directory if it doesn't exist
  const placeholdersDir = path.join(__dirname, 'public', 'images', 'placeholders');
  if (!fs.existsSync(placeholdersDir)) {
    fs.mkdirSync(placeholdersDir, { recursive: true });
  }
  
  // Create placeholder images with different dimensions
  const placeholderImages = [
    { width: 1200, height: 800, name: 'background.svg', text: 'Background Image Placeholder' },
    { width: 800, height: 800, name: 'gallery.svg', text: 'Gallery Image Placeholder' },
    { width: 400, height: 400, name: 'avatar.svg', text: 'Avatar Placeholder' },
    { width: 1600, height: 900, name: 'hero.svg', text: 'Hero Image Placeholder' },
  ];
  
  placeholderImages.forEach(({ width, height, name, text }) => {
    const svgContent = createPlaceholderSVG(width, height, text);
    const filePath = path.join(placeholdersDir, name);
    
    fs.writeFileSync(filePath, svgContent);
    console.log(`Created ${filePath}`);
  });
  
  console.log('Placeholder SVG images created successfully!');
}

// Run the function
savePlaceholderImages(); 