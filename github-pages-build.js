/**
 * GitHub Pages Build Helper
 * This script runs during the GitHub Pages deployment process to fix common issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

// Log with colors
function log(message, color = COLORS.reset) {
  console.log(`${color}${message}${COLORS.reset}`);
}

// Log an error
function logError(message) {
  log(`❌ ERROR: ${message}`, COLORS.red);
}

// Log a success
function logSuccess(message) {
  log(`✅ ${message}`, COLORS.green);
}

// Log an info message
function logInfo(message) {
  log(`ℹ️ ${message}`, COLORS.blue);
}

// Log a warning
function logWarning(message) {
  log(`⚠️ ${message}`, COLORS.yellow);
}

// Helper to run shell commands
function runCommand(command) {
  try {
    log(`Running: ${command}`, COLORS.yellow);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    logError(`Command failed: ${command}`);
    logError(error.message);
    return false;
  }
}

// Find and fix router-related issues in compiled JS files
function fixRouterIssuesInJsFiles(buildDir) {
  log('\n📝 Checking for potential router issues in compiled JS...', COLORS.bright);
  
  try {
    // Find JS files
    const jsDir = path.join(buildDir, '_next', 'static', 'chunks');
    
    if (!fs.existsSync(jsDir)) {
      logWarning(`JS directory not found: ${jsDir}`);
      return;
    }
    
    // Get list of JS files
    const jsFiles = fs.readdirSync(jsDir)
      .filter(file => file.endsWith('.js'));
    
    logInfo(`Found ${jsFiles.length} JS files to check`);
    
    // Process each file
    let fixedCount = 0;
    
    for (const file of jsFiles) {
      const filePath = path.join(jsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Look for router-related patterns that might cause issues
      const routerIssuePatterns = [
        // Objects passed to JSX that should be strings
        { 
          search: /(\w+)\.pathname}/g,
          replace: 'String($1.pathname)}'
        },
        {
          search: /(\w+)\.query}/g,
          replace: 'JSON.stringify($1.query)}'
        },
        {
          search: /(\w+)\.asPath}/g,
          replace: 'String($1.asPath)}'
        },
        {
          search: /(\w+)\.params}/g,
          replace: 'JSON.stringify($1.params)}'
        }
      ];
      
      // Apply fixes
      let modifiedContent = content;
      let fileWasModified = false;
      
      for (const pattern of routerIssuePatterns) {
        if (pattern.search.test(modifiedContent)) {
          modifiedContent = modifiedContent.replace(pattern.search, pattern.replace);
          fileWasModified = true;
          logInfo(`Fixed router pattern in ${file}`);
        }
      }
      
      // Save modified file
      if (fileWasModified) {
        fs.writeFileSync(filePath, modifiedContent, 'utf8');
        fixedCount++;
      }
    }
    
    if (fixedCount > 0) {
      logSuccess(`Fixed router issues in ${fixedCount} files`);
    } else {
      logSuccess('No router issues found');
    }
  } catch (error) {
    logError(`Error fixing router issues: ${error.message}`);
  }
}

// Add special handling for GitHub Pages 404 page
function createCustom404Page(buildDir) {
  log('\n📝 Creating GitHub Pages compatible 404 page...', COLORS.bright);
  
  const notFoundPagePath = path.join(buildDir, '404.html');
  
  try {
    // Create a custom 404 page that can handle client-side routing
    const page404Content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Page Not Found</title>
  <script>
    // GitHub Pages SPA redirect
    (function() {
      // Extract path from URL
      var path = window.location.pathname;
      var basePath = '/melvocal-coaching';
      
      // Check if we're on GitHub Pages
      if (path.indexOf(basePath) === 0) {
        // Store the current URL for redirect
        sessionStorage.setItem('redirectUrl', path);
        // Redirect to index
        window.location.href = basePath + '/';
      }
    })();
  </script>
</head>
<body>
  <div style="text-align: center; padding: 50px;">
    <h1>Page Not Found</h1>
    <p>Redirecting to home page...</p>
  </div>
</body>
</html>`;

    fs.writeFileSync(notFoundPagePath, page404Content, 'utf8');
    logSuccess('Created custom 404.html for GitHub Pages');
    
    // Also modify index.html to handle redirects
    const indexPath = path.join(buildDir, 'index.html');
    
    if (fs.existsSync(indexPath)) {
      let indexContent = fs.readFileSync(indexPath, 'utf8');
      
      // Add redirect script to <head>
      if (!indexContent.includes('Handle GitHub Pages SPA redirects')) {
        const redirectScript = `
  <!-- Handle GitHub Pages SPA redirects -->
  <script>
    (function() {
      // Check for redirect
      var redirectUrl = sessionStorage.getItem('redirectUrl');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectUrl');
        console.log('Redirecting to:', redirectUrl);
        history.replaceState(null, null, redirectUrl);
      }
    })();
  </script>`;
        
        // Insert after <head>
        indexContent = indexContent.replace('<head>', '<head>' + redirectScript);
        fs.writeFileSync(indexPath, indexContent, 'utf8');
        logSuccess('Modified index.html to handle SPA redirects');
      }
    }
  } catch (error) {
    logError(`Error creating 404 page: ${error.message}`);
  }
}

// Main function
function main() {
  log('\n🚀 GitHub Pages Build Helper\n', COLORS.bright);
  
  // Paths
  const rootDir = process.cwd();
  const buildDir = path.join(rootDir, 'out');
  
  // Check if build directory exists
  if (!fs.existsSync(buildDir)) {
    logError(`Build directory not found: ${buildDir}`);
    process.exit(1);
  }
  
  logInfo(`Root directory: ${rootDir}`);
  logInfo(`Build directory: ${buildDir}`);
  
  // Fix router issues in JS files
  fixRouterIssuesInJsFiles(buildDir);
  
  // Create custom 404 page for GitHub Pages
  createCustom404Page(buildDir);
  
  log('\n✅ Build preparation completed successfully!\n', COLORS.green);
}

// Run script
main(); 