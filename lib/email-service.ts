import nodemailer from 'nodemailer';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Function to send booking confirmation email to customer
export async function sendBookingConfirmation(
  customerEmail: string,
  customerName: string,
  serviceType: string,
  startTime: string,
  endTime: string,
  additionalDetails: string
) {
  const formattedStartTime = new Date(startTime).toLocaleString('de-DE', {
    timeZone: 'Europe/Berlin',
  });
  const formattedEndTime = new Date(endTime).toLocaleString('de-DE', {
    timeZone: 'Europe/Berlin',
  });

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: customerEmail,
    subject: `Booking Confirmation - ${serviceType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #C8A97E;">Booking Confirmation</h2>
        <p>Dear ${customerName},</p>
        <p>Thank you for booking a ${serviceType} session with us. Here are your booking details:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Service:</strong> ${serviceType}</p>
          <p><strong>Date & Time:</strong> ${formattedStartTime} - ${formattedEndTime}</p>
          ${additionalDetails ? `<p><strong>Additional Details:</strong> ${additionalDetails}</p>` : ''}
        </div>
        <p>If you need to make any changes to your booking, please contact us at info@melanie-wainwright.de</p>
        <p>Best regards,<br>Melanie Wainwright</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    throw error;
  }
}

// Function to send notification email to admin
export async function sendAdminNotification(
  customerName: string,
  customerEmail: string,
  serviceType: string,
  startTime: string,
  endTime: string,
  additionalDetails: string
) {
  const formattedStartTime = new Date(startTime).toLocaleString('de-DE', {
    timeZone: 'Europe/Berlin',
  });
  const formattedEndTime = new Date(endTime).toLocaleString('de-DE', {
    timeZone: 'Europe/Berlin',
  });

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New Booking - ${serviceType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #C8A97E;">New Booking Received</h2>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Customer Name:</strong> ${customerName}</p>
          <p><strong>Customer Email:</strong> ${customerEmail}</p>
          <p><strong>Service:</strong> ${serviceType}</p>
          <p><strong>Date & Time:</strong> ${formattedStartTime} - ${formattedEndTime}</p>
          ${additionalDetails ? `<p><strong>Additional Details:</strong> ${additionalDetails}</p>` : ''}
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    throw error;
  }
} 