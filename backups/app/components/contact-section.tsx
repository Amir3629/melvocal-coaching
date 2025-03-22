"use client"

import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactSection() {
  const { t } = useTranslation()

  return (
    <section id="contact" className="bg-[#040202]">
      <div className="container mx-auto px-4">
        <div className="section-title">
          <h2>{t('contact.title')}</h2>
        </div>

        {/* Contact content goes here */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact form */}
          <div>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-white mb-2">{t('contact.form.name')}</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full bg-black/30 border border-gray-700 text-white p-3 rounded-md focus:outline-none focus:border-[#C8A97E]" 
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-white mb-2">{t('contact.form.email')}</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full bg-black/30 border border-gray-700 text-white p-3 rounded-md focus:outline-none focus:border-[#C8A97E]" 
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-white mb-2">{t('contact.form.message')}</label>
                <textarea 
                  id="message" 
                  rows={5} 
                  className="w-full bg-black/30 border border-gray-700 text-white p-3 rounded-md focus:outline-none focus:border-[#C8A97E]"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="bg-[#C8A97E] hover:bg-[#B69A6E] text-black px-6 py-3 rounded-full transition-colors"
              >
                {t('contact.form.submit')}
              </button>
            </form>
          </div>
          
          {/* Contact info */}
          <div>
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-[#C8A97E]/10 p-3 rounded-full mr-4">
                  <Mail className="w-6 h-6 text-[#C8A97E]" />
                </div>
                <div>
                  <h3 className="text-white text-lg font-bold mb-1">{t('contact.email.title')}</h3>
                  <p className="text-white/70">info@melvocalcoaching.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#C8A97E]/10 p-3 rounded-full mr-4">
                  <Phone className="w-6 h-6 text-[#C8A97E]" />
                </div>
                <div>
                  <h3 className="text-white text-lg font-bold mb-1">{t('contact.phone.title')}</h3>
                  <p className="text-white/70">+49 123 456 7890</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#C8A97E]/10 p-3 rounded-full mr-4">
                  <MapPin className="w-6 h-6 text-[#C8A97E]" />
                </div>
                <div>
                  <h3 className="text-white text-lg font-bold mb-1">{t('contact.location.title')}</h3>
                  <p className="text-white/70">Munich, Germany</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 