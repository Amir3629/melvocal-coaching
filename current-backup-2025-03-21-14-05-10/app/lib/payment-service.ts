export interface PaymentDetails {
  id: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  amount: string;
  currency: string;
  createTime: string;
  payerEmail: string;
}

export async function createPayPalOrder() {
  try {
    const response = await fetch('/api/create-paypal-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: '30.00', // Fixed deposit amount
        currency: 'EUR',
      }),
    });

    const order = await response.json();
    return order;
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    throw error;
  }
}

export async function capturePayPalOrder(orderId: string): Promise<PaymentDetails> {
  try {
    const response = await fetch('/api/capture-paypal-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
      }),
    });

    const payment = await response.json();
    return payment;
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    throw error;
  }
} 