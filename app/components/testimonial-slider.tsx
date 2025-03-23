"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { getImagePath } from "@/app/utils/image-path"

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    role: "Jazz-Sängerin",
    content: "Melanies Unterricht hat meine Herangehensweise an den Jazzgesang komplett verändert. Ihre Techniken für Improvisation und Stimmkontrolle waren unglaublich wertvoll für meine Auftritte.",
    image: "/images/testimonials/sarah.jpg"
  },
  {
    id: 2,
    name: "Thomas K.",
    role: "Hobby-Sänger",
    content: "Der Unterricht bei Melanie hat mir nicht nur gesanglich, sondern auch musikalisch völlig neue Perspektiven eröffnet. Ihre Methodik ist präzise und gleichzeitig sehr inspirierend.",
    image: "/images/testimonials/thomas.jpg"
  },
  {
    id: 3,
    name: "Lisa B.",
    role: "Professional Singer",
    content: "The performance coaching helped me tremendously in overcoming my stage fright. Melanie knows how to work with each student individually and teach the right techniques. Her approach to stage presence and vocal technique is exceptional.",
    image: "/images/testimonials/lisa.jpg"
  },
  {
    id: 4,
    name: "Michael R.",
    role: "Band-Mitglied",
    content: "Die Kombination aus Piano und Gesang ist genau das, was ich gesucht habe. Melanie's ganzheitlicher Ansatz hat mir geholfen, beide Bereiche besser zu koordinieren.",
    image: "/images/testimonials/michael.jpg"
  },
  {
    id: 5,
    name: "Julia W.",
    role: "Anfängerin",
    content: "Als absolute Anfängerin war ich erst unsicher, aber Melanie hat es geschafft, meine Begeisterung für Jazz zu wecken. Ihre geduldige Art und ihr strukturierter Unterricht sind perfekt für Einsteiger.",
    image: "/images/testimonials/julia.jpg"
  },
  {
    id: 6,
    name: "David S.",
    role: "Musikstudent",
    content: "Als Musikstudent war ich auf der Suche nach einer Gesangslehrerin, die mich technisch und künstlerisch weiterbringt. Bei Melanie habe ich genau das gefunden.",
    image: "/images/testimonials/david.jpg"
  },
  {
    id: 7,
    name: "Anna L.",
    role: "Jazz-Enthusiastin",
    content: "Die Atmosphäre in Melanies Unterricht ist einzigartig. Sie schafft es, eine perfekte Balance zwischen technischer Präzision und künstlerischer Freiheit zu finden.",
    image: "/images/testimonials/anna.jpg"
  },
  {
    id: 8,
    name: "James R.",
    role: "International Student",
    content: "As an international student from London, I was thrilled to find such an exceptional vocal coach in Berlin. Melanie's approach to jazz vocals combines technical expertise with artistic freedom. Her methods have significantly improved my vocal range and improvisation skills.",
    image: "/images/testimonials/james.jpg"
  },
  {
    id: 9,
    name: "Elena P.",
    role: "Semi-Professional",
    content: "Durch Melanies Coaching konnte ich meine Gesangstechnik deutlich verbessern. Ihre Expertise in der Jazz-Improvisation ist beeindruckend.",
    image: "/images/testimonials/elena.jpg"
  }
];

export default function TestimonialSlider() {
  const [page, setPage] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({})
  const [imagesLoaded, setImagesLoaded] = useState<{[key: number]: boolean}>({})
  
  // Manual image load handler
  const handleImageLoad = (id: number) => {
    setImagesLoaded(prev => ({...prev, [id]: true}));
  }
  
  // Manual error handler
  const handleImageError = (id: number) => {
    setImageErrors(prev => ({...prev, [id]: true}));
  }
  
  // Preload images and set up autoplay
  useEffect(() => {
    // Preload all images with proper error handling
    testimonials.forEach((testimonial) => {
      try {
        const img = new window.Image();
        img.onload = () => {
          handleImageLoad(testimonial.id);
        };
        img.onerror = () => {
          handleImageError(testimonial.id);
        };
        img.src = getImagePath(testimonial.image);
      } catch (error) {
        // Fallback for any errors
        handleImageError(testimonial.id);
      }
    });
    
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setPage((prevPage) => (prevPage + 1) % testimonials.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isAutoPlaying])

  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  const handlePrevious = () => {
    setPage((prevPage) => (prevPage - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setPage((prevPage) => (prevPage + 1) % testimonials.length)
  }

  return (
    <section className="py-8 bg-[#040202]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="section-heading mb-4 text-white">
            Was meine Schüler sagen
          </h2>
          <div className="w-20 h-0.5 bg-[#C8A97E] mx-auto"></div>
        </motion.div>

        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-black/30 rounded-xl p-6 sm:p-8 md:p-10 backdrop-blur-sm min-h-[400px] flex items-center"
            >
              <div className="flex flex-col items-center text-center w-full h-full">
                {/* Ultimate reliable approach for circular images */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4 sm:mb-6">
                  <div className="absolute inset-0 rounded-full overflow-hidden bg-[#111]">
                    {!imageErrors[testimonials[page].id] ? (
                      <img
                        src={getImagePath(testimonials[page].image)}
                        alt={testimonials[page].name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover circle-image"
                        style={{
                          minWidth: "120%",
                          minHeight: "120%",
                          maxWidth: "none",
                          maxHeight: "none",
                          position: "absolute",
                          left: "-10%",
                          top: "-10%",
                        }}
                        onError={() => handleImageError(testimonials[page].id)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#080808]">
                        <span className="text-[#C8A97E] text-2xl font-semibold">
                          {testimonials[page].name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Gold border overlay */}
                  <div className="absolute inset-0 rounded-full border-2 border-[#C8A97E] opacity-70 z-10"></div>
                </div>

                <div className="max-w-2xl mx-auto mb-6 flex-1 flex items-center justify-center h-[160px] sm:h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#C8A97E]/40 scrollbar-track-transparent hover:scrollbar-thumb-[#C8A97E]/60">
                  <p className="text-gray-300 text-base sm:text-lg italic px-2 sm:px-4">"{testimonials[page].content}"</p>
                </div>

                <div className="flex flex-col items-center mt-auto pt-4 shrink-0">
                  <cite className="text-[#C8A97E] font-medium not-italic">
                    {testimonials[page].name}
                  </cite>
                  <span className="text-gray-400 text-sm">
                    {testimonials[page].role}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={handlePrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-all"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-all"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </section>
  )
} 