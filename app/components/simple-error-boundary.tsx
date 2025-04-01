"use client"

import React from 'react'

export function ErrorBoundary({ children, fallback }) {
  return (
    <div>
      {children}
    </div>
  )
} 