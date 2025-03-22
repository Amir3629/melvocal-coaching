import React from 'react'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Music, Mic, Users } from 'lucide-react'

export const metadata = {
  title: 'Calendar | Melanie Becker Vocal Coaching',
  description: 'View availability and book appointments directly through my calendar.',
}

export default function CalendarPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Mein Kalender
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Sehen Sie meine Verfügbarkeit und buchen Sie direkt einen Termin für Coaching, Workshops oder Auftritte.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 hover:border-[#C8A97E]/50 transition-colors">
          <div className="w-12 h-12 rounded-full bg-[#C8A97E]/20 flex items-center justify-center mb-4">
            <Mic className="w-6 h-6 text-[#C8A97E]" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Vocal Coaching</h3>
          <p className="text-gray-400 mb-4">
            Buchen Sie eine individuelle Coaching-Session für Gesangstechnik, Interpretation oder Stimmbildung.
          </p>
          <Link 
            href="/booking?service=vocal-coaching"
            className="inline-flex items-center text-[#C8A97E] hover:text-[#D4AF37] transition-colors"
          >
            Jetzt buchen <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 hover:border-[#C8A97E]/50 transition-colors">
          <div className="w-12 h-12 rounded-full bg-[#C8A97E]/20 flex items-center justify-center mb-4">
            <Music className="w-6 h-6 text-[#C8A97E]" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Live Jazz Performance</h3>
          <p className="text-gray-400 mb-4">
            Buchen Sie einen Live-Auftritt für Ihre Veranstaltung, Hochzeit oder Firmenfeier.
          </p>
          <Link 
            href="/booking?service=professioneller-gesang"
            className="inline-flex items-center text-[#C8A97E] hover:text-[#D4AF37] transition-colors"
          >
            Jetzt buchen <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 hover:border-[#C8A97E]/50 transition-colors">
          <div className="w-12 h-12 rounded-full bg-[#C8A97E]/20 flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-[#C8A97E]" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Jazz Workshop</h3>
          <p className="text-gray-400 mb-4">
            Buchen Sie einen Workshop für Ihre Gruppe, Schule oder Unternehmen.
          </p>
          <Link 
            href="/booking?service=gesangsunterricht"
            className="inline-flex items-center text-[#C8A97E] hover:text-[#D4AF37] transition-colors"
          >
            Jetzt buchen <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
      
      <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 mb-12">
        <div className="flex items-center mb-6">
          <Calendar className="w-6 h-6 text-[#C8A97E] mr-3" />
          <h2 className="text-2xl font-bold text-white">Meine Verfügbarkeit</h2>
        </div>
        
        <div className="bg-[#1A1A1A]/50 border border-[#C8A97E]/20 rounded-lg p-6 mb-6">
          <p className="text-gray-300 mb-6">
            Sehen Sie meine aktuelle Verfügbarkeit und buchen Sie direkt einen Termin über meinen Google Kalender. 
            Wählen Sie einfach einen freien Zeitslot aus und folgen Sie den Anweisungen zur Buchung.
          </p>
          
          <div className="flex justify-center">
            <a 
              href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ30T2yfDb7XKvIARrVpIy2KIPltFAg7-YUnQlejiuhoJaIU3tvpj3ZR6Vn5klhf33WZjAu9QmYR"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-[#C8A97E] text-black font-medium rounded-lg hover:bg-[#D4AF37] transition-colors"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Google Kalender öffnen
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1A1A1A]/50 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Clock className="w-5 h-5 text-[#C8A97E] mr-2" />
              <h3 className="text-lg font-medium text-white">Reguläre Verfügbarkeit</h3>
            </div>
            <ul className="space-y-2 text-gray-300">
              <li className="flex justify-between">
                <span>Montag - Freitag:</span>
                <span>10:00 - 20:00 Uhr</span>
              </li>
              <li className="flex justify-between">
                <span>Samstag:</span>
                <span>10:00 - 18:00 Uhr</span>
              </li>
              <li className="flex justify-between">
                <span>Sonntag:</span>
                <span>Nach Vereinbarung</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-[#1A1A1A]/50 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Calendar className="w-5 h-5 text-[#C8A97E] mr-2" />
              <h3 className="text-lg font-medium text-white">Buchungshinweise</h3>
            </div>
            <ul className="space-y-2 text-gray-300 list-disc list-inside">
              <li>Termine können bis zu 3 Monate im Voraus gebucht werden</li>
              <li>Stornierungen sind bis zu 48 Stunden vor dem Termin kostenlos</li>
              <li>Bei Fragen zur Terminbuchung kontaktieren Sie mich gerne direkt</li>
              <li>Für spezielle Anfragen nutzen Sie bitte das Buchungsformular</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-gray-400 mb-4">
          Haben Sie Fragen zur Terminbuchung oder benötigen Sie Hilfe?
        </p>
        <Link 
          href="/contact"
          className="inline-flex items-center px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
        >
          Kontaktieren Sie mich
        </Link>
      </div>
    </div>
  )
} 