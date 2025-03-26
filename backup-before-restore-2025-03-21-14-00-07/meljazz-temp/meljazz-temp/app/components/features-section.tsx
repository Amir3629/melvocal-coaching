"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../i18n/client';
import { Mic, Music, Star, Flask } from 'lucide-react';

export default function FeaturesSection() {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: <Mic className="w-10 h-10 text-[#C8A97E]" />,
      title: "Deine Stimme, Verstärkt",
      description: "Entdecke dein volles Potenzial"
    },
    {
      icon: <Music className="w-10 h-10 text-[#C8A97E]" />,
      title: "Das Geheimnis des Jazz-Flüsterers",
      description: "Lerne die Kunst der Improvisation"
    },
    {
      icon: <Star className="w-10 h-10 text-[#C8A97E]" />,
      title: "Bühnenphysik 101",
      description: "Deine Stimme ist klüger als gedacht"
    },
    {
      icon: <Flask className="w-10 h-10 text-[#C8A97E]" />,
      title: "Stimmliche Alchemie",
      description: "Die 4-Uhr-Wahrheiten des stimmlichen Erfolgs"
    }
  ];

  return (
    <section id="features" className="py-4 bg-black">
      <div className="container mx-auto px-4">
        <div className="section-title">
          <h2>
            {t('features.title', 'Faszinierend & Musikalisch')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-[#101010] p-6 rounded-lg border border-gray-800 hover:border-[#C8A97E] transition-colors duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 