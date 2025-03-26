const fs = require('fs');
const path = require('path');

const testimonials = [
  { name: 'sarah', gender: 'female', hairColor: '#4A3829', skinTone: '#F5D0C5' },
  { name: 'thomas', gender: 'male', hairColor: '#2C1810', skinTone: '#F4C3A8' },
  { name: 'lisa', gender: 'female', hairColor: '#6B4F3D', skinTone: '#FFDAC1' },
  { name: 'michael', gender: 'male', hairColor: '#1C1C1C', skinTone: '#E8B69E' },
  { name: 'julia', gender: 'female', hairColor: '#8B4513', skinTone: '#FFE0BD' },
  { name: 'david', gender: 'male', hairColor: '#3B3024', skinTone: '#F3C6A5' },
  { name: 'anna', gender: 'female', hairColor: '#3B2621', skinTone: '#FFDBAC' },
  { name: 'james', gender: 'male', hairColor: '#4A3829', skinTone: '#F5DEB3' },
  { name: 'elena', gender: 'female', hairColor: '#523629', skinTone: '#FFE4C4' }
];

function generateProfilePicture(name, gender, hairColor, skinTone) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad${name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#C8A97E;stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:#C8A97E;stop-opacity:0.05" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <circle cx="100" cy="100" r="100" fill="url(#grad${name})"/>
  
  <!-- Face shape -->
  <path d="M100 160c-22 0-40-25-40-45s18-45 40-45 40 25 40 45-18 45-40 45z" 
        fill="${skinTone}"/>
  
  <!-- Hair ${gender === 'female' ? '(longer)' : '(shorter)'} -->
  ${gender === 'female' ? `
    <path d="M60 115c0-30 18-55 40-55s40 25 40 55c0-35-18-65-40-65s-40 30-40 65z
            M55 95c0-25 20-45 45-45s45 20 45 45c0-30-20-55-45-55s-45 25-45 55z" 
          fill="${hairColor}"/>
  ` : `
    <path d="M60 115c0-30 18-45 40-45s40 15 40 45c0-25-18-45-40-45s-40 20-40 45z" 
          fill="${hairColor}"/>
  `}
  
  <!-- Eyes -->
  <circle cx="85" cy="100" r="3" fill="#2C1810"/>
  <circle cx="115" cy="100" r="3" fill="#2C1810"/>
  
  <!-- Eyebrows -->
  <path d="M80 95q10-5 15 0M110 95q10-5 15 0" stroke="#2C1810" stroke-width="1.5"/>
  
  <!-- Nose -->
  <path d="M97 105q3 5 6 0" stroke="#2C1810" stroke-width="1"/>
  
  <!-- Mouth -->
  <path d="M90 120q10 5 20 0" stroke="#2C1810" stroke-width="1.5" fill="none"/>
</svg>`;

  const outputDir = path.join(process.cwd(), 'public/images/testimonials');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `${name}.svg`);
  fs.writeFileSync(outputPath, svg);
  console.log(`Generated profile picture for ${name}`);
}

testimonials.forEach(({ name, gender, hairColor, skinTone }) => {
  generateProfilePicture(name, gender, hairColor, skinTone);
}); 