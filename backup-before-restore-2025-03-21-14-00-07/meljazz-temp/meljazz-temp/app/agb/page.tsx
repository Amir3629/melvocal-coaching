"use client"

import Navigation from "@/app/components/navigation"

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Allgemeine Geschäftsbedingungen</h1>
          
          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Geltungsbereich</h2>
              <div className="bg-[#0A0A0A] p-6 rounded-lg border border-[#C8A97E]/10 space-y-4">
                <p>
                  Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge über Gesangsunterricht zwischen Melanie Wainwright (nachfolgend "Lehrerin") und dem Schüler.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Unterrichtszeiten und -ort</h2>
              <div className="bg-[#0A0A0A] p-6 rounded-lg border border-[#C8A97E]/10 space-y-4">
                <p>
                  Der Unterricht findet zu den vereinbarten Zeiten statt. Bei Verhinderung ist eine Absage mindestens 24 Stunden vor dem Termin erforderlich.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Honorar und Zahlungsbedingungen</h2>
              <div className="bg-[#0A0A0A] p-6 rounded-lg border border-[#C8A97E]/10 space-y-4">
                <p>
                  Das Honorar ist im Voraus zu entrichten. Bei nicht rechtzeitiger Absage ist das volle Honorar zu zahlen.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Kündigung</h2>
              <div className="bg-[#0A0A0A] p-6 rounded-lg border border-[#C8A97E]/10 space-y-4">
                <p>
                  Die Kündigungsfrist beträgt 4 Wochen zum Monatsende. Die Kündigung muss schriftlich erfolgen.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Haftung</h2>
              <div className="bg-[#0A0A0A] p-6 rounded-lg border border-[#C8A97E]/10 space-y-4">
                <p>
                  Die Lehrerin haftet nur für Vorsatz und grobe Fahrlässigkeit. Eine weitergehende Haftung ist ausgeschlossen.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
} 