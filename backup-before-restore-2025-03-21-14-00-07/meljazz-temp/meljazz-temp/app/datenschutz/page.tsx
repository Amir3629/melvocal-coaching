"use client"

import Navigation from "@/app/components/navigation"

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Datenschutzerklärung</h1>
          
          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Datenschutz auf einen Blick</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Allgemeine Hinweise</h3>
                <p>
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Datenerfassung auf dieser Website</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Kontaktformular</h3>
                <p>
                  Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Ihre Rechte</h2>
              <div className="space-y-4">
                <p>Sie haben jederzeit das Recht:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Auskunft über Ihre gespeicherten personenbezogenen Daten zu erhalten</li>
                  <li>Die Berichtigung oder Löschung Ihrer personenbezogenen Daten zu verlangen</li>
                  <li>Die Einschränkung der Datenverarbeitung zu verlangen</li>
                  <li>Der Datenverarbeitung zu widersprechen</li>
                  <li>Ihre Daten in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Kontakt</h2>
              <div className="space-y-4">
                <p>
                  Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen Daten, bei Auskünften, Berichtigung, Sperrung oder Löschung von Daten wenden Sie sich bitte an:
                </p>
                <div className="bg-[#0A0A0A] p-6 rounded-lg border border-[#C8A97E]/10">
                  <p>Melanie Wainwright</p>
                  <p>Adresse: [Ihre Geschäftsadresse]</p>
                  <p>Email: [Ihre Email]</p>
                  <p>Telefon: [Ihre Telefonnummer]</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
} 