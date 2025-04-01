import { NextResponse } from 'next/server';

// Using the new route segment config format for Next.js App Router
export const runtime = 'edge';
export const dynamic = 'force-static';

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    // For static export (GitHub Pages), return a mock successful response
    // Edge runtime or production environment - always return mock data
    return NextResponse.json({
      id: orderId || 'MOCK-ORDER-ID-12345',
      status: 'COMPLETED',
      payment_source: {
        paypal: {
          email_address: 'sb-mock@business.example.com',
          account_id: 'MOCK-ACCOUNT-ID-12345',
          name: {
            given_name: 'John',
            surname: 'Doe'
          }
        }
      },
      purchase_units: [
        {
          reference_id: 'default',
          shipping: {
            name: {
              full_name: 'John Doe'
            },
            address: {
              address_line_1: 'Mock Street 123',
              admin_area_2: 'Mock City',
              admin_area_1: 'MO',
              postal_code: '12345',
              country_code: 'DE'
            }
          },
          payments: {
            captures: [
              {
                id: 'MOCK-CAPTURE-ID-12345',
                status: 'COMPLETED',
                amount: {
                  currency_code: 'EUR',
                  value: '50.00'
                }
              }
            ]
          }
        }
      ]
    });

    // The code below will never execute in Edge runtime or static export
    /* 
    const response = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data);
    } else {
      throw new Error('Failed to capture PayPal order');
    }
    */
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    return NextResponse.json(
      { error: 'Failed to capture PayPal order' },
      { status: 500 }
    );
  }
} 