import PaymentForm from "./payment-form"

// This function tells Next.js which specific dynamic routes to generate at build time
export function generateStaticParams() {
  return [
    { orderId: 'DEMO' }
  ]
}

export default function PaymentPage({ params }: { params: { orderId: string } }) {
  return <PaymentForm orderId={params.orderId} />
} 