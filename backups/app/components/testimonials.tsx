"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    role: "Musikstudentin",
    image: "/images/testimonials/sarah.jpg",
    text: "Melanie ist eine außergewöhnliche Gesangslehrerin. Ihre Methodik hat mir geholfen, meine Stimme auf ein neues Level zu bringen. Besonders die Atemtechnik und Stimmkontrolle haben sich stark verbessert."
  },
  {
    id: 2,
    name: "Thomas K.",
    role: "Hobby-Sänger",
    image: "/images/testimonials/thomas.jpg",
    text: "Die Jazz-Improvisationskurse sind fantastisch. Ich habe nicht nur technisch dazugelernt, sondern auch meine kreative Seite entdeckt. Melanies Begeisterung für Musik ist ansteckend!"
  },
  {
    id: 3,
    name: "Lisa B.",
    role: "Professionelle Sängerin",
    image: "/images/testimonials/lisa.jpg",
    text: "Das Aufführungscoaching hat mir sehr geholfen, meine Bühnenangst zu überwinden. Melanie versteht es, individuell auf jeden Schüler einzugehen und die richtigen Techniken zu vermitteln."
  },
  {
    id: 4,
    name: "Michael R.",
    role: "Band-Mitglied",
    image: "/images/testimonials/michael.jpg",
    text: "Die Kombination aus Piano und Gesang ist genau das, was ich gesucht habe. Melanie's ganzheitlicher Ansatz hat mir geholfen, beide Bereiche besser zu koordinieren."
  },
  {
    id: 5,
    name: "Julia W.",
    role: "Anfängerin",
    image: "/images/testimonials/julia.jpg",
    text: "Als absolute Anfängerin war ich erst unsicher, aber Melanie hat mir die Angst genommen. Ihre geduldige Art und strukturierte Herangehensweise sind perfekt für Einsteiger."
  }
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-[#080505]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Was meine Schüler sagen
          </h2>
          <div className="w-20 h-0.5 bg-[#C8A97E] mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-[#0A0A0A] rounded-xl p-6 border border-[#C8A97E]/20"
            >
              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#C8A97E]/20">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-white font-medium">{testimonial.name}</h3>
                  <p className="text-[#C8A97E] text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-400 italic">"{testimonial.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 