// Simple placeholder for test router page 
// (Production only - prevents build errors)
export default function TestRouterPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Router Test Page</h1>
      <p>This test page is only available in development mode.</p>
      <a href="/" className="text-blue-500 hover:underline mt-4 inline-block">
        Return to Home
      </a>
    </div>
  );
} 