export default function TestRouterNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">Router Test Disabled</h1>
        <p className="mb-6">
          The router test page has been disabled in production.
          This feature is only available in development mode.
        </p>
        <a 
          href="/"
          className="inline-block px-4 py-2 rounded bg-[#C8A97E] text-black hover:bg-[#D4AF37] transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
} 