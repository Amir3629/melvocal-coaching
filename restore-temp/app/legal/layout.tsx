export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-invert prose-gold max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
} 