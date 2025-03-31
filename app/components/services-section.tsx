"use client"

import { Music, Mic, Users2, Theater } from "lucide-react"
import ServiceCard from "./service-card"
import { motion } from "framer-motion"
import { useLanguage } from "./language-switcher"
import { useTranslation } from 'react-i18next'
import { useRef, useEffect, useState } from "react"

interface ServiceDetails {
  includes: string[];
  suitable: string[];
  duration: string;
  location: string;
}

interface ServiceTranslation {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  details: ServiceDetails;
}

export default function ServicesSection() {
  const { currentLang } = useLanguage()
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const services = [
    {
      key: 'singing',
      icon: Music,
      image: process.env.NODE_ENV === 'production' 
        ? "/vocal-coaching/images/services/singing.jpg" 
        : "/images/services/singing.jpg"
    },
    {
      key: 'coaching',
      icon: Mic,
      image: process.env.NODE_ENV === 'production'
        ? "/vocal-coaching/images/services/coaching.jpg"
        : "/images/services/coaching.jpg"
    },
    {
      key: 'workshop',
      icon: Theater,
      image: process.env.NODE_ENV === 'production'
        ? "/vocal-coaching/images/services/workshop.jpg"
        : "/images/services/workshop.jpg"
    },
    {
      key: 'choir',
      icon: Users2,
      link: "https://chornextdoor.de",
      image: process.env.NODE_ENV === 'production'
        ? "/vocal-coaching/images/services/chor.jpg"
        : "/images/services/chor.jpg"
    }
  ]

  // Get features as an array safely
  const getFeatures = (key: string): string[] => {
    try {
      const features = t(`services.${key}.features`, { returnObjects: true }) as unknown[];
      return Array.isArray(features) ? features.map(f => String(f)) : [];
    } catch {
      return [];
    }
  };

  // Get details as an object safely
  const getDetails = (key: string): ServiceDetails => {
    try {
      const translatedDetails = t(`services.${key}.details`, { returnObjects: true }) as Record<string, unknown>;
      return {
        includes: Array.isArray(translatedDetails?.includes) ? translatedDetails.includes : [],
        suitable: Array.isArray(translatedDetails?.suitable) ? translatedDetails.suitable : [],
        duration: typeof translatedDetails?.duration === 'string' ? translatedDetails.duration : '',
        location: typeof translatedDetails?.location === 'string' ? translatedDetails.location : ''
      };
    } catch {
      return {
        includes: [],
        suitable: [],
        duration: '',
        location: ''
      };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <section 
      id="services" 
      ref={ref}
      className="py-14 sm:py-16 md:py-20 lg:py-24 bg-black relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,169,126,0.1)_0%,rgba(0,0,0,0)_70%)]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7 }}
          className="text-center mb-8 sm:mb-12"
          >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
            {t('services.title')}
          </h2>
          <div className="w-20 h-0.5 bg-[#C8A97E] mx-auto opacity-80" />
          </motion.div>
          
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className={`
            grid gap-4 sm:gap-6
            ${isMobile 
              ? 'grid-cols-1' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            }
            max-w-7xl mx-auto
          `}
        >
          {services.map((service) => {
            const details = getDetails(service.key)
              return (
              <motion.div
                key={service.key}
                variants={itemVariants}
                className="h-full"
              >
                <ServiceCard
                  title={t(`services.${service.key}.title`)}
                  subtitle={t(`services.${service.key}.subtitle`)}
                  description={t(`services.${service.key}.description`)}
                  icon={<service.icon className="w-5 h-5" />}
                  features={getFeatures(service.key)}
                  details={details}
                  image={service.image}
                  link={service.link}
                />
              </motion.div>
            )
            })}
        </motion.div>
      </div>
    </section>
  )
} 