"use client"

import { usePathname } from 'next/navigation'
import Navigation from "@/app/components/navigation"

export default function DatenschutzPage() {
  const pathname = usePathname()
  const isModal = pathname !== '/datenschutz'

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {!isModal && <Navigation />}
      
      <main className={!isModal ? "pt-32 pb-20 px-4" : "px-4 py-4"}>
        <div className="max-w-4xl mx-auto">
          {!isModal && (
          <h1 className="text-4xl font-bold mb-8">Datenschutzerklärung</h1>
          )}
          
          <div className={`prose prose-invert max-w-none ${isModal ? 'legal-document-content mt-0' : ''}`}>
            <h2 className="text-2xl font-semibold mb-3">1. Datenschutz auf einen Blick</h2>
            <p className="text-gray-300 mb-4">Hier steht die Datenschutzerklärung, die normalerweise dynamisch geladen wird.</p>
            <p className="text-gray-300 mb-4">Im Entwicklungsmodus wird dieser Platzhaltercontent angezeigt.</p>
            <p className="text-gray-300 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>
            <p className="text-gray-300 mb-4">Donec auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>
            <h3 className="text-white text-lg mb-3 mt-6">Datenverarbeitung</h3>
            <p className="text-gray-300 mb-4">Hier stehen Informationen zur Datenverarbeitung.</p>
            <p className="text-gray-300 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>
          </div>
        </div>
      </main>
    </div>
  )
} 