import { type ReactNode } from "react"

interface SectionProps {
  title: string
  children: ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-[#C8A97E] mb-4">{title}</h3>
      {children}
    </div>
  )
}

interface SubSectionProps {
  title: string
  children: ReactNode
}

function SubSection({ title, children }: SubSectionProps) {
  return (
    <div className="mb-6">
      <h4 className="text-lg font-medium text-[#C8A97E]/90 mb-3">{title}</h4>
      {children}
    </div>
  )
}

interface ListItemProps {
  children: ReactNode
}

function ListItem({ children }: ListItemProps) {
  return (
    <li className="flex items-start mb-2">
      <span className="text-[#C8A97E] mr-2 mt-1.5">•</span>
      <span className="flex-1">{children}</span>
    </li>
  )
}

export interface LegalContentProps {
  type: "datenschutz" | "impressum" | "agb"
}

export default function LegalContent({ type }: LegalContentProps) {
  if (type === "datenschutz") {
    return (
      <div className="text-gray-300 space-y-6">
        <Section title="Datenschutzerklärung">
          <p className="mb-4">
            Name und Kontaktdaten des für die Verarbeitung Verantwortlichen:
          </p>
          <div className="bg-white/5 p-4 rounded-lg mb-6">
            <p>Melanie Wainwright</p>
            <p>Torstraße 177</p>
            <p>10115 Berlin</p>
            <p>Email: info@melanie-wainwright.de</p>
            <p>Website: www.melanie-wainwright.de</p>
          </div>
        </Section>

        <Section title="Erhebung und Speicherung personenbezogener Daten">
          <SubSection title="Beim Besuch der Website">
            <p className="mb-4">
              Beim Aufrufen unserer Website www.melanie-wainwright.de werden durch den auf Ihrem Endgerät zum Einsatz kommenden Browser automatisch Informationen an den Server unserer Website gesendet. Diese Informationen werden temporär in einem sog. Logfile gespeichert. Folgende Informationen werden dabei ohne Ihr Zutun erfasst und bis zur automatisierten Löschung gespeichert:
            </p>
            <ul className="list-none space-y-2 mb-4">
              <ListItem>IP-Adresse des anfragenden Rechners</ListItem>
              <ListItem>Datum und Uhrzeit des Zugriffs</ListItem>
              <ListItem>Name und URL der abgerufenen Datei</ListItem>
              <ListItem>Website, von der aus der Zugriff erfolgt (Referrer-URL)</ListItem>
              <ListItem>Verwendeter Browser und ggf. das Betriebssystem Ihres Rechners sowie der Name Ihres Access-Providers</ListItem>
            </ul>
          </SubSection>
        </Section>

        <Section title="Cookies">
          <p className="mb-4">
            Wir setzen auf unserer Seite Cookies ein. Hierbei handelt es sich um kleine Dateien, die Ihr Browser automatisch erstellt und die auf Ihrem Endgerät gespeichert werden. Cookies richten auf Ihrem Endgerät keinen Schaden an, enthalten keine Viren, Trojaner oder sonstige Schadsoftware.
          </p>
          <p className="mb-4">
            In dem Cookie werden Informationen abgelegt, die sich jeweils im Zusammenhang mit dem spezifisch eingesetzten Endgerät ergeben. Dies bedeutet jedoch nicht, dass wir dadurch unmittelbar Kenntnis von Ihrer Identität erhalten.
          </p>
        </Section>

        <Section title="Ihre Rechte">
          <p className="mb-4">Sie haben das Recht:</p>
          <ul className="list-none space-y-2">
            <ListItem>
              Gemäß Art. 15 DSGVO Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu verlangen
            </ListItem>
            <ListItem>
              Gemäß Art. 16 DSGVO unverzüglich die Berichtigung unrichtiger oder Vervollständigung Ihrer personenbezogenen Daten zu verlangen
            </ListItem>
            <ListItem>
              Gemäß Art. 17 DSGVO die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen
            </ListItem>
            <ListItem>
              Gemäß Art. 7 Abs. 3 DSGVO Ihre einmal erteilte Einwilligung jederzeit gegenüber uns zu widerrufen
            </ListItem>
          </ul>
        </Section>
      </div>
    )
  }

  if (type === "impressum") {
    return (
      <div className="text-gray-300 space-y-6">
        <Section title="Impressum">
          <div className="bg-white/5 p-4 rounded-lg mb-6">
            <p>Melanie Wainwright</p>
            <p>Torstraße 177</p>
            <p>10115 Berlin</p>
            <p>Email: info@melanie-wainwright.de</p>
            <p>Website: www.melanie-wainwright.de</p>
          </div>
        </Section>

        <Section title="Verantwortlich für den Inhalt">
          <p>Melanie Wainwright</p>
        </Section>

        <Section title="Haftungsausschluss">
          <SubSection title="Haftung für Inhalte">
            <p className="mb-4">
              Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
            </p>
          </SubSection>
        </Section>
      </div>
    )
  }

  return (
    <div className="text-gray-300 space-y-6">
      <Section title="Allgemeine Geschäftsbedingungen">
        <SubSection title="1. Geltungsbereich">
          <p className="mb-4">
            Diese Allgemeinen Geschäftsbedingungen gelten für alle Geschäftsbeziehungen zwischen Melanie Wainwright und ihren Kunden. Maßgeblich ist jeweils die zum Zeitpunkt des Vertragsschlusses gültige Fassung.
          </p>
        </SubSection>

        <SubSection title="2. Vertragsabschluss">
          <p className="mb-4">
            Die Buchung eines Coaching-Termins stellt ein verbindliches Angebot dar. Der Vertrag kommt durch die Annahme der Buchung durch uns zustande.
          </p>
        </SubSection>

        <SubSection title="3. Preise und Zahlungsbedingungen">
          <p className="mb-4">
            Alle Preise sind in Euro und verstehen sich inklusive der gesetzlichen Mehrwertsteuer. Die Zahlung erfolgt vor dem Coaching-Termin.
          </p>
        </SubSection>

        <SubSection title="4. Stornierung">
          <p className="mb-4">
            Eine kostenlose Stornierung ist bis 24 Stunden vor dem gebuchten Termin möglich. Bei späteren Absagen oder Nichterscheinen wird der volle Betrag fällig.
          </p>
        </SubSection>
      </Section>
    </div>
  )
} 