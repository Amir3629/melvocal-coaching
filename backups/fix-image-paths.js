const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to get base path based on environment
function getBasePath() {
  return process.env.NODE_ENV === 'production' ? '/vocal-coaching' : '';
}

// Function to update all image paths in a file
function updateImagePaths(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Create a utility component to handle image paths
    const imagePathUtilContent = `
"use client"

export function getImagePath(imagePath) {
  const basePath = process.env.NODE_ENV === 'production' ? '/vocal-coaching' : '';
  
  // If the path already has the correct prefix, return it
  if (process.env.NODE_ENV === 'production' && imagePath.startsWith('/vocal-coaching/')) {
    return imagePath;
  }
  
  // If the path already starts with /images, append the base path
  if (imagePath.startsWith('/images/')) {
    return \`\${basePath}\${imagePath}\`;
  }
  
  // If the path includes vocal-coaching but we're in development
  if (!process.env.NODE_ENV === 'production' && imagePath.includes('/vocal-coaching/')) {
    return imagePath.replace('/vocal-coaching', '');
  }
  
  return imagePath;
}
`;

    // Make sure the utils directory exists
    if (!fs.existsSync(path.join(process.cwd(), 'app', 'utils'))) {
      fs.mkdirSync(path.join(process.cwd(), 'app', 'utils'), { recursive: true });
    }
    
    // Write the utility function
    fs.writeFileSync(path.join(process.cwd(), 'app', 'utils', 'image-path.js'), imagePathUtilContent);
    
    console.log('✅ Created image path utility function');
  } catch (error) {
    console.error('Error creating image path utility:', error);
  }
}

// Main function
function main() {
  console.log('🔍 Setting up image path utilities...');
  updateImagePaths('');
  console.log('✅ Done!');
  console.log('\nInstructions:');
  console.log('1. In your components, import the getImagePath function:');
  console.log('   import { getImagePath } from "@/app/utils/image-path"');
  console.log('2. Replace image paths like:');
  console.log('   <img src="/vocal-coaching/images/example.jpg" />');
  console.log('   with:');
  console.log('   <img src={getImagePath("/images/example.jpg")} />');
  console.log('\nThis will ensure your images work in both development and production environments.');
}

main(); 