import { NextResponse } from 'next/server';

// Using the new route segment config format for Next.js App Router
export const runtime = 'edge';
export const dynamic = 'force-static';

export async function POST(request: Request) {
  try {
    const { amount, currency } = await request.json();

    // For static export (GitHub Pages), return a mock successful response
    // Edge runtime or production environment - always return mock data
    return NextResponse.json({
      id: 'MOCK-ORDER-ID-12345',
      status: 'CREATED',
      links: [
        {
          href: 'https://www.sandbox.paypal.com/checkoutnow?token=MOCK-ORDER-ID-12345',
          rel: 'approve',
          method: 'GET'
        }
      ]
    });

    // The code below will never execute in Edge runtime or static export
    /* 
    const response = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount,
            },
            description: 'Vocal Coaching Deposit',
          },
        ],
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data);
    } else {
      throw new Error('Failed to create PayPal order');
    }
    */
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json(
      { error: 'Failed to create PayPal order' },
      { status: 500 }
    );
  }
} 