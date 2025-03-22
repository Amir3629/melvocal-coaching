"use client"

import Image from "next/image"
import { Music, Mic2, BookOpen, Trophy } from "lucide-react"
import { useTranslation } from "react-i18next"

const journeyData = [
  {
    title: "Singen",
    subtitle: "Gesangsunterricht",
    icon: Music,
    image: process.env.NODE_ENV === 'production' ? "/vocal-coaching/images/cards/singing.jpg" : "/images/cards/singing.jpg",
    items: [
      "Stimmbildung und Atemtechnik",
      "Repertoire-Aufbau",
      "Interpretation und Ausdruck",
      "Mikrofontechnik",
      "Bühnenpräsenz"
    ]
  },
  {
    title: "Sprechen",
    subtitle: "Sprechtraining",
    icon: Mic2,
    image: process.env.NODE_ENV === 'production' ? "/vocal-coaching/images/cards/speaking.jpg" : "/images/cards/speaking.jpg",
    items: [
      "Artikulation",
      "Resonanz",
      "Sprachmelodie",
      "Atmung",
      "Textarbeit"
    ]
  },
  {
    title: "Lernen",
    subtitle: "Musiktheorie",
    icon: BookOpen,
    image: process.env.NODE_ENV === 'production' ? "/vocal-coaching/images/cards/learning.jpg" : "/images/cards/learning.jpg",
    items: [
      "Grundlagen der Musiktheorie",
      "Rhythmus und Timing",
      "Gehörbildung",
      "Harmonielehre",
      "Notenlesen"
    ]
  },
  {
    title: "Erfolg",
    subtitle: "Zertifizierung",
    icon: Trophy,
    image: process.env.NODE_ENV === 'production' ? "/vocal-coaching/images/cards/success.jpg" : "/images/cards/success.jpg",
    items: [
      "Prüfungsvorbereitung",
      "Auftrittstraining",
      "Feedback und Evaluation",
      "Zertifikatsabschluss",
      "Weiterbildung"
    ]
  }
]

export default function JourneyShowcase() {
  const { t } = useTranslation()

  return (
    <section id="certifications" className="bg-[#040202] py-16">
      <div className="container mx-auto px-4">
        <div className="section-title">
          <h2>{t('certifications.title')}</h2>
        </div>

        <div className="text-center mb-12">
          <div className="w-24 h-0.5 bg-[#C8A97E] mx-auto opacity-80"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {journeyData.map((journey, idx) => {
            const Icon = journey.icon
            return (
              <div
                key={idx}
                className="
                  relative w-full rounded-xl overflow-hidden
                  h-[320px] hover:h-[420px]
                  transition-all duration-500 ease-out
                  group
                "
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={journey.image}
                    alt={journey.title}
                    fill
                    className="
                      object-cover 
                      scale-100 blur-[8px]
                      group-hover:scale-110 group-hover:blur-none
                      transition-all duration-700
                    "
                  />
                  
                  {/* Dark Overlay */}
                  <div 
                    className="
                      absolute inset-0 
                      bg-gradient-to-b from-black/90 via-black/70 to-black/90
                      opacity-90 group-hover:opacity-50
                      transition-opacity duration-500
                    "
                  />
                </div>

                {/* Content */}
                <div className="relative h-full p-6 flex flex-col">
                  {/* Icon */}
                  <div className="
                    absolute top-4 left-4
                    transform 
                    group-hover:scale-110 group-hover:translate-y-1
                    transition-all duration-500 ease-out
                  ">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Text Content */}
                  <div className="mt-auto">
                    <h3 className="
                      text-2xl font-medium text-white mb-2
                      transform 
                      group-hover:scale-110 group-hover:-translate-y-1
                      transition-transform duration-500
                    ">
                      {journey.title}
                    </h3>
                    
                    <p className="
                      text-[#C8A97E] text-base mb-3
                      transform group-hover:-translate-y-1
                      transition-transform duration-500
                    ">
                      {journey.subtitle}
                    </p>

                    {/* Expandable Content */}
                    <div className="
                      overflow-hidden
                      opacity-0 group-hover:opacity-100
                      translate-y-4 group-hover:translate-y-0
                      transition-all duration-500
                    ">
                      <ul className="space-y-2">
                        {journey.items.map((item, idx) => (
                          <li
                          key={idx}
                            className="
                              flex items-center gap-2
                              opacity-0 group-hover:opacity-100
                              -translate-x-4 group-hover:translate-x-0
                              transition-all duration-500
                            "
                            style={{ transitionDelay: `${idx * 100}ms` }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#C8A97E]" />
                            <span className="text-gray-200 text-sm">{item}</span>
                          </li>
                      ))}
                    </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          <a 
            href="https://completevocalinstitute.com/complete-vocal-technique-de/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block relative border border-white/20 rounded-lg p-4 hover:border-[#C8A97E]/50 transition-all duration-300"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-1">CVT</h3>
              <p className="text-sm text-white/80">AUTHORISED TEACHER</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
} 