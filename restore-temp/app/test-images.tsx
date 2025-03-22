"use client"

import Image from "next/image"

// Test different image loading approaches
export default function TestImages() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl mb-8">Image Loading Test Page</h1>

      {/* Test 1: Direct path with next/image */}
      <section className="mb-12">
        <h2 className="text-xl mb-4">Test 1: Direct path with next/image</h2>
        <div className="relative w-48 h-48 border border-white">
          <Image
            src="/images/gallery/performance1.jpg"
            alt="Test 1"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Test 2: Absolute URL with next/image */}
      <section className="mb-12">
        <h2 className="text-xl mb-4">Test 2: Absolute URL with next/image</h2>
        <div className="relative w-48 h-48 border border-white">
          <Image
            src="https://amir3629.github.io/vocal-coaching-website/images/gallery/performance1.jpg"
            alt="Test 2"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Test 3: Regular img tag */}
      <section className="mb-12">
        <h2 className="text-xl mb-4">Test 3: Regular img tag</h2>
        <img
          src="/images/gallery/performance1.jpg"
          alt="Test 3"
          className="w-48 h-48 object-cover border border-white"
        />
      </section>

      {/* Test 4: SVG with next/image */}
      <section className="mb-12">
        <h2 className="text-xl mb-4">Test 4: SVG with next/image</h2>
        <div className="relative w-48 h-48 border border-white">
          <Image
            src="/images/collaborations/bflat.svg"
            alt="Test 4"
            fill
            className="object-contain"
          />
        </div>
      </section>

      {/* Test 5: SVG with img tag */}
      <section className="mb-12">
        <h2 className="text-xl mb-4">Test 5: SVG with img tag</h2>
        <img
          src="/images/collaborations/bflat.svg"
          alt="Test 5"
          className="w-48 h-48 object-contain border border-white"
        />
      </section>

      {/* Debug Info */}
      <section className="mt-12 p-4 bg-gray-900 rounded">
        <h2 className="text-xl mb-4">Debug Information</h2>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify({
            NODE_ENV: process.env.NODE_ENV,
            BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
            ROOT_URL: process.env.NEXT_PUBLIC_ROOT_URL
          }, null, 2)}
        </pre>
      </section>
    </div>
  )
} 