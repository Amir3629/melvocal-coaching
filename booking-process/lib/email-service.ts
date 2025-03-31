import nodemailer from 'nodemailer';

// Create nodemailer transporter
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send booking confirmation email to the user
export async function sendBookingConfirmationEmail(bookingData: {
  name: string;
  email: string;
  date: string;
  time: string;
  service: string;
  details?: string;
}) {
  try {
    const { name, email, date, time, service, details } = bookingData;
    const transporter = getTransporter();
    
    const formattedDate = new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    
    const mailOptions = {
      from: `"Melanie Becker Vocal Coaching" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Buchungsbestätigung: ${service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #C8A97E; border-bottom: 2px solid #C8A97E; padding-bottom: 10px;">Buchungsbestätigung</h2>
          
          <p>Hallo ${name},</p>
          
          <p>vielen Dank für Ihre Buchung. Wir haben Ihre Anfrage erhalten und werden uns in Kürze bei Ihnen melden.</p>
          
          <div style="background-color: #f9f9f9; border: 1px solid #eee; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <h3 style="color: #C8A97E; margin-top: 0;">Buchungsdetails</h3>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Datum:</strong> ${formattedDate}</p>
            <p><strong>Uhrzeit:</strong> ${time}</p>
            ${details ? `<p><strong>Zusätzliche Informationen:</strong><br>${details}</p>` : ''}
          </div>
          
          <p>Bei Fragen kontaktieren Sie uns gerne unter <a href="mailto:info@melanie-wainwright.de" style="color: #C8A97E;">info@melanie-wainwright.de</a>.</p>
          
          <p style="margin-top: 30px;">Mit freundlichen Grüßen,<br>
          <strong>Melanie Becker</strong><br>
          Vocal Coaching</p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
            <p>Diese E-Mail wurde automatisch erstellt. Bitte antworten Sie nicht direkt auf diese E-Mail.</p>
          </div>
        </div>
      `,
    };
    
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
}

// Send booking notification email to the admin
export async function sendBookingNotificationEmail(bookingData: {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  service: string;
  details?: string;
}) {
  try {
    const { name, email, phone, date, time, service, details } = bookingData;
    const transporter = getTransporter();
    
    const formattedDate = new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    
    const mailOptions = {
      from: `"Buchungssystem" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || 'info@melanie-wainwright.de',
      subject: `Neue Buchung: ${service} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #C8A97E; border-bottom: 2px solid #C8A97E; padding-bottom: 10px;">Neue Buchungsanfrage</h2>
          
          <div style="background-color: #f9f9f9; border: 1px solid #eee; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <h3 style="color: #C8A97E; margin-top: 0;">Kundeninformationen</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>E-Mail:</strong> <a href="mailto:${email}" style="color: #C8A97E;">${email}</a></p>
            <p><strong>Telefon:</strong> ${phone}</p>
          </div>
          
          <div style="background-color: #f9f9f9; border: 1px solid #eee; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <h3 style="color: #C8A97E; margin-top: 0;">Buchungsdetails</h3>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Datum:</strong> ${formattedDate}</p>
            <p><strong>Uhrzeit:</strong> ${time}</p>
            ${details ? `<p><strong>Zusätzliche Informationen:</strong><br>${details}</p>` : ''}
          </div>
          
          <p>Sie können diese Buchung in Ihrem Google Kalender einsehen. Bei Bedarf können Sie den Termin bestätigen oder absagen.</p>
        </div>
      `,
    };
    
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending notification email:', error);
    throw error;
  }
}

// Send contact form email
export async function sendContactFormEmail(formData: {
  name: string;
  email: string;
  message: string;
  phone?: string;
}) {
  try {
    const { name, email, message, phone } = formData;
    const transporter = getTransporter();
    
    const mailOptions = {
      from: `"Website Kontaktformular" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || 'info@melanie-wainwright.de',
      subject: `Neue Kontaktanfrage von ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #C8A97E; border-bottom: 2px solid #C8A97E; padding-bottom: 10px;">Neue Kontaktanfrage</h2>
          
          <div style="background-color: #f9f9f9; border: 1px solid #eee; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>E-Mail:</strong> <a href="mailto:${email}" style="color: #C8A97E;">${email}</a></p>
            ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
          </div>
          
          <div style="background-color: #f9f9f9; border: 1px solid #eee; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <h3 style="color: #C8A97E; margin-top: 0;">Nachricht</h3>
            <p style="white-space: pre-line;">${message}</p>
          </div>
        </div>
      `,
    };
    
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending contact form email:', error);
    throw error;
  }
} 