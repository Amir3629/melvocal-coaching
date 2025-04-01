export default function TestRouter() {
  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Test Router Page</h1>
      <p style={{ marginBottom: '2rem' }}>
        The test router components are only available in development mode.
      </p>
      <a 
        href="/" 
        style={{ 
          background: '#C8A97E', 
          color: 'black', 
          padding: '0.5rem 1rem', 
          borderRadius: '0.25rem',
          textDecoration: 'none'
        }}
      >
        Return to Home
      </a>
    </div>
  );
} 