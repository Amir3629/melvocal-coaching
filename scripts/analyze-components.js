const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Component analyzer that detects potential issues in React components
 * that could cause problems in static exports
 */

console.log('Starting component analysis...');

// Find all client components
const clientComponents = glob.sync('app/**/*.tsx', {
  ignore: ['app/**/node_modules/**', 'app/**/*.server.tsx']
}).filter(file => {
  const content = fs.readFileSync(file, 'utf8');
  return content.includes("'use client'") || content.includes('"use client"');
});

console.log(`Found ${clientComponents.length} client components`);

// Risk patterns to look for
const riskPatterns = [
  { 
    pattern: /useSearchParams/, 
    risk: 'high', 
    issue: 'useSearchParams must be wrapped in Suspense',
    fix: 'Wrap component in <SuspenseWrapper> or add missingSuspenseWithCSRBailout:false in next.config.js'
  },
  { 
    pattern: /useRouter/, 
    risk: 'medium', 
    issue: 'Client-side navigation in static export',
    fix: 'Consider using <Link> instead or wrap in useSafeRouter'
  },
  { 
    pattern: /new Date\(\)/, 
    risk: 'low', 
    issue: 'Direct date instantiation',
    fix: 'Format dates before rendering using formatters.ts'
  },
  { 
    pattern: /JSON\.stringify/, 
    risk: 'medium', 
    issue: 'JSON stringification may cause hydration issues',
    fix: 'Use safeJsonStringify from formatters.ts'
  },
  { 
    pattern: /\{[^{}]*?\}(?!\s*\)|:|\?|\[)/, 
    risk: 'medium', 
    issue: 'Potential direct object rendering',
    fix: 'Use ensureString() for any potentially non-string values'
  },
  { 
    pattern: /\[[^\[\]]*?\](?!\s*\)|:|\?)/, 
    risk: 'medium', 
    issue: 'Potential direct array rendering',
    fix: 'Use ensureString() or array.join()'
  },
  {
    pattern: /useState.*?\(.*?\{.*?\}.*?\)/s,
    risk: 'medium',
    issue: 'Complex object in useState initial value',
    fix: 'Consider using useMemo for complex objects'
  },
  {
    pattern: /<(?:div|span|p|h[1-6])(?![^>]*>)(?:[^<](?!<\/(?:div|span|p|h[1-6])))*?\{(?![{])/,
    risk: 'high',
    issue: 'Potential object interpolation in JSX',
    fix: 'Use <SafeText> or ensureString() for object values'
  }
];

// Analyze components
const results = clientComponents.map(file => {
  const content = fs.readFileSync(file, 'utf8');
  const issues = [];
  
  riskPatterns.forEach(({ pattern, risk, issue, fix }) => {
    if (pattern.test(content)) {
      // Get line numbers for matches
      const lines = content.split('\n');
      const matchingLines = [];
      
      lines.forEach((line, i) => {
        if (pattern.test(line)) {
          matchingLines.push(i + 1);
        }
      });
      
      issues.push({ 
        risk, 
        issue, 
        fix,
        lines: matchingLines.slice(0, 3) // Show at most 3 line numbers
      });
    }
  });
  
  // Get component names
  const componentNames = [];
  const componentRegex = /(?:function|const)\s+([A-Z][A-Za-z0-9]*)/g;
  let match;
  
  while ((match = componentRegex.exec(content)) !== null) {
    componentNames.push(match[1]);
  }
  
  return {
    file,
    components: componentNames,
    issues,
    riskLevel: issues.reduce((highest, { risk }) => {
      if (risk === 'high') return 'high';
      if (risk === 'medium' && highest !== 'high') return 'medium';
      return highest || 'low';
    }, null)
  };
}).filter(result => result.issues.length > 0);

// Sort by risk level
results.sort((a, b) => {
  const riskOrder = { high: 0, medium: 1, low: 2, null: 3 };
  return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
});

// Generate report
if (results.length > 0) {
  console.log('\n=== Component Analysis Results ===\n');
  
  results.forEach(result => {
    console.log(`📄 ${result.file} (${result.riskLevel} risk)`);
    console.log(`   Components: ${result.components.join(', ')}`);
    
    result.issues.forEach(issue => {
      const riskIcon = issue.risk === 'high' ? '🔴' : issue.risk === 'medium' ? '🟠' : '🟡';
      console.log(`   ${riskIcon} ${issue.issue}`);
      console.log(`     Lines: ${issue.lines.join(', ')}`);
      console.log(`     Fix: ${issue.fix}`);
    });
    
    console.log('');
  });
  
  console.log(`Analysis complete. Found issues in ${results.length} components.`);
  console.log(`High risk: ${results.filter(r => r.riskLevel === 'high').length}`);
  console.log(`Medium risk: ${results.filter(r => r.riskLevel === 'medium').length}`);
  console.log(`Low risk: ${results.filter(r => r.riskLevel === 'low').length}\n`);
  
  // Save report to file
  const reportPath = path.join(process.cwd(), 'component-analysis.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`Report saved to ${reportPath}`);
} else {
  console.log('\n✅ No issues found in components!');
}

// Exit with error code if high risk issues found
if (results.some(r => r.riskLevel === 'high')) {
  console.log('\n⚠️ High risk issues found. Consider fixing before deployment.');
  // Uncomment to make CI fail on high-risk issues
  // process.exit(1);
} else {
  console.log('\n✓ No high-risk issues detected.');
} 