"use client"

import Navigation from "@/app/components/navigation"

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Impressum</h1>
          
          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Angaben gemäß § 5 TMG</h2>
              <div className="bg-[#0A0A0A] p-6 rounded-lg space-y-2 border border-[#C8A97E]/10">
                <p>Melanie Wainwright</p>
                <p>Jazz Vocal Coaching</p>
                <p>[Straße Nr.]</p>
                <p>[PLZ] Berlin</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Kontakt</h2>
              <div className="bg-[#0A0A0A] p-6 rounded-lg space-y-2 border border-[#C8A97E]/10">
                <p>Telefon: [Ihre Telefonnummer]</p>
                <p>E-Mail: [Ihre Email]</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Berufsbezeichnung und berufsrechtliche Regelungen</h2>
              <div className="space-y-4">
                <p>
                  Berufsbezeichnung: Gesangslehrerin/Vocalcoach
                </p>
                <p>
                  Zertifizierungen:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Complete Vocal Institute (CVI) - Kopenhagen</li>
                  <li>Certified Vocal Teacher</li>
                  {/* Add more certifications */}
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Streitschlichtung</h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-[#C8A97E] hover:underline ml-1">
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Haftung für Inhalte</h2>
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
} 