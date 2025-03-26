"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Music, Users, Mic2 } from 'lucide-react';

interface StatItemProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  delay: number;
}

const StatItem = ({ value, label, icon, delay }: StatItemProps) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center px-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
    >
      <div className="mb-2 text-[#C8A97E]">
        {icon}
      </div>
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-xs md:text-sm text-gray-400 uppercase tracking-wider text-center">{label}</p>
    </motion.div>
  );
};

export default function StatsSection() {
  return (
    <div className="w-full py-6 md:py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-row justify-center items-center gap-4 md:gap-12">
          <StatItem 
            value="15+" 
            label="Jahre Erfahrung" 
            icon={<Music size={28} strokeWidth={1.5} />} 
            delay={0.1} 
          />
          <StatItem 
            value="500+" 
            label="Studenten unterrichtet" 
            icon={<Users size={28} strokeWidth={1.5} />} 
            delay={0.2} 
          />
          <StatItem 
            value="100+" 
            label="Live Auftritte" 
            icon={<Mic2 size={28} strokeWidth={1.5} />} 
            delay={0.3} 
          />
        </div>
      </div>
    </div>
  );
} 