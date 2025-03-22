"use client"

import { useEffect, useState } from "react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { useRouter } from "next/navigation"

interface PaymentFormProps {
  orderId: string
}

export default function PaymentForm({ orderId }: PaymentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  const handlePaymentSuccess = async (data: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/capture-paypal-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: data.orderID,
        }),
      })

      if (!response.ok) {
        throw new Error("Payment capture failed")
      }

      router.push("/booking/success")
    } catch (error) {
      console.error("Payment error:", error)
      router.push("/booking/error")
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1A1A1A] rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-white text-center">Zahlung bestätigen</h1>
        <p className="text-gray-400 text-center">
          Bitte bestätigen Sie die Zahlung von 30€ als Anzahlung für Ihre Buchung.
        </p>
        
        <PayPalScriptProvider options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
          currency: "EUR"
        }}>
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(data, actions) => {
              return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                  {
                    amount: {
                      value: "30.00",
                      currency_code: "EUR"
                    },
                    description: "Anzahlung für Gesangsunterricht"
                  }
                ]
              })
            }}
            onApprove={async (data, actions) => {
              if (actions.order) {
                const order = await actions.order.capture()
                await handlePaymentSuccess(order)
              }
            }}
          />
        </PayPalScriptProvider>

        <div className="mt-6 text-sm text-gray-400 text-center">
          <p>
            Nach erfolgreicher Zahlung erhalten Sie eine Bestätigungs-E-Mail mit
            allen Details zu Ihrem Termin.
          </p>
        </div>
      </div>
    </div>
  )
} 