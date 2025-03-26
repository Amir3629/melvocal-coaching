import PaymentForm from "./payment-form"

// This generates the static paths at build time
export function generateStaticParams() {
  return [{ orderId: "DEMO" }]
}

export default function PaymentPage({ params }: { params: { orderId: string } }) {
  return <PaymentForm orderId={params.orderId} />
} 