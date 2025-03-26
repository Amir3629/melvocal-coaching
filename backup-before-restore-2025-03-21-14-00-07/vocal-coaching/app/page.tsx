"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { ChevronDown, MapPin, Mail, Phone, Clock, Instagram, Facebook, Youtube, Trophy, Users, Users2 } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import TestimonialSlider from "@/app/components/testimonial-slider"
import Navigation from "@/app/components/navigation"
import EnhancedMusicPlayer from "@/app/components/enhanced-music-player"
import VideoPreview from "@/app/components/video-preview"
import { Music, Mic, Theater, BookOpen } from "lucide-react"
import ParallaxBackground from "@/app/components/parallax-background"
import AboutSectionNew from "@/app/components/about-section-new"
import Certifications from "@/app/components/certifications"
import GallerySection from "@/app/components/gallery-section"
import MusicNotes from "@/app/components/music-notes-animation"
import ContactForm from "@/app/components/contact-form"
import BookingForm from '@/app/components/booking-form'
import Collaborations from "@/app/components/collaborations"
import ServiceCard from "@/app/components/service-card"
import ServicesSection from "./components/services-section"
import MusicPlayer from "@/app/components/music-player"
import SimpleMusicPlayer from "@/app/components/simple-music-player"
import FlipCards from './components/flip-cards'
import AboutSectionFixed from "@/app/components/about-section-fixed"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)
  const levelDropdownRef = useRef<HTMLDivElement>(null)
  const serviceDropdownRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  const [isLevelOpen, setIsLevelOpen] = useState(false)
  const [isServiceOpen, setIsServiceOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    level: "",
    service: ""
  })

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  const levels = [
    { value: "beginner", label: "Anfänger" },
    { value: "intermediate", label: "Fortgeschritten" },
    { value: "advanced", label: "Profi" }
  ]

  const services = [
    { value: "private", label: "Private Gesangsstunden" },
    { value: "jazz", label: "Jazz Improvisation" },
    { value: "performance", label: "Aufführungs Coaching" },
    { value: "piano", label: "Piano/Vocal-Koordination" }
  ]

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (levelDropdownRef.current && !levelDropdownRef.current.contains(event.target as Node)) {
        setIsLevelOpen(false)
      }
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target as Node)) {
        setIsServiceOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth"
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
  }

  useEffect(() => {
    // Verify that all sections are properly rendered
    const sections = ['hero', 'services', 'about', 'testimonials', 'contact']
    sections.forEach(id => {
      const element = document.getElementById(id)
      if (!element) {
        console.error(`Section with id "${id}" not found`)
      } else {
        console.log(`Section with id "${id}" found`)
      }
    })
  }, [isLoaded])

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0A0A0A]">
      <Navigation />

      {/* Hero Section with Parallax Piano Background */}
      <section id="hero" ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/vocal-coaching/images/backgrounds/hero-bg.jpg"
            alt="Background"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Image failed to load');
              const target = e.target as HTMLImageElement;
              target.style.backgroundColor = '#000';
            }}
            onLoad={() => console.log('Image loaded successfully')}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
        </div>

        <motion.div 
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-light mb-6 text-white drop-shadow-lg font-playfair"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Mel jazz
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-white/90 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            Vocal Coaching in Berlin
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <Button 
              size="lg" 
              className="bg-[#C8A97E] hover:bg-[#B89A6F] text-black border-2 border-[#C8A97E] hover:border-[#B89A6F] rounded-full px-8 transition-all duration-300"
              onClick={() => {
                const element = document.getElementById("services")
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              Jetzt Buchen
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Music Player Section */}
      <section className="py-20 px-4 bg-[#040202]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <EnhancedMusicPlayer />
          </motion.div>
        </div>
      </section>

      {/* Video Preview Section */}
      <section className="py-20 px-4 bg-[#040202]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-heading mb-4">Video Preview</h2>
            <div className="w-24 h-0.5 bg-[#C8A97E] mx-auto opacity-80"></div>
          </motion.div>
          <VideoPreview />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative w-full py-20 bg-[#040202]">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Image
            src="/vocal-coaching/images/backgrounds/services-bg.jpg"
            alt="Services Background"
            fill
            className="object-cover opacity-50"
            style={{
              transition: 'transform 5s ease-in-out, opacity 5s ease-in-out',
              transform: 'scale(1.01)' // Very slight scale to prevent any visible edges
            }}
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#040202]/80 via-[#040202]/60 to-[#040202]/80" 
               style={{ transition: 'opacity 5s ease-in-out' }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_#040202_90%)] opacity-80"
               style={{ transition: 'opacity 5s ease-in-out' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">Vocal Excellence</h2>
            <div className="w-24 h-0.5 bg-[#C8A97E] mx-auto opacity-80"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
            <ServiceCard
              title="Singen"
              subtitle="Event Performances"
              description="Bereichern Sie Ihre Veranstaltung mit professionellem Gesang - von intimen Zusammenkünften bis hin zu großen Feiern. Verfügbar als Solo-Künstlerin oder mit vollständiger Band-Begleitung."
              icon={<Music className="w-6 h-6" />}
              image={process.env.NODE_ENV === 'production' ? "/vocal-coaching/images/services/singing.jpg" : "/images/services/singing.jpg"}
              features={[
                "Preisgekrönte Sängerin mit über 1000 Auftritten",
                "Beherrschung verschiedener Genres (Jazz, Pop, Soul, Klassik)",
                "Anpassbares Repertoire für Ihr Event",
                "Perfekte zweisprachige Darbietungen (Englisch/Deutsch)",
                "Dynamische Bühnenpräsenz mit über 20 Jahren Erfahrung"
              ]}
              details={{
                includes: [
                  "Umfassender Soundcheck & technische Vorbereitung",
                  "Hochwertige professionelle Tonausrüstung",
                  "Flexible Auftrittszeiten (1-4 Stunden)",
                  "Vorgespräch für individuelle Planung",
                  "Backup-Musiker auf Anfrage"
                ],
                suitable: [
                  "Hochzeiten & romantische Anlässe",
                  "Firmengalas & Produkteinführungen",
                  "Theaterproduktionen & kulturelle Events",
                  "Private Feiern & exklusive Partys"
                ],
                duration: "Angepasst an Ihren Zeitplan",
                location: "Berlin/Brandenburg + nationale Tourneen"
              }}
            />
            <ServiceCard
              title="Vocal Coaching"
              subtitle="CVT Mastery"
              description="Entdecken Sie Ihre authentische Stimme durch die revolutionäre Complete Vocal Technique® - die wissenschaftlich fundierte Methode, der Grammy-Gewinner und Broadway-Stars vertrauen. Als eine von nur 3 zertifizierten CVT-Lehrerinnen in Berlin biete ich exklusives Training."
              icon={<Mic className="w-6 h-6" />}
              image={process.env.NODE_ENV === 'production' ? "/vocal-coaching/images/services/coaching.jpg" : "/images/services/coaching.jpg"}
              features={[
                "Zertifizierte Complete Vocal Technique® Lehrerin",
                "Stimmumfang • Ausdauer • Stilvielfalt",
                "Wissenschaftlich fundiertes Verletzungspräventionssystem",
                "Integration von Performancepsychologie",
                "Multi-Genre-Beherrschung (Pop/Jazz/Musical/Klassik)"
              ]}
              details={{
                includes: [
                  "CVT's 4 Vocal Modes & Effekte Beherrschung",
                  "Bühnenpräsenz & Mikrofontechnik",
                  "Vorbereitung auf Vorsingen/Aufnahmen",
                  "Stimmgesundheit",
                  "Persönliche Markenentwicklung"
                ],
                suitable: [
                  "Professionelle Sänger auf Erfolgskurs",
                  "Fortgeschrittene Vokalisten für Tourneen/Alben",
                  "Musical-Theater-Darsteller",
                  "Gesangslehrer zur Methodenerweiterung"
                ],
                duration: "60/90-Minuten Sessions • Paketrabatte verfügbar",
                location: "Charlottenburg Studio • Zoom Pro Sessions"
              }}
            />
            <ServiceCard
              title="Workshop"
              subtitle="Group Mastery"
              description="Transformieren Sie Gruppendynamiken durch wissenschaftlich fundiertes Stimmtraining - von Universitäts-Masterclasses bis hin zu Teambuilding-Maßnahmen. Als Berlins autorisierte Complete Vocal Technique® Spezialistin erstelle ich maßgeschneiderte Workshops."
              icon={<Theater className="w-6 h-6" />}
              image={process.env.NODE_ENV === 'production' ? "/vocal-coaching/images/services/workshop.jpg" : "/images/services/workshop.jpg"}
              features={[
                "Nur 3. CVT-zertifizierte Lehrerin in Berlin",
                "Akkreditierte Lehrmethoden auf Universitätsniveau",
                "Teambuilding durch stimmliche Synchronisation",
                "Multi-Gruppen-Expertise (Chöre/Ensembles/Unternehmen)",
                "Performancepsychologie für kollektives Selbstvertrauen"
              ]}
              details={{
                includes: [
                  "CVT Gruppen-Resonanz-Techniken",
                  "Chor-Stimmverschmelzung & Texturkontrolle",
                  "Stimm-Empowerment für Unternehmen",
                  "Ensemble-Improvisationsrahmen",
                  "Bühnenchemie-Entwicklung"
                ],
                suitable: [
                  "Universitäts-Musikabteilungen",
                  "Professionelle Chöre & Vokalgruppen",
                  "Teambuilding-Retreats für Unternehmen",
                  "Bands auf der Suche nach Harmonien",
                  "Theater-Ensembles"
                ],
                duration: "3-Stunden-Intensiv (€600) • Ganztägige Masterclass",
                location: "Ihr Standort • Mein Studio • Hybride Formate"
              }}
            />
            <ServiceCard
              title="Chor Next Door"
              subtitle="Gemeinsam Singen"
              description="Entdecken Sie die Freude am gemeinsamen Singen in unserem dynamischen Nachbarschaftschor - für alle Levels offen."
              icon={<Users2 className="w-6 h-6" />}
              image={process.env.NODE_ENV === 'production' ? "/vocal-coaching/images/services/chor.jpg" : "/images/services/chor.jpg"}
              features={[
                "Mehrstimmigkeit",
                "Harmonie",
                "Rhythmus",
                "Gemeinschaft"
              ]}
              details={{
                includes: [
                  "Stimmbildung",
                  "Chorgesang",
                  "Auftritte",
                  "Events"
                ],
                suitable: [
                  "Alle Level",
                  "Nachbarn",
                  "Musikbegeisterte"
                ],
                duration: "90-120 Minuten",
                location: "Studio Berlin"
              }}
              link="https://chornextdoor.de"
            />
          </div>

          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Button 
              size="lg"
              className="bg-[#C8A97E] hover:bg-[#B89A6F] text-black rounded-full px-8"
              onClick={() => setIsBookingModalOpen(true)}
            >
              Jetzt Buchen
            </Button>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about">
        <AboutSectionFixed />
      </section>

      {/* References Section */}
      <section className="py-20 bg-[#040202]">
        <GallerySection />
        <Collaborations />
      </section>

      {/* Expertise Cards Section - Moved after gallery */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-heading text-center mb-12">Faszinierend & Musikalisch</h2>
          <FlipCards />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative w-full bg-[#040202] py-16">
        <div className="container mx-auto px-4">
          <TestimonialSlider />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-20 bg-[#040202]">
        <ContactForm />
      </section>

      <BookingForm isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
    </div>
  )
}

