"use client"

import TestNav from "@/app/components/test-nav"
import { LanguageProvider } from "@/app/components/language-switcher"

export default function TestPage() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#0A0A0A]">
        <TestNav />
        <div className="container mx-auto px-4 pt-32">
          <h1 className="text-4xl text-white">Test Page</h1>
          <p className="text-gray-300 mt-4">
            This page is for testing the navigation component with language support.
          </p>
        </div>
      </div>
    </LanguageProvider>
  )
} 