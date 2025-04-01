# Next.js Static Site Debugging Tools

This document provides instructions for using the debugging and diagnostic tools for the Next.js static site deployment.

## Table of Contents

1. [Available Tools](#available-tools)
2. [Fixing Windows Environment Variables](#fixing-windows-environment-variables)
3. [Component Analysis](#component-analysis)
4. [Debug Builds](#debug-builds)
5. [Browser Console Analysis](#browser-console-analysis)
6. [Runtime Debugging](#runtime-debugging)
7. [Common Issues and Solutions](#common-issues-and-solutions)

## Available Tools

We've implemented several diagnostic tools to help identify and fix issues with Next.js static exports:

- **Component Analysis**: Scans your codebase for components with potential issues
- **Debug Build Mode**: Shows detailed build information and errors
- **Browser Console Analyzer**: Analyzes browser console logs for patterns and solutions
- **Runtime Monitor**: Real-time debugging in the browser
- **Batch Script**: Easy Windows command execution

## Fixing Windows Environment Variables

If you're on Windows, the scripts in `package.json` have been updated to use the Windows syntax for environment variables:

```json
"analyze:debug": "set DEBUG=* && node scripts/analyze-components.js",
"build:debug": "set ANALYZE=true && set NODE_OPTIONS=--max-old-space-size=4096 && next build",
"build:trace": "set TRACE=true && set NEXT_TELEMETRY_DEBUG=1 && next build",
```

You can run these scripts directly, or use the included `debug-tools.bat` batch file.

## Component Analysis

Detect components with potential static export issues:

```bash
npm run analyze
```

Or using the batch file:

```bash
debug-tools.bat analyze
```

This will generate a report of components with potential issues, including:
- Components using `useSearchParams` without Suspense boundaries
- Direct object rendering in JSX
- Potential hydration issues
- And more

## Debug Builds

For a more detailed build process with additional diagnostic information:

```bash
npm run build:debug
```

Or using the batch file:

```bash
debug-tools.bat build
```

For a complete diagnostic process (analysis + debug build):

```bash
npm run debug:static
```

Or:

```bash
debug-tools.bat full
```

## Browser Console Analysis

To analyze browser console logs for patterns and solutions:

1. In Chrome DevTools, right-click in the Console tab
2. Select "Save as..." and save the console logs
3. Run the analysis tool:

```bash
npm run debug:browser -- path/to/console-logs.json
```

Or using the batch file:

```bash
debug-tools.bat browser path/to/console-logs.json
```

The analyzer will output:
- Common error patterns
- React-specific errors
- Next.js-specific errors
- Recommendations for fixes

## Runtime Debugging

The Runtime Monitor is a component that can be activated on any page by adding `?debug=true` to the URL.

For example:
```
https://amir3629.github.io/melvocal-coaching/?debug=true
```

Features:
- Real-time error tracking
- Memory usage monitoring
- Build information
- Downloadable error logs

The monitor also saves errors to `localStorage` for later analysis, even if the page crashes.

## Common Issues and Solutions

### 1. useSearchParams Error

**Error**: `useSearchParams() should be wrapped in a suspense boundary`

**Solution**:
- Wrap components using `useSearchParams` in a `<Suspense>` boundary
- Use our custom `useSafeSearchParams` hook from `lib/router-safety.ts`
- Set `missingSuspenseWithCSRBailout: false` in `next.config.js`

### 2. Hydration Errors

**Error**: `Hydration failed because the initial UI does not match what was rendered on the server`

**Solution**:
- Make sure components render the same content on server and client
- Use `ensureString()` from `lib/formatters.ts` for potentially non-string values
- Wrap dynamic content with `<SafeText>` component

### 3. Chunk Loading Errors

**Error**: `Failed to load resource: net::ERR_FAILED` for JavaScript files

**Solution**:
- Verify `basePath` and `assetPrefix` in `next.config.js`
- Ensure `.nojekyll` file exists in the root of the GitHub Pages branch
- Check GitHub Pages deployment settings

### 4. 404 Errors on Page Reload

**Error**: Getting 404 when refreshing a page on GitHub Pages

**Solution**:
- Use `trailingSlash: true` in `next.config.js`
- Add fallback 404.html that redirects to index.html
- Use `Link` components instead of `<a>` tags for internal navigation

---

For more complex issues, use the Runtime Monitor with `?debug=true` added to the URL, then download the logs for further analysis with the Browser Console Analyzer.

If you're still encountering issues, run a complete diagnostic with `debug-tools.bat full` and share the results. 