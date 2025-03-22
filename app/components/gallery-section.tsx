"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog } from "@/app/components/ui/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { AppImage } from "@/app/components/ui/image"
import { createPortal } from "react-dom"

interface GalleryImage {
  src: string
  alt: string
  span: string
  description: string
  date: string
  location: string
}

const images: GalleryImage[] = [
  {
    src: '/images/gallery/performance1.jpg',
    alt: "Live Performance im B-Flat Jazz Club",
    span: "col-span-1 md:col-span-2",
    description: "Live Performance im B-Flat Jazz Club",
    date: "2024",
    location: "Berlin-Mitte"
  },
  {
    src: '/images/gallery/performance2.jpg',
    alt: "Aufnahmesession im Studio",
    span: "col-span-1",
    description: "Aufnahmesession im Studio",
    date: "2024",
    location: "Recording Studio Berlin"
  },
  {
    src: '/images/gallery/performance3.jpg',
    alt: "Live Concert",
    span: "col-span-1",
    description: "Jazz Festival Auftritt",
    date: "2023",
    location: "Jazztage Berlin"
  },
  {
    src: '/images/gallery/performance4.jpg',
    alt: "Teaching Session",
    span: "col-span-1 md:col-span-2",
    description: "Gesangsunterricht & Workshop",
    date: "2024",
    location: "Vocal Studio"
  },
  {
    src: '/images/gallery/performance5.jpg',
    alt: "Piano Performance",
    span: "col-span-1 md:col-span-2",
    description: "Piano & Vocal Performance",
    date: "2023",
    location: "Jazz Club Berlin"
  },
  {
    src: '/images/gallery/performance6.jpg',
    alt: "Stage Performance",
    span: "col-span-1 md:col-span-2",
    description: "Live Konzert mit Band",
    date: "2024",
    location: "Konzerthaus Berlin"
  },
  {
    src: '/images/gallery/performance7.jpg',
    alt: "Vocal Workshop",
    span: "col-span-1",
    description: "Vocal Workshop Session",
    date: "2024",
    location: "Studio Berlin"
  },
  {
    src: '/images/gallery/performance8.jpg',
    alt: "Jazz Club",
    span: "col-span-1",
    description: "Jazz Club Performance",
    date: "2024",
    location: "A-Trane Berlin"
  },
  {
    src: '/images/gallery/performance9.jpg',
    alt: "Concert Performance",
    span: "col-span-1 md:col-span-2",
    description: "Jazz Concert Evening",
    date: "2024",
    location: "Philharmonie Berlin"
  }
]

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const handleImageClick = (image: GalleryImage) => {
    // Preload the image before showing modal
    const img = new Image()
    img.src = image.src
    img.onload = () => {
      setIsImageLoaded(true)
      document.documentElement.style.overflow = 'hidden'
      setSelectedImage(image)
    }
  }

  const handleClose = () => {
    setSelectedImage(null)
    setIsImageLoaded(false)
    setTimeout(() => {
      document.documentElement.style.overflow = ''
    }, 300)
  }

  const handlePrev = () => {
    if (selectedImage === null) return
    const currentIndex = images.findIndex(img => img.src === selectedImage.src)
    const prevIndex = (currentIndex - 1 + images.length) % images.length
    setSelectedImage(images[prevIndex])
  }

  const handleNext = () => {
    if (selectedImage === null) return
    const currentIndex = images.findIndex(img => img.src === selectedImage.src)
    const nextIndex = (currentIndex + 1) % images.length
    setSelectedImage(images[nextIndex])
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedImage) return
    if (e.key === 'ArrowRight') handleNext()
    if (e.key === 'ArrowLeft') handlePrev()
    if (e.key === 'Escape') handleClose()
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('overflow-hidden')
    }
  }, [selectedImage])

  const renderModal = () => {
    if (!selectedImage) return null

    return (
      <>
        <motion.div
          className="fixed inset-0 bg-black/90 z-[998]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        />

        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <div className="relative w-full max-w-4xl mx-auto">
            <motion.div
              className="relative w-full"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <button 
                className="absolute -left-12 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white p-1.5 rounded-full transition-colors duration-300 z-[1000] hover:bg-black/30"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="relative w-full flex items-center justify-center overflow-hidden">
                <div 
                  className="w-full flex items-center justify-center"
                  style={{ 
                    perspective: '1000px',
                    WebkitPerspective: '1000px'
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedImage.src}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <picture>
                        <source srcSet={selectedImage.src} type="image/jpeg" />
                        <img
                          src={selectedImage.src}
                          alt={selectedImage.alt}
                          className="max-w-full max-h-[75vh] h-auto rounded-lg select-none"
                          style={{
                            objectFit: 'contain',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'translate3d(0, 0, 0)',
                            WebkitTransform: 'translate3d(0, 0, 0)',
                            imageRendering: 'crisp-edges',
                            filter: 'none',
                            WebkitFilter: 'none'
                          }}
                          draggable={false}
                          loading="eager"
                          decoding="sync"
                          onLoad={() => setIsImageLoaded(true)}
                        />
                      </picture>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <button 
                className="absolute -right-12 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white p-1.5 rounded-full transition-colors duration-300 z-[1000] hover:bg-black/30"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </>
    )
  }

  return (
    <section id="gallery" className="relative py-14 md:py-16 bg-[#000000]">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div 
          className="text-center mb-6 md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-heading mb-4">Galerie</h2>
          <div className="w-12 h-0.5 bg-[#C8A97E] mx-auto"></div>
        </motion.div>

        {/* Compact gallery layout with no horizontal gaps */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-1.5 sm:gap-y-2 md:gap-y-2.5 gap-x-0 max-w-[96%] mx-auto">
          {images.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
              className={`relative overflow-hidden cursor-pointer group ${
                index % 5 === 0 ? 'col-span-2 md:col-span-2' : 
                index % 3 === 1 && index > 1 ? 'col-span-1 md:col-span-1' : ''
              }`}
              style={{ 
                aspectRatio: index % 5 === 0 ? '16/9' : '1/1',
                maxHeight: index % 5 === 0 ? '180px' : '140px',
                borderRadius: '8px',
                margin: '0 0.25rem',
                width: 'calc(100% - 0.5rem)'
              }}
              onClick={() => handleImageClick(image)}
            >
              <AppImage
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 480px) 40vw, (max-width: 768px) 30vw, (max-width: 1024px) 25vw, 220px"
                style={{ 
                  objectPosition: 'center',
                  borderRadius: '8px',
                }}
              />
              <div 
                className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ borderRadius: '8px' }}
              >
                <div className="absolute inset-x-0 bottom-0 p-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white text-xs sm:text-sm font-medium line-clamp-1">{image.alt}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {mounted && createPortal(
          <AnimatePresence mode="wait">
            {selectedImage && isImageLoaded && renderModal()}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </section>
  )
} 