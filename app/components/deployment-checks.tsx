"use client";

import React, { useEffect, useState } from 'react';
import { useDebug } from '../hooks/use-debug';

interface DeploymentInfo {
  buildId: string;
  nodeEnv: string;
  buildTime: string;
  gitCommit: string;
  nextVersion: string;
  isStaticExport: boolean;
}

/**
 * Component to verify deployment settings in debug mode
 */
export default function DeploymentChecks() {
  const { isDebugMode } = useDebug();
  const [info, setInfo] = useState<DeploymentInfo | null>(null);

  useEffect(() => {
    if (!isDebugMode) return;

    // Only load deployment info in debug mode
    const loadDeploymentInfo = async () => {
      try {
        // In a real app, this might fetch from an API endpoint
        // that returns build/deployment information
        setInfo({
          buildId: process.env.NEXT_PUBLIC_BUILD_ID || 'unknown',
          nodeEnv: process.env.NODE_ENV || 'unknown',
          buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString(),
          gitCommit: process.env.NEXT_PUBLIC_GIT_COMMIT || 'unknown',
          nextVersion: process.env.NEXT_PUBLIC_NEXT_VERSION || 'unknown',
          isStaticExport: process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true'
        });
      } catch (err) {
        console.error('Failed to load deployment info:', err);
      }
    };

    loadDeploymentInfo();
  }, [isDebugMode]);

  if (!isDebugMode || !info) return null;

  return (
    <div className="fixed top-0 right-0 m-4 p-3 bg-black/80 backdrop-blur border border-yellow-500/50 text-yellow-500 rounded shadow-lg z-[9999] text-xs font-mono">
      <h3 className="font-bold mb-2">Deployment Info</h3>
      <ul className="space-y-1">
        <li>Environment: <span className="text-white">{info.nodeEnv}</span></li>
        <li>Static Export: <span className="text-white">{info.isStaticExport ? 'Yes' : 'No'}</span></li>
        <li>Build Time: <span className="text-white">{info.buildTime}</span></li>
        <li>Git Commit: <span className="text-white">{info.gitCommit.substring(0, 7)}</span></li>
        <li>Next.js: <span className="text-white">{info.nextVersion}</span></li>
      </ul>
    </div>
  );
} 