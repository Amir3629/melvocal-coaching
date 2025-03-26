const fs = require('fs');
const path = require('path');

const svgs = {
  'bflat.svg': `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(40, 5)">
    <text x="0" y="35" font-family="Arial" font-weight="900" font-size="60" fill="currentColor" style="letter-spacing: -2px">b</text>
    <rect x="45" y="0" width="3" height="45" fill="currentColor"/>
    <text x="55" y="35" font-family="Arial" font-weight="900" font-size="16" fill="currentColor" style="letter-spacing: 2px">FLAT</text>
  </g>
</svg>`,

  'cvi.svg': `<?xml version="1.0" encoding="UTF-8"?>
<svg width="160" height="60" viewBox="0 0 160 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(20, 15)">
    <path d="M10,15 L110,15 M10,30 L110,30" stroke="currentColor" stroke-width="1"/>
    <text x="60" y="25" font-family="Arial" font-weight="bold" font-size="14" fill="currentColor" text-anchor="middle">COMPLETE VOCAL INSTITUTE</text>
  </g>
</svg>`,

  'bluenote.svg': `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(20, 10)">
    <rect x="0" y="0" width="160" height="40" stroke="currentColor" stroke-width="2" fill="none"/>
    <text x="80" y="20" font-family="Arial Black" font-weight="900" font-size="18" fill="currentColor" text-anchor="middle" style="letter-spacing: 1px">BLUE NOTE</text>
    <text x="80" y="35" font-family="Arial" font-weight="bold" font-size="12" fill="currentColor" text-anchor="middle">TOKYO</text>
    <path d="M20,25 h120" stroke="currentColor" stroke-width="0.5"/>
  </g>
</svg>`,

  'jib.svg': `<?xml version="1.0" encoding="UTF-8"?>
<svg width="180" height="60" viewBox="0 0 180 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(20, 10)">
    <path d="M10,10 L50,10 L70,25 L90,10 L130,10" stroke="currentColor" stroke-width="3"/>
    <path d="M30,20 L110,20" stroke="currentColor" stroke-width="2"/>
    <text x="70" y="40" font-family="Arial Black" font-weight="900" font-size="14" fill="currentColor" text-anchor="middle">JAZZ INSTITUT BERLIN</text>
  </g>
</svg>`,

  'atrane.svg': `<?xml version="1.0" encoding="UTF-8"?>
<svg width="160" height="60" viewBox="0 0 160 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(20, 15)">
    <path d="M0,0 h120 v30 h-120 z" stroke="currentColor" stroke-width="1" fill="none"/>
    <line x1="0" y1="10" x2="120" y2="10" stroke="currentColor" stroke-width="1"/>
    <line x1="0" y1="20" x2="120" y2="20" stroke="currentColor" stroke-width="1"/>
    <text x="60" y="25" font-family="Arial" font-weight="bold" font-size="18" fill="currentColor" text-anchor="middle" style="letter-spacing: 1px">A-TRANE</text>
  </g>
</svg>`,

  'philharmonie.svg': `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(20, 10)">
    <path d="M20,20 h120 M30,10 h100 M40,30 h80" stroke="currentColor" stroke-width="1"/>
    <path d="M60,5 L100,35 M100,5 L60,35" stroke="currentColor" stroke-width="0.5"/>
    <text x="80" y="45" font-family="Arial" font-weight="normal" font-size="11" fill="currentColor" text-anchor="middle" style="letter-spacing: 1px">BERLINER PHILHARMONIKER</text>
  </g>
</svg>`
};

const outputDir = path.join(process.cwd(), 'public', 'images', 'collaborations');

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write SVG files
Object.entries(svgs).forEach(([filename, content]) => {
  const filepath = path.join(outputDir, filename);
  fs.writeFileSync(filepath, content);
  console.log(`Created ${filepath}`);
}); 