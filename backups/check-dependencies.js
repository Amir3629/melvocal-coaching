const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the dependencies that need to be checked
const requiredDependencies = [
  '@headlessui/react',
  'framer-motion',
  'lucide-react',
  'next',
  'react',
  'react-dom',
  'i18next',
  'react-i18next',
  'tailwindcss',
];

console.log('🔍 Checking for required dependencies...');

// Read package.json
let packageJson;
try {
  packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
} catch (error) {
  console.error('Error reading package.json:', error.message);
  process.exit(1);
}

// Check which dependencies are missing
const missingDependencies = [];
requiredDependencies.forEach(dep => {
  if (!packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]) {
    missingDependencies.push(dep);
  }
});

// Install missing dependencies
if (missingDependencies.length > 0) {
  console.log(`Missing dependencies: ${missingDependencies.join(', ')}`);
  
  try {
    console.log('📦 Installing missing dependencies...');
    execSync(`npm install ${missingDependencies.join(' ')}`, { stdio: 'inherit' });
    console.log('✅ Successfully installed missing dependencies.');
  } catch (error) {
    console.error('Error installing dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ All required dependencies are installed.');
}

// Check if placeholders need to be created
if (!fs.existsSync(path.join(__dirname, 'public', 'images', 'placeholders'))) {
  console.log('🖼️ Creating image placeholders...');
  try {
    execSync('node placeholder.js', { stdio: 'inherit' });
  } catch (error) {
    console.warn('Warning: Could not create placeholders. You may need to run the placeholder.js script separately.');
  }
}

// Check for environment variables
if (!fs.existsSync(path.join(__dirname, '.env.local'))) {
  console.log('📝 Creating default .env.local file...');
  
  const envContent = `
# Base URL for development
NEXT_PUBLIC_BASE_URL=http://localhost:3000
`.trim();
  
  try {
    fs.writeFileSync(path.join(__dirname, '.env.local'), envContent);
    console.log('✅ Created .env.local with default configuration.');
  } catch (error) {
    console.error('Error creating .env.local:', error.message);
  }
}

console.log('\n🚀 All checks completed. You can now run:');
console.log('  npm run dev');
console.log('  and open http://localhost:3000 in your browser.\n');

// Run the setup-local-images script if it exists
if (fs.existsSync(path.join(__dirname, 'setup-local-images.js'))) {
  console.log('🖼️ Setting up local images...');
  try {
    execSync('node setup-local-images.js', { stdio: 'inherit' });
  } catch (error) {
    console.warn('Warning: Could not run setup-local-images.js. You may need to run it separately.');
  }
} 