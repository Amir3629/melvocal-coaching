import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

interface EmailParams {
  name: string;
  email: string;
  message: string;
  type?: 'contact' | 'booking';
  service?: string;
  date?: string;
  time?: string;
}

export const sendEmail = async (params: EmailParams) => {
  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: 'info@melanie-wainwright.de',
        from_name: params.name,
        from_email: params.email,
        message: params.message,
        type: params.type || 'contact',
        service: params.service || '',
        date: params.date || '',
        time: params.time || '',
      },
      EMAILJS_PUBLIC_KEY
    );

    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}; 