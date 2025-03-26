"use client"

import { Music, Mic, Users2, Theater } from "lucide-react"
import ServiceCard from "./service-card"
import { motion } from "framer-motion"
import { useLanguage } from "./language-switcher"
import { useTranslation } from 'react-i18next'

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

  return (
    <section id="services" className="py-20 bg-[#040202]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-heading mb-4"
          >
            {t('services.title')}
          </motion.h2>
          <div className="w-24 h-0.5 bg-[#C8A97E] mx-auto opacity-80"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-white/10"
          >
            <h3 className="text-xl font-medium text-white mb-4">
              {t('services.singing.title')}
            </h3>
            <p className="text-white/70 mb-6">
              {t('services.singing.description')}
            </p>
            <ul className="space-y-3">
              {getFeatures('singing').map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-white/60">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C8A97E]" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => {
              const details = getDetails(service.key);
              return (
                <ServiceCard
                  key={service.key}
                  title={t(`services.${service.key}.title`)}
                  subtitle={t(`services.${service.key}.subtitle`)}
                  description={t(`services.${service.key}.description`)}
                  icon={<service.icon className="w-6 h-6" />}
                  features={getFeatures(service.key)}
                  details={details}
                  image={service.image}
                  delay={index * 0.2}
                  link={service.link}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  )
} 