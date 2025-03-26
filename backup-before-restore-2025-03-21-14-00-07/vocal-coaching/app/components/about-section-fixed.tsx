"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Trophy, Users, Music } from "lucide-react"
import { getImagePath } from "@/app/utils/paths"

export default function AboutSectionFixed() {
  const [isExpanded, setIsExpanded] = useState(false)
  const detailsRef = useRef<HTMLDivElement>(null)

  const imagePath = getImagePath("about", "profile.jpg")

  const handleReadMore = () => {
    setIsExpanded(!isExpanded)
    
    if (!isExpanded && detailsRef.current) {
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }
  }

  const stats = [
    { 
      icon: <Trophy className="w-8 h-8 text-[#C8A97E]" />, 
      value: "20+", 
      label: "Jahre Erfahrung" 
    },
    { 
      icon: <Users className="w-8 h-8 text-[#C8A97E]" />, 
      value: "1000+", 
      label: "Schüler unterrichtet" 
    },
    { 
      icon: <Music className="w-8 h-8 text-[#C8A97E]" />, 
      value: "500+", 
      label: "Live-Auftritte" 
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <section id="about" className="py-20 bg-[#040202]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <motion.div 
              className="relative w-full aspect-[3/4] rounded-lg overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src={imagePath}
                alt="Melanie Wainwright"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 45vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            </motion.div>
          </div>
          
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">Über mich</h2>
              <div className="w-12 h-0.5 bg-[#C8A97E] mb-6"></div>
              
              <p className="text-gray-300 mb-6">
                Als leidenschaftliche Sängerin und Vocal Coach mit über 20 Jahren Erfahrung verbinde ich technische Präzision mit künstlerischem Ausdruck. Meine Reise begann in der klassischen Ausbildung und führte mich durch verschiedene Genres – vom Jazz über Soul bis hin zu Pop und Musical.
              </p>
              
              <button
                onClick={handleReadMore}
                className="text-[#C8A97E] hover:text-[#D4AF37] transition-colors flex items-center gap-2"
              >
                {isExpanded ? "Weniger anzeigen" : "Mehr erfahren"}
                <svg
                  className={`w-4 h-4 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              ref={detailsRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="mt-12 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Meine Philosophie</h3>
                  <p className="text-gray-300 mb-4">
                    Ich glaube an einen ganzheitlichen Ansatz beim Gesangsunterricht. Jede Stimme ist einzigartig, und mein Ziel ist es, Ihre natürlichen Stärken zu fördern und gleichzeitig technische Herausforderungen zu überwinden. Durch die Kombination von wissenschaftlich fundierten Methoden mit kreativer Ausdrucksfreiheit schaffe ich einen Raum, in dem Sie Ihre stimmlichen Fähigkeiten voll entfalten können.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Mein Ansatz</h3>
                  <p className="text-gray-300 mb-4">
                    Als zertifizierte Complete Vocal Technique (CVT) Lehrerin biete ich einen strukturierten, aber flexiblen Unterrichtsansatz. Ich passe meine Methoden an Ihre individuellen Bedürfnisse an, ob Sie Anfänger sind oder bereits professionell singen. Mein Unterricht umfasst Stimmtechnik, Repertoireentwicklung, Bühnenpräsenz und Ausdrucksfähigkeit – alles, was Sie brauchen, um Ihr volles Potenzial zu entfalten.
                  </p>
                </div>
              </div>
              
              <motion.div 
                className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="bg-black/30 p-6 rounded-lg border border-gray-800 flex flex-col items-center text-center"
                    variants={itemVariants}
                  >
                    <div className="mb-4 text-[#C8A97E]">{stat.icon}</div>
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div 
                className="mt-12"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.9 }}
              >
                <h3 className="text-xl font-semibold text-white mb-4">Zertifizierungen & Ausbildung</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Zertifizierte Complete Vocal Technique (CVT) Lehrerin</li>
                  <li>Abschluss in Musikpädagogik mit Schwerpunkt Gesang</li>
                  <li>Spezialisierung auf Jazz- und Improvisationstechniken</li>
                  <li>Fortbildungen in Bühnenpräsenz und Performance-Psychologie</li>
                </ul>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
} 