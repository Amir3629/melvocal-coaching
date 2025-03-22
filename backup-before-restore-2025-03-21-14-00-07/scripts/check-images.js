const fs = require('fs');
const path = require('path');

// Function to check if a file exists
const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
};

// Function to scan directory recursively for image files
const scanDirectory = (dir) => {
  const results = [];
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results.push(...scanDirectory(fullPath));
    } else if (/\.(jpg|jpeg|png|gif|svg|webp)$/i.test(item)) {
      results.push(fullPath);
    }
  });

  return results;
};

// Main function to check images
const checkImages = () => {
  console.log('Checking image files...\n');

  // Check public/images directory
  const publicImagesDir = path.join(process.cwd(), 'public', 'images');
  if (!fileExists(publicImagesDir)) {
    console.error('Error: public/images directory does not exist!');
    process.exit(1);
  }

  // Scan for all image files
  const imageFiles = scanDirectory(publicImagesDir);
  console.log(`Found ${imageFiles.length} image files.\n`);

  // Check each image file
  imageFiles.forEach((file) => {
    const relativePath = path.relative(process.cwd(), file);
    console.log(`✓ ${relativePath}`);
  });

  console.log('\nAll image files are in place.');
};

// Run the check
checkImages(); 