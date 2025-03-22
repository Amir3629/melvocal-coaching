"use client"

import { useTranslation } from 'react-i18next'
import Image from "next/image"
import { Trophy, Users, Music } from "lucide-react"

export default function AboutSectionNew() {
  const { t } = useTranslation()

  const imagePath = process.env.NODE_ENV === 'production'
    ? "/vocal-coaching/images/about/profile.jpg"
    : "/images/about/profile.jpg"

  const stats = [
    { 
      icon: <Trophy className="w-8 h-8 text-[#C8A97E]" />, 
      value: "20+", 
      label: t('about.stats.years', 'Jahre Erfahrung') 
    },
    { 
      icon: <Users className="w-8 h-8 text-[#C8A97E]" />, 
      value: "1000+", 
      label: t('about.stats.students', 'Schüler unterrichtet') 
    },
    { 
      icon: <Music className="w-8 h-8 text-[#C8A97E]" />, 
      value: "500+", 
      label: t('about.stats.performances', 'Live-Auftritte') 
    }
  ]

  return (
    <section className="py-16 bg-black/40">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 relative">
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={imagePath}
                alt="Melanie Vocal Coach"
                width={600}
                height={400}
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="p-8">
              <h2 className="text-3xl font-light text-white mb-8 text-center lg:text-left">
                Über mich
              </h2>
              
              <div className="space-y-6">
                <div className="text-gray-300">
                  Als leidenschaftliche Sängerin und Vocal Coach mit über 20 Jahren Erfahrung verbinde ich technische Präzision mit künstlerischem Ausdruck.
                </div>
                
                <div className="text-gray-300">
                  Meine Reise begann in der klassischen Ausbildung und führte mich durch verschiedene Genres – vom Jazz über Soul bis hin zu Pop und Musical.
          </div>

                <div className="text-gray-300">
                  Als eine von nur drei zertifizierten Complete Vocal Technique® Lehrerinnen in Berlin biete ich eine wissenschaftlich fundierte und ganzheitliche Herangehensweise an die Stimmbildung.
        </div>
        
                <div className="text-gray-300">
                  Meine Methodik verbindet traditionelle Gesangstechniken mit modernen pädagogischen Ansätzen, immer mit dem Ziel, das volle Potenzial meiner Schüler zu entfalten.
                  </div>
                
                <div className="text-gray-300">
                  Neben meiner Lehrtätigkeit bin ich auch als aktive Performerin in der Berliner Musikszene tätig, was mir ermöglicht, praktische Bühnenerfahrung in meinen Unterricht einfließen zu lassen.
                  </div>
              </div>
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="bg-black/30 p-6 rounded-lg border border-[#C8A97E]/10 flex flex-col items-center text-center hover:border-[#C8A97E]/30 transition-colors"
                  >
                    <div className="mb-4 text-[#C8A97E]">{stat.icon}</div>
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-black/20 p-6 rounded-lg border border-[#C8A97E]/10">
            <h3 className="text-xl font-semibold text-white mb-4">Meine Philosophie</h3>
            <div className="text-gray-300">
              Ich glaube an einen ganzheitlichen Ansatz beim Gesangsunterricht. Jede Stimme ist einzigartig, und mein Ziel ist es, Ihre natürlichen Stärken zu fördern und gleichzeitig technische Herausforderungen zu überwinden. Durch die Kombination von wissenschaftlich fundierten Methoden mit kreativer Ausdrucksfreiheit schaffe ich einen Raum, in dem Sie Ihre stimmlichen Fähigkeiten voll entfalten können.
            </div>
          </div>
          
          <div className="bg-black/20 p-6 rounded-lg border border-[#C8A97E]/10">
            <h3 className="text-xl font-semibold text-white mb-4">Mein Ansatz</h3>
            <div className="text-gray-300">
              Als zertifizierte Complete Vocal Technique (CVT) Lehrerin biete ich einen strukturierten, aber flexiblen Unterrichtsansatz. Ich passe meine Methoden an Ihre individuellen Bedürfnisse an, ob Sie Anfänger sind oder bereits professionell singen. Mein Unterricht umfasst Stimmtechnik, Repertoireentwicklung, Bühnenpräsenz und Ausdrucksfähigkeit – alles, was Sie brauchen, um Ihr volles Potenzial zu entfalten.
            </div>
          </div>
                </div>
      </div>
    </section>
  )
} 