const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// List of required dependencies
const REQUIRED_PACKAGES = [
  '@headlessui/react',
  'next',
  'react',
  'react-dom',
  'react-icons', 
  'react-hot-toast',
  'sharp',
  'typescript',
  '@types/node',
  '@types/react'
];

// Function to check installed npm packages
function checkNpmPackages() {
  console.log('🔍 Checking installed npm packages...');
  
  let missingPackages = [];
  
  try {
    // Check if package.json exists
    if (!fs.existsSync(path.join(__dirname, 'package.json'))) {
      console.error('❌ package.json not found. Are you in the correct directory?');
      return { success: false, missingPackages: REQUIRED_PACKAGES };
    }
    
    // Read package.json to check dependencies
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    const allDependencies = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {})
    };
    
    // Check each required package
    for (const pkg of REQUIRED_PACKAGES) {
      if (!allDependencies[pkg]) {
        missingPackages.push(pkg);
      }
    }
    
    if (missingPackages.length === 0) {
      console.log('✅ All required packages are installed!');
      return { success: true, missingPackages: [] };
    } else {
      console.warn(`⚠️ Missing packages: ${missingPackages.join(', ')}`);
      return { success: false, missingPackages };
    }
  } catch (error) {
    console.error('❌ Error checking npm packages:', error.message);
    return { success: false, missingPackages: [] };
  }
}

// Function to check if node_modules exists
function checkNodeModules() {
  console.log('🔍 Checking node_modules directory...');
  
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  
  if (fs.existsSync(nodeModulesPath)) {
    console.log('✅ node_modules directory exists');
    return true;
  } else {
    console.warn('⚠️ node_modules directory not found. Dependencies may not be installed.');
    return false;
  }
}

// Function to check if public directories exist
function checkPublicDirectories() {
  console.log('🔍 Checking public directory structure...');
  
  const dirs = [
    path.join(__dirname, 'public'),
    path.join(__dirname, 'public', 'images'),
    path.join(__dirname, 'public', 'images', 'gallery'),
    path.join(__dirname, 'public', 'images', 'backgrounds'),
    path.join(__dirname, 'public', 'images', 'services'),
    path.join(__dirname, 'public', 'audio')
  ];
  
  const missingDirs = dirs.filter(dir => !fs.existsSync(dir));
  
  if (missingDirs.length === 0) {
    console.log('✅ All required directories exist!');
    return { success: true, missingDirs: [] };
  } else {
    console.warn('⚠️ Missing directories:');
    missingDirs.forEach(dir => console.log(`  - ${path.relative(__dirname, dir)}`));
    return { success: false, missingDirs };
  }
}

// Function to install missing packages
function installMissingPackages(packages) {
  if (packages.length === 0) return true;
  
  console.log(`📦 Installing missing packages: ${packages.join(' ')}...`);
  try {
    execSync(`npm install ${packages.join(' ')}`, { stdio: 'inherit' });
    console.log('✅ All packages installed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Failed to install packages:', error.message);
    return false;
  }
}

// Function to create missing directories
function createMissingDirectories(dirs) {
  if (dirs.length === 0) return true;
  
  console.log('📁 Creating missing directories...');
  try {
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`  Created: ${path.relative(__dirname, dir)}`);
      }
    });
    console.log('✅ All directories created successfully!');
    return true;
  } catch (error) {
    console.error('❌ Failed to create directories:', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 Checking project dependencies and setup...');
  
  // Check npm packages
  const { success: packagesOk, missingPackages } = checkNpmPackages();
  
  // Check node_modules
  const nodeModulesOk = checkNodeModules();
  
  // Check public directories
  const { success: dirsOk, missingDirs } = checkPublicDirectories();
  
  // Fix issues if found
  let needsSetup = false;
  
  if (!packagesOk) {
    console.log('\n🔧 Some packages are missing. Let\'s fix that...');
    if (installMissingPackages(missingPackages)) {
      needsSetup = true;
    }
  }
  
  if (!dirsOk) {
    console.log('\n🔧 Some directories are missing. Let\'s fix that...');
    createMissingDirectories(missingDirs);
    needsSetup = true;
  }
  
  // Run setup scripts if needed
  if (needsSetup) {
    console.log('\n🔧 Running setup scripts...');
    
    try {
      console.log('\n📁 Setting up local development images...');
      execSync('node setup-local-images.js', { stdio: 'inherit' });
    } catch (error) {
      console.warn('⚠️ Could not setup local images:', error.message);
    }
  }
  
  console.log('\n✅ Dependency check complete!');
  
  if (packagesOk && nodeModulesOk && dirsOk) {
    console.log('🎉 Your project is ready for development!');
    console.log('\nNext steps:');
    console.log('  1. Run "npm run dev" to start the development server');
    console.log('  2. Open http://localhost:3000 in your browser');
  } else {
    console.log('\n⚠️ Some issues were found. Please fix them before continuing.');
    console.log('\nTry running:');
    console.log('  npm install');
    console.log('  node setup-local-images.js');
  }
}

// Run the script
main().catch(error => {
  console.error('❌ An unexpected error occurred:', error);
  process.exit(1);
}); 