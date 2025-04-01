const fs = require('fs');
const path = require('path');

console.log('Browser Console Log Analyzer');
console.log('============================');

// Check if a file path was provided
const logFilePath = process.argv[2];
if (!logFilePath) {
  console.error('Please provide a path to the browser console log file');
  console.error('Example: node analyze-browser-logs.js ./browser-logs.json');
  console.error('\nHow to get browser logs:');
  console.error('1. Open Chrome DevTools (F12)');
  console.error('2. Go to Console tab');
  console.error('3. Right-click in the console and select "Save as..."');
  console.error('4. Save the file and provide the path to this script');
  process.exit(1);
}

try {
  // Read and parse the log file
  const logContent = fs.readFileSync(path.resolve(process.cwd(), logFilePath), 'utf8');
  let logs;
  
  try {
    logs = JSON.parse(logContent);
  } catch (e) {
    // If JSON parsing fails, try to parse as Chrome DevTools console export
    // which might be in a different format
    console.log('Failed to parse as JSON, trying alternative format...');
    
    // Simple format detection and conversion
    if (logContent.includes('[') && logContent.includes(']') && 
        (logContent.includes('"level"') || logContent.includes('"message"'))) {
      
      // Try to extract JSON array using regex
      const jsonMatch = logContent.match(/\[\s*\{.*\}\s*\]/s);
      if (jsonMatch) {
        try {
          logs = JSON.parse(jsonMatch[0]);
        } catch (e2) {
          console.error('Failed to extract logs from alternative format');
          throw e; // Throw original error
        }
      }
    } else {
      // It might be a text format, try to convert to JSON
      const lines = logContent.split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => {
          // Crude parsing - adapt as needed
          let level = 'info';
          if (line.includes('ERROR') || line.includes('error')) level = 'error';
          if (line.includes('WARN') || line.includes('warning')) level = 'warning';
          
          return {
            level,
            message: line,
            timestamp: new Date().toISOString()
          };
        });
      
      logs = lines;
    }
  }
  
  if (!logs || !Array.isArray(logs) || logs.length === 0) {
    console.error('No valid logs found in the file');
    process.exit(1);
  }
  
  // Normalize log format if needed
  logs = logs.map(log => {
    // Handle different log formats from different browsers
    if (!log.level && log.type) {
      log.level = log.type;
    }
    
    return log;
  });
  
  // Categorize logs
  const errors = logs.filter(log => 
    log.level === 'error' || 
    (log.message && typeof log.message === 'string' && 
      (log.message.includes('Error') || log.message.includes('error')))
  );
  
  const warnings = logs.filter(log => 
    log.level === 'warning' || 
    (log.message && typeof log.message === 'string' && 
      (log.message.includes('Warning') || log.message.includes('warning')))
  );
  
  const apiRequests = logs.filter(log => 
    log.message && 
    typeof log.message === 'string' && 
    (log.message.includes('fetch') || 
     log.message.includes('XHR') || 
     log.message.includes('http:') || 
     log.message.includes('https:'))
  );
  
  const reactErrors = logs.filter(log => 
    (log.level === 'error' || 
     (log.message && typeof log.message === 'string' && 
      (log.message.includes('Error') || log.message.includes('error')))) && 
    (log.message && typeof log.message === 'string' && (
      log.message.includes('React') || 
      log.message.includes('Hydration') ||
      log.message.includes('Component') ||
      log.message.includes('Suspense') ||
      log.message.includes('props')
    ))
  );
  
  const nextJsErrors = logs.filter(log => 
    (log.level === 'error' || 
     (log.message && typeof log.message === 'string' && 
      (log.message.includes('Error') || log.message.includes('error')))) && 
    (log.message && typeof log.message === 'string' && (
      log.message.includes('Next') || 
      log.message.includes('next') ||
      log.message.includes('chunk') ||
      log.message.includes('module')
    ))
  );
  
  // Output statistics
  console.log('\n===== BROWSER LOG ANALYSIS =====');
  console.log(`Total log entries: ${logs.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
  console.log(`API requests: ${apiRequests.length}`);
  console.log(`React-related errors: ${reactErrors.length}`);
  console.log(`Next.js-related errors: ${nextJsErrors.length}`);
  
  // Extract the common error patterns
  const errorPatterns = {};
  errors.forEach(error => {
    if (!error.message || typeof error.message !== 'string') return;
    
    // Extract first line or first 50 chars as the pattern
    const pattern = error.message.split('\n')[0].substring(0, 50);
    errorPatterns[pattern] = (errorPatterns[pattern] || 0) + 1;
  });
  
  // Sort error patterns by frequency
  const sortedPatterns = Object.entries(errorPatterns)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Show top 5
  
  if (sortedPatterns.length > 0) {
    console.log('\n===== MOST COMMON ERRORS =====');
    sortedPatterns.forEach(([pattern, count], i) => {
      console.log(`${i+1}. (${count} occurrences) ${pattern}...`);
    });
  }
  
  // Show detailed React errors
  if (reactErrors.length > 0) {
    console.log('\n===== REACT ERRORS =====');
    reactErrors.forEach((error, i) => {
      if (i >= 5) {
        if (i === 5) console.log(`... and ${reactErrors.length - 5} more`);
        return;
      }
      
      console.log(`\n[${i+1}] ${(error.message && typeof error.message === 'string') ? 
        error.message.split('\n')[0] : 'Unknown React error'}`);
      
      // For stack traces, show first few lines
      if (error.stackTrace) {
        console.log('Stack trace:');
        const stackLines = Array.isArray(error.stackTrace) ? error.stackTrace : 
          (typeof error.stackTrace === 'string' ? error.stackTrace.split('\n') : []);
        
        stackLines.slice(0, 3).forEach(frame => {
          if (typeof frame === 'string') {
            console.log(`  - ${frame}`);
          } else if (frame && typeof frame === 'object') {
            console.log(`  - ${frame.functionName || 'anonymous'} (${frame.url || 'unknown'}:${frame.lineNumber || '?'}:${frame.columnNumber || '?'})`);
          }
        });
        
        if (stackLines.length > 3) {
          console.log(`  ... and ${stackLines.length - 3} more`);
        }
      }
    });
  }
  
  // Show Next.js specific errors
  if (nextJsErrors.length > 0) {
    console.log('\n===== NEXT.JS ERRORS =====');
    nextJsErrors.forEach((error, i) => {
      if (i >= 5) {
        if (i === 5) console.log(`... and ${nextJsErrors.length - 5} more`);
        return;
      }
      
      console.log(`\n[${i+1}] ${(error.message && typeof error.message === 'string') ? 
        error.message.split('\n')[0] : 'Unknown Next.js error'}`);
    });
  }

  // Show recommendations based on errors
  console.log('\n===== RECOMMENDATIONS =====');
  
  if (reactErrors.length > 0) {
    console.log('✓ React hydration issues found. Check for:');
    console.log('  - Components rendering different content on server vs client');
    console.log('  - Missing Suspense boundaries around dynamic data');
    console.log('  - Components using browser-only APIs without checks');
    
    // Check for specific patterns in React errors
    const suspenseMissing = reactErrors.some(e => 
      e.message && typeof e.message === 'string' && e.message.includes('Suspense'));
    
    if (suspenseMissing) {
      console.log('\n✓ Missing Suspense boundaries detected:');
      console.log('  - Wrap components using useSearchParams, useSWR, or data fetching in <Suspense>');
      console.log('  - Consider adding missingSuspenseWithCSRBailout: false to next.config.js');
    }
  }
  
  const networkErrors = errors.filter(e => 
    e.message && typeof e.message === 'string' && (
      e.message.includes('net::') || 
      e.message.includes('Failed to fetch') ||
      e.message.includes('404') ||
      e.message.includes('Not Found')
    )
  );
  
  if (networkErrors.length > 0) {
    console.log('\n✓ Network errors found. Check for:');
    console.log('  - API endpoints with incorrect URLs');
    console.log('  - CORS issues with API requests');
    console.log('  - Resources with wrong paths in static export');
    console.log('  - Check basePath and assetPrefix in next.config.js');
  }
  
  const chunkErrors = errors.filter(e => 
    e.message && typeof e.message === 'string' && (
      e.message.includes('chunk') || 
      e.message.includes('module') ||
      e.message.includes('failed to load')
    )
  );
  
  if (chunkErrors.length > 0) {
    console.log('\n✓ Chunk loading errors found. Check for:');
    console.log('  - Incorrect basePath or assetPrefix configuration');
    console.log('  - Missing or incorrectly served JavaScript files');
    console.log('  - Consider adding a .nojekyll file to GitHub Pages');
  }
  
  // Export error report for later use
  const reportFile = path.join(process.cwd(), 'browser-error-report.json');
  fs.writeFileSync(reportFile, JSON.stringify({
    summary: {
      total: logs.length,
      errors: errors.length,
      warnings: warnings.length,
      reactErrors: reactErrors.length,
      networkErrors: networkErrors.length,
      chunkErrors: chunkErrors.length
    },
    commonErrors: sortedPatterns,
    reactErrors: reactErrors.slice(0, 10).map(e => ({
      message: e.message,
      stack: e.stackTrace
    })),
    timestamp: new Date().toISOString()
  }, null, 2));
  
  console.log(`\nDetailed report saved to ${reportFile}`);
  
} catch (error) {
  console.error('Error processing log file:', error);
  process.exit(1);
} 