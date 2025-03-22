"use client"

import { usePathname } from 'next/navigation'
import Navigation from "@/app/components/navigation"

export default function AGBPage() {
  const pathname = usePathname()
  const isModal = pathname !== '/agb'

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {!isModal && <Navigation />}
      
      <main className={!isModal ? "pt-32 pb-20 px-4" : "px-4 py-4"}>
        <div className="max-w-4xl mx-auto">
          {!isModal && (
          <h1 className="text-4xl font-bold mb-8">Allgemeine Geschäftsbedingungen</h1>
          )}
          
          <div className="prose prose-invert max-w-none">
            <h2 className="text-[#C8A97E] text-xl mb-4">Allgemeine Geschäftsbedingungen</h2>
            <p className="text-gray-300 mb-4">Hier stehen die AGB, die normalerweise dynamisch geladen werden.</p>
            <p className="text-gray-300 mb-4">Im Entwicklungsmodus wird dieser Platzhaltercontent angezeigt.</p>
            <p className="text-gray-300 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>
            <h3 className="text-white text-lg mb-3 mt-6">1. Geltungsbereich</h3>
            <p className="text-gray-300 mb-4">Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge, die zwischen dem Anbieter und dem Kunden geschlossen werden.</p>
            <h3 className="text-white text-lg mb-3 mt-6">2. Vertragsschluss</h3>
            <p className="text-gray-300 mb-4">Der Vertrag kommt durch die Annahme des Angebots durch den Kunden zustande.</p>
          </div>
        </div>
      </main>
    </div>
  )
} 