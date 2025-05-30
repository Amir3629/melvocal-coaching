import nodemailer from 'nodemailer';
import { ensureString } from './formatters';

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendBookingConfirmationEmail(
  email: string,
  name: string,
  date: Date,
  time: string,
  paymentLink: string
) {
  // Safely format the date string
  const safeDate = ensureString(date instanceof Date 
    ? date.toLocaleDateString('de-DE') 
    : typeof date === 'string' ? date : 'Date not available');
  
  const safeName = ensureString(name);
  const safeTime = ensureString(time);
  const safePaymentLink = ensureString(paymentLink);
  
  const emailData: EmailData = {
    to: ensureString(email),
    subject: 'Buchungsbestätigung - Melanie Wainwright Vocal Coaching',
    text: `
      Hallo ${safeName},

      vielen Dank für deine Buchung bei Melanie Wainwright Vocal Coaching!

      Dein Termin:
      Datum: ${safeDate}
      Uhrzeit: ${safeTime}

      Um deinen Termin zu bestätigen, bitte zahle die Anzahlung von 30€ über folgenden Link:
      ${safePaymentLink}

      Die restliche Zahlung erfolgt bar oder per Überweisung vor Ort.

      Wichtige Informationen:
      - Bitte sei 5 Minuten vor Unterrichtsbeginn da
      - Die Adresse ist: Torstraße 177, 10115 Berlin
      - Bei Verhinderung bitte mindestens 24 Stunden vorher absagen

      Bei Fragen stehe ich dir gerne zur Verfügung.

      Beste Grüße,
      Melanie Wainwright
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #C8A97E;">Buchungsbestätigung</h2>
        <p>Hallo ${safeName},</p>
        <p>vielen Dank für deine Buchung bei Melanie Wainwright Vocal Coaching!</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333;">Dein Termin:</h3>
          <p>Datum: ${safeDate}<br>
          Uhrzeit: ${safeTime}</p>
        </div>

        <p>Um deinen Termin zu bestätigen, bitte zahle die Anzahlung von 30€ über folgenden Link:</p>
        <a href="${safePaymentLink}" style="display: inline-block; background: #C8A97E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Jetzt Anzahlung leisten
        </a>

        <p>Die restliche Zahlung erfolgt bar oder per Überweisung vor Ort.</p>

        <div style="border-left: 4px solid #C8A97E; padding-left: 20px; margin: 20px 0;">
          <h3 style="color: #333;">Wichtige Informationen:</h3>
          <ul style="list-style: none; padding: 0;">
            <li>✓ Bitte sei 5 Minuten vor Unterrichtsbeginn da</li>
            <li>✓ Die Adresse ist: Torstraße 177, 10115 Berlin</li>
            <li>✓ Bei Verhinderung bitte mindestens 24 Stunden vorher absagen</li>
          </ul>
        </div>

        <p>Bei Fragen stehe ich dir gerne zur Verfügung.</p>
        
        <p style="margin-top: 30px;">
          Beste Grüße,<br>
          Melanie Wainwright
        </p>
      </div>
    `,
  };

  await transporter.sendMail(emailData);
}

export async function sendPaymentConfirmationEmail(
  email: string,
  name: string,
  date: Date,
  time: string
) {
  // Safely format the date string
  const safeDate = ensureString(date instanceof Date 
    ? date.toLocaleDateString('de-DE') 
    : typeof date === 'string' ? date : 'Date not available');
  
  const safeName = ensureString(name);
  const safeTime = ensureString(time);
  
  const emailData: EmailData = {
    to: ensureString(email),
    subject: 'Zahlungsbestätigung - Melanie Wainwright Vocal Coaching',
    text: `
      Hallo ${safeName},

      vielen Dank für deine Anzahlung! Dein Termin ist nun verbindlich bestätigt.

      Dein Termin:
      Datum: ${safeDate}
      Uhrzeit: ${safeTime}

      Die restliche Zahlung erfolgt bar oder per Überweisung vor Ort.

      Ich freue mich auf unsere gemeinsame Gesangsstunde!

      Beste Grüße,
      Melanie Wainwright
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #C8A97E;">Zahlungsbestätigung</h2>
        <p>Hallo ${safeName},</p>
        <p>vielen Dank für deine Anzahlung! Dein Termin ist nun verbindlich bestätigt.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333;">Dein Termin:</h3>
          <p>Datum: ${safeDate}<br>
          Uhrzeit: ${safeTime}</p>
        </div>

        <p>Die restliche Zahlung erfolgt bar oder per Überweisung vor Ort.</p>
        
        <p>Ich freue mich auf unsere gemeinsame Gesangsstunde!</p>
        
        <p style="margin-top: 30px;">
          Beste Grüße,<br>
          Melanie Wainwright
        </p>
      </div>
    `,
  };

  await transporter.sendMail(emailData);
} 