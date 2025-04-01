import React from 'react'
import SafePaymentForm from '@/app/components/payment/safe-payment-form'

// This function tells Next.js which specific dynamic routes to generate at build time
export function generateStaticParams() {
  return [
    { orderId: 'DEMO' }
  ]
}

export default function PaymentPage({ params }: { params: { orderId: string } }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Complete Your Payment</h1>
      <SafePaymentForm orderId={params.orderId} />
    </div>
  )
} 