"use client"

import { motion } from "framer-motion"

export default function DatenschutzPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <h1 className="text-3xl font-bold mb-6">Datenschutzerklärung</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Datenschutz auf einen Blick</h2>
        <h3 className="text-xl font-medium mb-3">Allgemeine Hinweise</h3>
        <p className="mb-4">
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, 
          wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert 
          werden können.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Datenerfassung auf dieser Website</h2>
        <h3 className="text-xl font-medium mb-3">Cookies</h3>
        <p className="mb-4">
          Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr Webbrowser auf Ihrem Endgerät speichert. 
          Cookies helfen uns dabei, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Ihre Rechte</h2>
        <p className="mb-4">
          Sie haben jederzeit das Recht auf Auskunft über die Sie betreffenden personenbezogenen Daten. Sie können 
          jederzeit deren Berichtigung oder Löschung verlangen.
        </p>
      </section>
    </motion.div>
  )
} 