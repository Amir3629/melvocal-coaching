import BookingButton from "@/components/booking-button"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6 text-center">Melanie Becker Vocal Coaching</h1>

        <div className="max-w-md mx-auto bg-[#121212] rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Buchen Sie Ihren Termin</h2>
          <p className="text-gray-300 mb-6">
            Wählen Sie aus unseren verschiedenen Angeboten und buchen Sie direkt online. Alle Termine werden mit meinem
            Google Kalender synchronisiert.
          </p>

          <div className="space-y-4">
            <BookingButton initialService="professioneller-gesang" variant="primary" size="lg" className="w-full">
              Live Jazz Performance buchen
            </BookingButton>

            <BookingButton initialService="vocal-coaching" variant="outline" size="lg" className="w-full">
              Vocal Coaching buchen
            </BookingButton>

            <BookingButton initialService="gesangsunterricht" variant="secondary" size="lg" className="w-full">
              Jazz Workshop buchen
            </BookingButton>
          </div>
        </div>
      </div>
    </main>
  )
}

