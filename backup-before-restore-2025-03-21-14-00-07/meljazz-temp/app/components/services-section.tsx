"use client"

import { Music, Mic, Users2, Theater } from "lucide-react"
import ServiceCard from "./service-card"
import { motion } from "framer-motion"
import { useLanguage } from "./language-switcher"
import { useTranslation } from '../hooks/use-translation'

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
  const { currentLanguage } = useLanguage()
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
    <section id="services" className="py-20 bg-neutral-100 dark:bg-neutral-900 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('services.title')}</h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            {t('services.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-12">
          <ServiceCard
            title={t('services.singing.title')}
            subtitle={t('services.singing.subtitle')}
            description={t('services.singing.description')}
            features={t('services.singing.features')}
            details={t('services.singing.details')}
            image="/images/services/singing.jpg"
            icon="microphone"
            delay={0.1}
            link={`/booking?service=${currentLanguage === 'en' ? 'live-singing' : 'professioneller-gesang'}`}
          />
          
          <ServiceCard
            title={t('services.coaching.title')}
            subtitle={t('services.coaching.subtitle')}
            description={t('services.coaching.description')}
            features={t('services.coaching.features')}
            details={t('services.coaching.details')}
            image="/images/services/coaching.jpg"
            icon="music"
            delay={0.2}
            link={`/booking?service=${currentLanguage === 'en' ? 'vocal-coaching' : 'gesangsunterricht'}`}
          />
          
          <ServiceCard
            title={t('services.workshop.title')}
            subtitle={t('services.workshop.subtitle')}
            description={t('services.workshop.description')}
            features={t('services.workshop.features')}
            details={t('services.workshop.details')}
            image="/images/services/workshop.jpg"
            icon="users"
            delay={0.3}
            link={`/booking?service=workshop`}
          />
          
          <ServiceCard
            title={t('services.chor.title')}
            subtitle={t('services.chor.subtitle')}
            description={t('services.chor.description')}
            features={t('services.chor.features')}
            details={t('services.chor.details')}
            image="/images/services/chor.jpg"
            icon="music-note"
            delay={0.4}
            link="https://www.thechornextdoor.com"
          />
        </div>
      </div>
    </section>
  )
} 