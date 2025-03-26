const axios = require('axios');
const fs = require('fs');
const path = require('path');

const logos = [
  {
    name: 'B-Flat Jazz Club',
    urls: [
      'https://b-flat-berlin.de/wp-content/themes/bflat/images/logo.png',
      'https://b-flat-berlin.de/wp-content/uploads/2023/logo.png'
    ],
    output: 'bflat-logo.png'
  },
  {
    name: 'Complete Vocal Institute',
    urls: [
      'https://completevocal.institute/wp-content/uploads/2022/logo.png',
      'https://completevocal.institute/assets/images/logo-dark.png'
    ],
    output: 'cvi-logo.png'
  },
  {
    name: 'Jazz Institut Berlin',
    urls: [
      'https://www.jazz-institut-berlin.de/wp-content/themes/jib/images/logo.png',
      'https://www.jazz-institut-berlin.de/assets/images/logo.png'
    ],
    output: 'jib-logo.png'
  },
  {
    name: 'A-Trane',
    urls: [
      'https://www.a-trane.de/wp-content/uploads/2023/logo.png',
      'https://www.a-trane.de/images/logo-white.png'
    ],
    output: 'atrane-logo.png'
  },
  {
    name: 'Berliner Philharmonie',
    urls: [
      'https://www.berliner-philharmoniker.de/static/bph/img/logo.svg',
      'https://www.berliner-philharmoniker.de/fileadmin/templates/images/logo.png'
    ],
    output: 'philharmonie-logo.png'
  }
];

async function downloadImage(url, outputPath) {
  try {
    const response = await axios({
      url,
      responseType: 'arraybuffer',
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (response.status === 200) {
      await fs.promises.writeFile(outputPath, response.data);
    console.log(`Successfully downloaded: ${outputPath}`);
    return true;
    }
    return false;
  } catch (error) {
    console.log(`Failed to download from ${url}: ${error.message}`);
    return false;
  }
}

async function main() {
  const outputDir = path.join(process.cwd(), 'public', 'images', 'collaborations');
  
  // Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

  for (const logo of logos) {
    console.log(`\nAttempting to download ${logo.name} logo...`);
    let success = false;
    
    for (const url of logo.urls) {
      console.log(`Trying URL: ${url}`);
      const outputPath = path.join(outputDir, logo.output);
      
      success = await downloadImage(url, outputPath);
      if (success) break;
    }
    
    if (!success) {
      console.log(`Failed to download ${logo.name} logo from all attempted URLs`);
    }
  }
}

main().catch(console.error); 