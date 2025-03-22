"use client"

import { motion } from "framer-motion"

export default function DatenschutzPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-white mt-7">1. Datenschutz auf einen Blick</h2>
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Allgemeine Hinweise</h3>
          <p className="text-gray-300 leading-relaxed">
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, 
            wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert 
            werden können.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">2. Datenerfassung auf dieser Website</h2>
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Cookies</h3>
          <p className="text-gray-300 leading-relaxed">
            Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr Webbrowser auf Ihrem Endgerät speichert. 
            Cookies helfen uns dabei, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">3. Ihre Rechte</h2>
        <p className="text-gray-300 leading-relaxed">
          Sie haben jederzeit das Recht auf Auskunft über die Sie betreffenden personenbezogenen Daten. Sie können 
          jederzeit deren Berichtigung oder Löschung verlangen.
        </p>
      </section>

      <div className="pt-8 mt-8 border-t border-[#C8A97E]/10 text-sm text-gray-400 space-y-1">
        <p>Stand: Januar 2024</p>
        <p>Melanie Wainwright Vocal Coaching</p>
        <p>Torstraße 177, 10115 Berlin</p>
      </div>
    </motion.div>
  )
} 