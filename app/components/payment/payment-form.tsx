"use client"

import React, { useState } from 'react'

interface PaymentFormProps {
  orderId: string
}

export default function PaymentForm({ orderId }: PaymentFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const isDemoMode = orderId === 'DEMO'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isDemoMode) {
      setLoading(true)
      // Simulate API call in demo mode
      setTimeout(() => {
        setSuccess(true)
        setLoading(false)
      }, 1500)
      return
    }

    try {
      setLoading(true)
      setError('')
      
      // In a real implementation, you would call your payment API here
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          // Add other form data here
        }),
      })

      if (!response.ok) {
        throw new Error('Payment processing failed')
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed')
      console.error('Payment error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            {isDemoMode 
              ? 'This is a demo payment confirmation. In a real scenario, you would receive details about your booking.'
              : 'Thank you for your payment. You will receive a confirmation email shortly.'}
          </p>
          <a 
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {isDemoMode ? 'Demo Payment' : `Payment for Order #${orderId}`}
      </h2>
      
      {isDemoMode && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-md">
          <p className="text-sm">
            <strong>Demo Mode:</strong> This is a simulation. No actual payment will be processed.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
            Name on Card
          </label>
          <input
            type="text"
            id="cardName"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
            required
            defaultValue={isDemoMode ? "Demo User" : ""}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="4242 4242 4242 4242"
            required
            defaultValue={isDemoMode ? "4242 4242 4242 4242" : ""}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="text"
              id="expiry"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="MM/YY"
              required
              defaultValue={isDemoMode ? "12/25" : ""}
            />
          </div>
          <div>
            <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
              CVC
            </label>
            <input
              type="text"
              id="cvc"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123"
              required
              defaultValue={isDemoMode ? "123" : ""}
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-medium 
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
          disabled={loading}
        >
          {loading ? 'Processing...' : `Pay ${isDemoMode ? '$99.99 (Demo)' : '$99.99'}`}
        </button>
      </form>
    </div>
  )
} 