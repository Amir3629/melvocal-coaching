"use client";

import React from 'react';
import { useDebug } from '@/hooks/use-debug';

export default function DebugUI() {
  const { isDebugMode } = useDebug();
  
  if (!isDebugMode) return null;
  
  return (
    <div className="fixed bottom-0 left-0 w-full bg-black text-white text-xs p-1 z-[9999] flex items-center justify-between">
      <span>Debug Mode Active (press 'd' 3 times to toggle)</span>
      <span className="text-yellow-300">React Error #130 Debug</span>
    </div>
  );
} 