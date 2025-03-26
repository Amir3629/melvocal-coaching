import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    const response = await fetch(
      `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      const payment = {
        id: data.id,
        status: data.status,
        amount: data.purchase_units[0].payments.captures[0].amount.value,
        currency: data.purchase_units[0].payments.captures[0].amount.currency_code,
        createTime: data.create_time,
        payerEmail: data.payer.email_address,
      };

      return NextResponse.json(payment);
    } else {
      throw new Error('Failed to capture PayPal payment');
    }
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    return NextResponse.json(
      { error: 'Failed to capture PayPal payment' },
      { status: 500 }
    );
  }
} 