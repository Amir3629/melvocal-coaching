import React from 'react'
import BookingForm from '../components/booking/booking-form'

export const metadata = {
  title: 'Booking | Melanie Becker Vocal Coaching',
  description: 'Book a jazz performance, vocal coaching session, or workshop with Melanie Becker.',
}

export default function BookingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Booking
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Buchen Sie einen Live-Auftritt, eine Coaching-Session oder einen Workshop.
          Füllen Sie das Formular aus und wir melden uns bei Ihnen.
        </p>
      </div>
      
      <BookingForm />
    </div>
  )
} 