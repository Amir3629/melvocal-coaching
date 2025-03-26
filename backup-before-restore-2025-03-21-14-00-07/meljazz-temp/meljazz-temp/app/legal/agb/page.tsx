"use client"

import { motion } from "framer-motion"

export default function AGBPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <h1 className="text-3xl font-bold mb-6">Allgemeine Geschäftsbedingungen</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Geltungsbereich</h2>
        <p className="mb-4">
          Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen Melanie Wainwright Vocal Coaching 
          und ihren Kunden bezüglich der Durchführung von Gesangsunterricht und Coaching-Leistungen.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Vertragsschluss</h2>
        <p className="mb-4">
          Der Vertrag kommt durch die Anmeldung des Kunden und die Bestätigung durch Melanie Wainwright Vocal Coaching 
          zustande. Die Anmeldung kann schriftlich, per E-Mail oder über das Online-Buchungssystem erfolgen.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Unterrichtsgebühren</h2>
        <p className="mb-4">
          Die Unterrichtsgebühren sind im Voraus zu entrichten. Bei Verhinderung ist eine Absage mindestens 24 Stunden 
          vor dem vereinbarten Termin erforderlich, andernfalls wird die Unterrichtsstunde berechnet.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Widerrufsrecht</h2>
        <p className="mb-4">
          Als Verbraucher haben Sie das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. 
          Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.
        </p>
        <p className="mb-4">
          Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief, 
          Telefax oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
        </p>
        <p className="mb-4">
          Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf 
          der Widerrufsfrist absenden.
        </p>
        <p className="mb-4">
          <strong>Folgen des Widerrufs:</strong><br />
          Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und 
          spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags 
          bei uns eingegangen ist.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Preise und Zahlungsbedingungen</h2>
        <p className="mb-4">
          Die Preise für Unterrichtsstunden und Kurse sind der aktuellen Preisliste zu entnehmen. Die Zahlung ist vor Beginn der jeweiligen Leistung fällig, sofern nicht anders vereinbart.
        </p>
      </section>

      <h2>5. Terminabsagen und Verschiebungen</h2>
      <p>
        Terminabsagen müssen mindestens 24 Stunden vor dem vereinbarten Termin erfolgen. Bei späteren Absagen oder Nichterscheinen wird die Unterrichtsstunde in voller Höhe berechnet.
      </p>

      <h2>6. Haftung</h2>
      <p>
        Der Anbieter haftet nur für Schäden, die auf vorsätzlichem oder grob fahrlässigem Verhalten beruhen. Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen.
      </p>

      <h2>7. Datenschutz</h2>
      <p>
        Die Erhebung und Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung und den geltenden datenschutzrechtlichen Bestimmungen.
      </p>

      <h2>8. Urheberrecht</h2>
      <p>
        Alle im Rahmen des Unterrichts zur Verfügung gestellten Materialien sind urheberrechtlich geschützt und dürfen nur für den persönlichen Gebrauch verwendet werden.
      </p>

      <h2>9. Schlussbestimmungen</h2>
      <p>
        Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen davon unberührt. Es gilt deutsches Recht. Gerichtsstand ist Berlin.
      </p>

      <div className="mt-8 text-sm text-gray-400">
        <p>Stand: Januar 2024</p>
        <p>Melanie Wainwright Vocal Coaching</p>
        <p>Torstraße 177, 10115 Berlin</p>
      </div>
    </motion.div>
  )
} 