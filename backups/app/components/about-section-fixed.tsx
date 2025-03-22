"use client"

import { useState, useRef } from "react"
import { useTranslation } from 'react-i18next'
import Image from "next/image"
import { Trophy, Users, Music, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Line-by-line reveal component
const LineReveal = ({ text, delay = 0, visible = false }: { text: string, delay?: number, visible: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{
        duration: 0.3,
        delay: delay,
        ease: "easeOut"
      }}
      className="text-white mb-2"
    >
      {text}
    </motion.div>
  )
}

export default function AboutSectionFixed() {
  const [isExpanded, setIsExpanded] = useState(false)
  const detailsRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  const imagePath = process.env.NODE_ENV === 'production'
    ? "/vocal-coaching/images/about/profile.jpg"
    : "/images/about/profile.jpg"

  const handleReadMore = () => {
    setIsExpanded(true)
    if (detailsRef.current) {
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
      }, 100)
    }
  }

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

  // Additional content lines for expanded view
  const additionalContent = [
    "Als eine von nur drei zertifizierten Complete Vocal Technique® Lehrerinnen in Berlin biete ich eine wissenschaftlich fundierte und ganzheitliche Herangehensweise an die Stimmbildung.",
    "Meine Methodik verbindet traditionelle Gesangstechniken mit modernen pädagogischen Ansätzen, immer mit dem Ziel, das volle Potenzial meiner Schüler zu entfalten.",
    "Neben meiner Lehrtätigkeit bin ich auch als aktive Performerin in der Berliner Musikszene tätig, was mir ermöglicht, praktische Bühnenerfahrung in meinen Unterricht einfließen zu lassen."
  ]

  return (
    <section className="bg-[#040202] py-4">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            <div className="md:w-2/5">
              <motion.div 
                className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-2xl shadow-black/50"
                animate={{ y: isExpanded ? -20 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={imagePath}
                  alt="Melanie Vocal Coach"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </motion.div>
            </div>
            
            <div className="md:w-3/5 flex flex-col justify-center">
              <motion.div
                animate={{ y: isExpanded ? -20 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative">
                  <h2 className="text-3xl md:text-4xl font-light mb-4 text-white relative inline-block">
                    Über mich
                    <div className="w-[60%] h-0.5 bg-[#C8A97E] absolute bottom-[-8px] left-[20%]"></div>
                  </h2>
                </div>
                
                <div className="relative overflow-visible mt-8">
                  <div className="text-lg text-white space-y-4">
                    <div>
                      Als leidenschaftliche Sängerin und Vocal Coach mit über 20 Jahren Erfahrung verbinde ich technische Präzision mit künstlerischem Ausdruck.
                    </div>
                      
                    <div>
                      Meine Reise begann in der klassischen Ausbildung und führte mich durch verschiedene Genres – vom Jazz über Soul bis hin zu Pop und Musical.
                    </div>
                  </div>

                  {/* "Mehr erfahren" Button - only shown when not expanded */}
                  {!isExpanded && (
                    <motion.button
                      onClick={handleReadMore}
                      className="mt-4 text-[#C8A97E] hover:text-[#D4AF37] transition-colors flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Mehr erfahren
                      <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                    </motion.button>
                  )}
                </div>
              </motion.div>

              {/* In-place expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-2 text-lg text-white"
                  >
                    <div className="space-y-3">
                      {additionalContent.map((line, index) => (
                        <LineReveal 
                          key={index}
                          text={line}
                          delay={index * 0.2}
                          visible={isExpanded}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Stats and philosophy sections that appear when expanded */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              ref={detailsRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto mt-0"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + (index * 0.1) }}
                    className="bg-black/30 p-4 rounded-lg border border-[#C8A97E]/10 flex flex-col items-center text-center group hover:bg-black/40 transition-colors duration-300"
                  >
                    <div className="mb-2 text-[#C8A97E] group-hover:text-[#D4AF37] group-hover:scale-110 transition-all duration-300">{stat.icon}</div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="bg-black/20 p-4 rounded-lg border border-[#C8A97E]/10"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">Meine Philosophie</h3>
                  <div className="text-gray-300 text-sm">
                    Ich glaube an einen ganzheitlichen Ansatz beim Gesangsunterricht. Jede Stimme ist einzigartig, und mein Ziel ist es, Ihre natürlichen Stärken zu fördern und gleichzeitig technische Herausforderungen zu überwinden. Durch die Kombination von wissenschaftlich fundierten Methoden mit kreativer Ausdrucksfreiheit schaffe ich einen Raum, in dem Sie Ihre stimmlichen Fähigkeiten voll entfalten können.
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="bg-black/20 p-4 rounded-lg border border-[#C8A97E]/10"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">Mein Ansatz</h3>
                  <div className="text-gray-300 text-sm">
                    Als zertifizierte Complete Vocal Technique (CVT) Lehrerin biete ich einen strukturierten, aber flexiblen Unterrichtsansatz. Ich passe meine Methoden an Ihre individuellen Bedürfnisse an, ob Sie Anfänger sind oder bereits professionell singen. Mein Unterricht umfasst Stimmtechnik, Repertoireentwicklung, Bühnenpräsenz und Ausdrucksfähigkeit – alles, was Sie brauchen, um Ihr volles Potenzial zu entfalten.
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
} 