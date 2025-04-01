"use client";

import React, { useState, useEffect } from 'react';
import { useDebug } from '../hooks/use-debug';

/**
 * Debug UI component that shows debugging information
 * Only appears in development mode or when debug mode is enabled
 */
export function DebugUI() {
  const { isDebugMode } = useDebug('DebugUI');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [eventLog, setEventLog] = useState<Array<{type: string, message: string, timestamp: Date}>>([]);
  const [componentRenders, setComponentRenders] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Array<{message: string, stack?: string}>>([]);
  
  // Listen for custom debug events
  useEffect(() => {
    if (!isDebugMode) return;
    
    const handleDebugEvent = (event: CustomEvent) => {
      setEventLog(prev => [
        ...prev, 
        { 
          type: event.detail.type, 
          message: event.detail.message,
          timestamp: new Date()
        }
      ]);
      
      // Track component renders
      if (event.detail.type === 'component-render') {
        setComponentRenders(prev => ({
          ...prev,
          [event.detail.component]: (prev[event.detail.component] || 0) + 1
        }));
      }
      
      // Track errors
      if (event.detail.type === 'error') {
        setErrors(prev => [...prev, { 
          message: event.detail.message,
          stack: event.detail.stack
        }]);
      }
    };
    
    window.addEventListener('debug-event' as any, handleDebugEvent);
    return () => window.removeEventListener('debug-event' as any, handleDebugEvent);
  }, [isDebugMode]);
  
  if (!isDebugMode) return null;
  
  return (
    <div 
      className="fixed bottom-0 right-0 z-50 bg-black bg-opacity-80 text-white p-3 max-w-md rounded-tl-lg shadow-lg"
      style={{ maxHeight: isCollapsed ? '40px' : '80vh', overflow: 'hidden', transition: 'all 0.3s ease' }}
    >
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsCollapsed(prev => !prev)}>
        <h3 className="font-mono text-xs">Debug Console {errors.length > 0 ? `(${errors.length} errors)` : ''}</h3>
        <button className="text-xs ml-2 bg-gray-700 px-2 py-0.5 rounded">
          {isCollapsed ? 'Show' : 'Hide'}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="mt-3 overflow-auto" style={{ maxHeight: 'calc(80vh - 40px)' }}>
          <div className="mb-4">
            <h4 className="text-xs uppercase text-gray-400 border-b border-gray-700 pb-1 mb-2">Component Renders</h4>
            <ul className="text-xs">
              {Object.entries(componentRenders).map(([component, count]) => (
                <li key={component} className="mb-1 flex justify-between">
                  <span className="font-mono">{component}</span>
                  <span className="bg-blue-900 px-1 rounded">{count}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {errors.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs uppercase text-red-400 border-b border-gray-700 pb-1 mb-2">Errors</h4>
              <ul className="text-xs">
                {errors.map((error, index) => (
                  <li key={index} className="mb-2 bg-red-900 bg-opacity-30 p-2 rounded">
                    <div className="font-semibold">{error.message}</div>
                    {error.stack && (
                      <details>
                        <summary className="cursor-pointer text-xs text-gray-400 mt-1">Stack trace</summary>
                        <pre className="mt-1 text-xs whitespace-pre-wrap bg-black bg-opacity-50 p-1 rounded">
                          {error.stack}
                        </pre>
                      </details>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div>
            <h4 className="text-xs uppercase text-gray-400 border-b border-gray-700 pb-1 mb-2">Event Log</h4>
            <ul className="text-xs">
              {eventLog.map((event, index) => (
                <li key={index} className="mb-1 opacity-80 hover:opacity-100">
                  <span className="text-gray-500">{event.timestamp.toISOString().substr(11, 8)}</span>{' '}
                  <span className={`px-1 rounded ${getEventTypeColor(event.type)}`}>{event.type}</span>{' '}
                  <span>{event.message}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function getEventTypeColor(type: string): string {
  switch (type) {
    case 'error': return 'bg-red-800';
    case 'warn': return 'bg-yellow-800';
    case 'component-render': return 'bg-blue-800';
    case 'router': return 'bg-purple-800';
    case 'api': return 'bg-green-800';
    default: return 'bg-gray-800';
  }
}

export default DebugUI; 