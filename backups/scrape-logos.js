const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const sites = [
  {
    name: 'B-Flat Jazz Club',
    url: 'https://b-flat-berlin.de',
    selector: '.logo img, img[alt*="logo"], img[src*="logo"]',
    output: 'bflat-logo.png'
  },
  {
    name: 'Complete Vocal Institute',
    url: 'https://completevocal.institute',
    selector: '.logo img, img[alt*="logo"], img[src*="logo"]',
    output: 'cvi-logo.png'
  },
  {
    name: 'Jazz Institut Berlin',
    url: 'https://www.jazz-institut-berlin.de',
    selector: '.logo img, img[alt*="logo"], img[src*="logo"]',
    output: 'jib-logo.png'
  },
  {
    name: 'A-Trane',
    url: 'https://www.a-trane.de',
    selector: '.logo img, img[alt*="logo"], img[src*="logo"]',
    output: 'atrane-logo.png'
  },
  {
    name: 'Berliner Philharmonie',
    url: 'https://www.berliner-philharmoniker.de',
    selector: '.logo img, img[alt*="logo"], img[src*="logo"]',
    output: 'philharmonie-logo.png'
  }
];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  for (const site of sites) {
    try {
      console.log(`\nTrying to get logo from ${site.name}...`);
      await page.goto(site.url, { waitUntil: 'networkidle0' });
      
      const logo = await page.evaluate((selector) => {
        const img = document.querySelector(selector);
        return img ? img.src : null;
      }, site.selector);
      
      if (logo) {
        console.log(`Found logo URL: ${logo}`);
        const viewSource = await page.goto(logo);
        const buffer = await viewSource.buffer();
        
        const outputPath = path.join(process.cwd(), 'public', 'images', 'collaborations', site.output);
        fs.writeFileSync(outputPath, buffer);
        console.log(`Successfully saved ${site.output}`);
      } else {
        console.log(`Could not find logo for ${site.name}`);
      }
    } catch (error) {
      console.log(`Error getting logo for ${site.name}:`, error.message);
    }
  }
  
  await browser.close();
})(); 