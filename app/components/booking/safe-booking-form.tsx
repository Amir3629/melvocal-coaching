"use client"

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { ErrorBoundary } from '../simple-error-boundary'

// Dynamically import the BookingForm component with client-side rendering only
const BookingForm = dynamic(() => import('./booking-form'), {
  ssr: false,
  loading: () => <div className="animate-pulse p-4">Loading booking form...</div>
})

// Fallback component to show when there's an error with the booking form
const BookingFormFallback = () => (
  <div className="p-4 border border-red-300 rounded-lg bg-red-50">
    <h3 className="text-lg font-medium text-red-800">Booking form could not be loaded</h3>
    <p className="mt-2 text-sm text-red-700">
      Please try refreshing the page or contact support if the issue persists.
    </p>
    <button 
      onClick={() => window.location.reload()} 
      className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      Refresh Page
    </button>
  </div>
)

// SafeBookingForm is a wrapper around BookingForm that:
// 1. Ensures it's only rendered on the client side with dynamic import
// 2. Wraps it in a Suspense boundary for useSearchParams()
// 3. Wraps it in an ErrorBoundary to prevent crashes
export default function SafeBookingForm() {
  return (
    <ErrorBoundary fallback={<BookingFormFallback />}>
      <Suspense fallback={<div className="animate-pulse p-4">Loading booking form...</div>}>
        <BookingForm />
      </Suspense>
    </ErrorBoundary>
  )
} 