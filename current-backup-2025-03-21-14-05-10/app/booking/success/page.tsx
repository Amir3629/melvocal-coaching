import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { CheckCircle, Calendar, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Booking Successful | Melanie Becker Vocal Coaching',
  description: 'Your booking request has been successfully submitted.',
}

export default function BookingSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[#C8A97E]/20 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-[#C8A97E]" />
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Booking Successful!
        </h1>
        
        <p className="text-xl text-gray-300 mb-8">
          Thank you for your booking request. We have received your information and will contact you shortly.
        </p>
        
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-[#C8A97E] mr-2" />
            <h2 className="text-xl font-semibold text-white">Next Steps</h2>
          </div>
          
          <ul className="text-left space-y-4 text-gray-300">
            <li className="flex items-start">
              <span className="text-[#C8A97E] font-bold mr-2">1.</span>
              <span>We will review your booking request within 24-48 hours.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#C8A97E] font-bold mr-2">2.</span>
              <span>You will receive an email confirmation with details about your booking.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#C8A97E] font-bold mr-2">3.</span>
              <span>We may contact you by phone to discuss specific requirements or answer any questions.</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#C8A97E] font-bold mr-2">4.</span>
              <span>Once confirmed, you will receive a calendar invitation for your appointment.</span>
            </li>
          </ul>
        </div>
        
        <Link 
          href="/"
          className="inline-flex items-center px-6 py-3 bg-[#C8A97E] text-black font-medium rounded-lg hover:bg-[#D4AF37] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Return to Homepage
        </Link>
      </div>
    </div>
  )
} 