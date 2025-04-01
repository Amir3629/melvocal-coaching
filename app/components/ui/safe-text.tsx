"use client";

import React from 'react';
import { ensureString } from '@/lib/formatters';

interface SafeTextProps {
  value: any;
  className?: string;
  fallback?: string;
  tag?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/**
 * Component that safely displays text values, converting objects to strings
 * Prevents React Error #130 by ensuring string rendering
 */
const SafeText: React.FC<SafeTextProps> = ({ 
  value, 
  className = '', 
  fallback = '', 
  tag = 'span' 
}) => {
  const safeValue = ensureString(value) || fallback;
  
  // Use the appropriate HTML element based on the tag prop
  switch (tag) {
    case 'div':
      return <div className={className}>{safeValue}</div>;
    case 'p':
      return <p className={className}>{safeValue}</p>;
    case 'h1':
      return <h1 className={className}>{safeValue}</h1>;
    case 'h2':
      return <h2 className={className}>{safeValue}</h2>;
    case 'h3':
      return <h3 className={className}>{safeValue}</h3>;
    case 'h4':
      return <h4 className={className}>{safeValue}</h4>;
    case 'h5':
      return <h5 className={className}>{safeValue}</h5>;
    case 'h6':
      return <h6 className={className}>{safeValue}</h6>;
    default:
      return <span className={className}>{safeValue}</span>;
  }
};

export default SafeText; 