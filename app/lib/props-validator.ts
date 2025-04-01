/**
 * Validates component props and logs warnings for potential issues
 * This helps prevent React Error #130 by detecting problematic props early
 */
export function validateProps(
  componentName: string, 
  props: Record<string, any>,
  expectedTypes: Record<string, string | string[]>
) {
  const issues: string[] = [];
  
  Object.entries(expectedTypes).forEach(([propName, expectedType]) => {
    const propValue = props[propName];
    const types = Array.isArray(expectedType) ? expectedType : [expectedType];
    
    // Check for undefined required props
    if (propValue === undefined) {
      issues.push(`Missing required prop: ${propName}`);
      return;
    }
    
    // Check type
    const actualType = typeof propValue;
    if (!types.includes(actualType)) {
      issues.push(`Prop ${propName} has wrong type: expected ${types.join('|')}, got ${actualType}`);
    }
    
    // Specific checks for objects that might be accidentally passed as strings
    if (actualType === 'object' && propValue !== null && !Array.isArray(propValue)) {
      if (propValue.toString === Object.prototype.toString) {
        issues.push(`Prop ${propName} is an object that will cause toString issues when rendered directly`);
      }
    }
    
    // Check for Date objects
    if (propValue instanceof Date) {
      issues.push(`Prop ${propName} is a Date object which should be formatted before rendering`);
    }
  });
  
  if (issues.length > 0) {
    console.warn(`[${componentName}] Props validation issues:`, issues);
    return { valid: false, issues };
  }
  
  return { valid: true, issues: [] };
} 