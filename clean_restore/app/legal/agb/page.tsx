"use client"

import { motion } from "framer-motion"

export default function AGBPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-white mt-7">1. Geltungsbereich</h2>
        <p className="text-gray-300 leading-relaxed">
          Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen Melanie Wainwright Vocal Coaching 
          und ihren Kunden bezüglich der Durchführung von Gesangsunterricht und Coaching-Leistungen.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">2. Vertragsschluss</h2>
        <p className="text-gray-300 leading-relaxed">
          Der Vertrag kommt durch die Anmeldung des Kunden und die Bestätigung durch Melanie Wainwright Vocal Coaching 
          zustande. Die Anmeldung kann schriftlich, per E-Mail oder über das Online-Buchungssystem erfolgen.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">3. Unterrichtsgebühren</h2>
        <p className="text-gray-300 leading-relaxed">
          Die Unterrichtsgebühren sind im Voraus zu entrichten. Bei Verhinderung ist eine Absage mindestens 24 Stunden 
          vor dem vereinbarten Termin erforderlich, andernfalls wird die Unterrichtsstunde berechnet.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">4. Widerrufsrecht</h2>
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            Als Verbraucher haben Sie das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. 
            Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung über Ihren Entschluss, 
            diesen Vertrag zu widerrufen, informieren.
          </p>
          <div>
            <p className="font-medium text-white mb-2">Folgen des Widerrufs:</p>
            <p className="text-gray-300 leading-relaxed">
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und 
              spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags 
              bei uns eingegangen ist.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">5. Datenschutz</h2>
        <p className="text-gray-300 leading-relaxed">
          Die Erhebung und Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung und den 
          geltenden datenschutzrechtlichen Bestimmungen.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">6. Schlussbestimmungen</h2>
        <p className="text-gray-300 leading-relaxed">
          Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen 
          davon unberührt. Es gilt deutsches Recht. Gerichtsstand ist Berlin.
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