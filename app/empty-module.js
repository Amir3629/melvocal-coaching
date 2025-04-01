// Empty module for webpack aliases
module.exports = {
  useDebug: () => ({ isDebugMode: false, toggleDebugMode: () => {}, logPropIssues: () => {} }),
  useRouterDebug: () => ({ safePathname: '', safeParams: {} }),
  createSafeParams: () => ({}),
  createSafeSearchParams: () => ({}),
  ensureString: (val) => String(val || ''),
  isRouterObject: () => false,
  warnIfRouterObject: () => {},
  default: {
    useDebug: () => ({ isDebugMode: false }),
  }
}; 