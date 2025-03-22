"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Music } from "lucide-react"

interface Note {
  id: number
  x: number
  delay: number
}

export default function MusicNotes() {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    const generateNotes = () => {
      const newNotes = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2
      }))
      setNotes(newNotes)
    }

    generateNotes()
    const interval = setInterval(generateNotes, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {notes.map((note) => (
        <motion.div
          key={note.id}
          className="absolute text-[#C8A97E]/30"
          initial={{ y: "110%", x: `${note.x}%`, rotate: 0 }}
          animate={{
            y: "-110%",
            rotate: [0, -10, 10, -10, 0],
            transition: {
              y: {
                duration: 8,
                delay: note.delay,
                repeat: Infinity,
                ease: "linear"
              },
              rotate: {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }
            }
          }}
        >
          <Music size={24} />
        </motion.div>
      ))}
    </div>
  )
} 