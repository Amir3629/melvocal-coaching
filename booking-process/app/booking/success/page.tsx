import Link from "next/link"
import { CheckCircle } from "lucide-react"

export const metadata = {
  title: "Booking Successful | Melanie Becker Vocal Coaching",
  description: "Your booking request has been successfully submitted.",
}

export default function BookingSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-[#C8A97E]" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Buchung erfolgreich!</h1>

        <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 mb-8">
          <p className="text-gray-300 mb-4">
            Vielen Dank für Ihre Buchungsanfrage. Wir haben Ihre Anfrage erhalten und werden uns in Kürze bei Ihnen
            melden.
          </p>

          <p className="text-gray-300 mb-4">Eine Bestätigung wurde an Ihre E-Mail-Adresse gesendet.</p>

          <div className="border-t border-gray-800 pt-4 mt-4">
            <p className="text-gray-400 text-sm">
              Bei Fragen kontaktieren Sie uns bitte unter{" "}
              <a href="mailto:info@melanie-wainwright.de" className="text-[#C8A97E] hover:underline">
                info@melanie-wainwright.de
              </a>
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Link
            href="/"
            className="px-6 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#222] transition-colors border border-gray-700"
          >
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  )
}

