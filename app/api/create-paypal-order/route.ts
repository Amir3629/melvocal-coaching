import { NextResponse } from 'next/server';

// Adding static export configuration for GitHub Pages compatibility
export const config = {
  api: {
    bodyParser: true,
  },
};

export async function POST(request: Request) {
  try {
    const { amount, currency } = await request.json();

    // For static export (GitHub Pages), return a mock successful response
    if (process.env.GITHUB_PAGES === 'true' || process.env.NODE_ENV === 'production') {
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
    }

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
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json(
      { error: 'Failed to create PayPal order' },
      { status: 500 }
    );
  }
} 