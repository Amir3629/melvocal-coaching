"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog } from "@/app/components/ui/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { AppImage } from "@/app/components/ui/image"
import { createPortal } from "react-dom"
import { getImagePath } from "@/app/utils/image-path"

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
    img.src = getImagePath(image.src)
    img.onload = () => {
      setIsImageLoaded(true)
      document.documentElement.style.overflow = 'hidden'
      document.body.classList.add('overflow-hidden')
      setSelectedImage(image)
    }
  }

  const handleClose = () => {
    document.documentElement.style.overflow = ''
    document.body.classList.remove('overflow-hidden')
    setSelectedImage(null)
    setIsImageLoaded(false)
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
    if (!selectedImage || !mounted) return null
    
    return createPortal(
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
              onClick={(e) => e.stopPropagation()}
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
                        <source srcSet={getImagePath(selectedImage.src)} type="image/jpeg" />
                        <img
                          src={getImagePath(selectedImage.src)}
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
              
              <button
                className="absolute -top-12 right-0 text-white/70 hover:text-white p-1.5 rounded-full transition-colors duration-300 z-[1000] hover:bg-black/30"
                onClick={handleClose}
                aria-label="Close gallery"
              >
                <X size={24} />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </>,
      document.body
    )
  }

  return (
    <section id="gallery" className="bg-black py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="section-heading mb-4 text-white">Performance & Gallery</h2>
          <div className="w-20 h-0.5 bg-[#C8A97E] mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className={`relative group cursor-pointer overflow-hidden rounded-lg ${image.span} shadow-xl`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{ height: '300px' }}
              onClick={() => handleImageClick(image)}
            >
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <AppImage 
                  src={getImagePath(image.src)}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03] group-hover:brightness-110"
                  sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300"></div>
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