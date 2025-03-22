"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import { Mic, Users, Music } from 'lucide-react'

export default function AboutSection() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useTranslation()

  const stats = [
    { 
      icon: <Mic className="w-8 h-8 text-[#C8A97E]" />,
      value: "1000+",
      label: t('about.stats.performances')
    },
    { 
      icon: <Users className="w-8 h-8 text-[#C8A97E]" />, 
      value: "500+",
      label: t('about.stats.students')
    },
    { 
      icon: <Music className="w-8 h-8 text-[#C8A97E]" />, 
      value: "15+",
      label: t('about.stats.experience')
    }
  ]

  const handleReadMore = () => {
    setIsExpanded(!isExpanded)
    if (!isExpanded) {
      setTimeout(() => {
        const element = document.getElementById('expanded-content')
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }

  return (
    <section id="about" className="bg-[#040202]">
      <div className="container mx-auto px-4">
        <div className="section-title">
          <h2>{t('about.title')}</h2>
        </div>
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 aspect-[3/4] relative rounded-lg overflow-hidden"
          >
            <Image
              src="/images/about/about-image.jpg"
              alt="Melanie Wainwright"
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <h2 className="heading-lg mb-4">
              {t('about.title')}
            </h2>
            <div className="w-12 h-0.5 bg-[#C8A97E] mb-6"></div>
            <p className="text-lg text-white/80 mb-8">
              {t('about.description')}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/60">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <button
              onClick={handleReadMore}
              className="button-text bg-[#C8A97E] hover:bg-[#B69A6E] text-black px-8 py-3 rounded-full transition-colors"
            >
              {isExpanded ? t('about.readLess') : t('about.readMore')}
            </button>
          </motion.div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id="expanded-content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-16"
            >
              <div className="grid md:grid-cols-2 gap-12">
                {/* Philosophy */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {t('about.philosophy.title')}
                  </h3>
                  <p className="text-white/80">
                    {t('about.philosophy.description')}
                  </p>
                </motion.div>

                {/* Approach */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {t('about.approach.title')}
                  </h3>
                  <p className="text-white/80">
                    {t('about.approach.description')}
                  </p>
                </motion.div>

                {/* Certifications */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="md:col-span-2"
                >
                  <h3 className="text-xl font-bold text-white mb-3">
                    {t('about.certifications.title')}
                  </h3>
                  <ul className="list-disc list-inside text-white/80 space-y-2">
                    {(t('about.certifications.list', { returnObjects: true }) as string[]).map((cert: string, index: number) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
} 