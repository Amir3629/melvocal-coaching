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
  }
]

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-4 bg-[#080505]">
      <div className="container mx-auto px-4">
        <div className="section-title">
          <h2>
            Was meine Schüler sagen
          </h2>
        </div>

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