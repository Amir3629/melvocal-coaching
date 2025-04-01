import React from 'react'
import SafeBookingForm from '../components/booking/safe-booking-form'

export const metadata = {
  title: 'Book Your Vocal Coaching Session',
  description: 'Schedule a personalized vocal coaching session with our experienced coaches.'
}

export default function BookingPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Book Your Session</h1>
      <SafeBookingForm />
    </div>
  )
} 