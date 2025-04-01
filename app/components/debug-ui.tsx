"use client";

import React from 'react';
import { useDebug } from '../hooks/use-debug';
import { X } from 'lucide-react';

/**
 * Debug UI overlay that displays when debug mode is active
 */
export default function DebugUI() {
  const { isDebugMode, toggleDebugMode } = useDebug();
  
  if (!isDebugMode) return null;
  
  return (
    <div className="fixed bottom-0 right-0 z-[9999] p-4 font-mono text-xs">
      <div className="bg-black border border-yellow-500 text-yellow-500 p-3 rounded shadow-lg max-w-xs">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">Debug Mode</h3>
          <button 
            onClick={toggleDebugMode}
            className="text-yellow-700 hover:text-yellow-500"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="space-y-2">
          <p>React debugging enabled</p>
          <div className="border-t border-yellow-900 pt-2">
            <p>🛠️ Developer Tools:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Add <code>?debug=true</code> to URL</li>
              <li>Press <code>d</code> key 3 times</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 