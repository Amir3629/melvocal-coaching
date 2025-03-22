import React from 'react'

// Service types
type ServiceType = 'gesangsunterricht' | 'vocal-coaching' | 'professioneller-gesang' | null

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  
  // Live Singing fields
  eventType?: 'wedding' | 'corporate' | 'private' | 'other';
  eventDate?: string;
  guestCount?: string;
  jazzStandards?: string;
  
  // Vocal Coaching fields
  sessionType?: '1:1' | 'group' | 'online';
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  focusArea?: string[];
  preferredDate?: string;
  preferredTime?: string;
  
  // Workshop fields
  workshopTheme?: string;
  groupSize?: string;
  preferredDates?: string[];
  workshopDuration?: string;
  
  // Legal
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

interface EmailTemplateProps {
  formData: FormData;
  serviceType: ServiceType;
}

export default function EmailTemplate({ formData, serviceType }: EmailTemplateProps) {
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  }
  
  // Get service name based on type
  const getServiceName = () => {
    switch(serviceType) {
      case 'gesangsunterricht':
        return 'Jazz Workshop';
      case 'vocal-coaching':
        return 'Vocal Coaching & Gesangsunterricht';
      case 'professioneller-gesang':
        return 'Live Jazz Performance';
      default:
        return '';
    }
  }
  
  // Get event type name
  const getEventTypeName = () => {
    switch(formData.eventType) {
      case 'wedding':
        return 'Hochzeit';
      case 'corporate':
        return 'Firmenevent';
      case 'private':
        return 'Private Feier';
      case 'other':
        return 'Sonstiges';
      default:
        return '';
    }
  }
  
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px', color: '#333' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#C8A97E', margin: '0 0 10px' }}>Buchungsbestätigung</h1>
        <p style={{ fontSize: '18px', color: '#666' }}>Vielen Dank für Ihre Buchung!</p>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <p>Hallo {formData.name},</p>
        <p>vielen Dank für Ihre Buchungsanfrage. Wir haben Ihre Anfrage erhalten und werden uns in Kürze mit Ihnen in Verbindung setzen, um die Details zu besprechen.</p>
      </div>
      
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '5px', marginBottom: '30px' }}>
        <h2 style={{ color: '#C8A97E', fontSize: '18px', marginTop: '0' }}>Buchungsdetails</h2>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', width: '40%', fontWeight: 'bold' }}>Dienst:</td>
              <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>{getServiceName()}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Name:</td>
              <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>{formData.name}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>E-Mail:</td>
              <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>{formData.email}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Telefon:</td>
              <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>{formData.phone}</td>
            </tr>
            
            {/* Service-specific details */}
            {serviceType === 'professioneller-gesang' && (
              <>
                <tr>
                  <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Art der Veranstaltung:</td>
                  <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>{getEventTypeName()}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Datum der Veranstaltung:</td>
                  <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>{formatDate(formData.eventDate)}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Anzahl der Gäste:</td>
                  <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>{formData.guestCount}</td>
                </tr>
                {formData.jazzStandards && (
                  <tr>
                    <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Jazz Standards:</td>
                    <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>{formData.jazzStandards}</td>
                  </tr>
                )}
              </>
            )}
            
            {serviceType === 'vocal-coaching' && (
              <>
                <tr>
                  <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Art der Session:</td>
                  <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>{formData.sessionType}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Erfahrungslevel:</td>
                  <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>{formData.skillLevel}</td>
                </tr>
                {formData.preferredDate && (
                  <tr>
                    <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Bevorzugtes Datum:</td>
                    <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>{formatDate(formData.preferredDate)}</td>
                  </tr>
                )}
                {formData.preferredTime && (
                  <tr>
                    <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Bevorzugte Uhrzeit:</td>
                    <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>{formData.preferredTime}</td>
                  </tr>
                )}
              </>
            )}
            
            {serviceType === 'gesangsunterricht' && (
              <>
                <tr>
                  <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Workshop-Thema:</td>
                  <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>{formData.workshopTheme}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Gruppengröße:</td>
                  <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>{formData.groupSize}</td>
                </tr>
                {formData.workshopDuration && (
                  <tr>
                    <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Workshop-Dauer:</td>
                    <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>{formData.workshopDuration}</td>
                  </tr>
                )}
              </>
            )}
            
            {formData.message && (
              <tr>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Nachricht:</td>
                <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', whiteSpace: 'pre-line' }}>{formData.message}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#C8A97E', fontSize: '18px' }}>Nächste Schritte</h2>
        <p>Wir werden Ihre Anfrage innerhalb von 24-48 Stunden bearbeiten und uns mit Ihnen in Verbindung setzen, um:</p>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Die Details Ihrer Buchung zu besprechen</li>
          <li>Einen Termin zu vereinbaren</li>
          <li>Eventuelle Fragen zu klären</li>
        </ul>
      </div>
      
      <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', fontSize: '14px', color: '#666', textAlign: 'center' }}>
        <p>Bei Fragen können Sie uns jederzeit kontaktieren:</p>
        <p>
          <a href="mailto:info@melanie-becker.com" style={{ color: '#C8A97E', textDecoration: 'none' }}>info@melanie-becker.com</a> | 
          <a href="tel:+491234567890" style={{ color: '#C8A97E', textDecoration: 'none', marginLeft: '10px' }}>+49 123 456 7890</a>
        </p>
        <p style={{ marginTop: '20px' }}>© {new Date().getFullYear()} Melanie Becker Vocal Coaching. Alle Rechte vorbehalten.</p>
      </div>
    </div>
  )
} 