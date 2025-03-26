"use client"

import React, { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'

interface LegalDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function LegalDocumentModal({ 
  children, 
  isOpen, 
  onClose,
  title
}: LegalDocumentModalProps) {
  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        initialFocus={cancelButtonRef} 
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-[#121212] border border-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                <div className="absolute right-0 top-0 pr-4 pt-4 block z-10">
                  <motion.button
                    type="button"
                    className="rounded-full bg-[#1A1A1A] p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#C8A97E] transition-all duration-200 hover:bg-[#C8A97E]/20"
                    onClick={onClose}
                    ref={cancelButtonRef}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </motion.button>
                </div>
                <div 
                  className="max-h-[80vh] overflow-y-auto p-6"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#C8A97E #1A1A1A',
                  }}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      width: 6px;
                    }
                    div::-webkit-scrollbar-track {
                      background: #1A1A1A;
                      border-radius: 10px;
                    }
                    div::-webkit-scrollbar-thumb {
                      background: #C8A97E;
                      border-radius: 10px;
                    }
                    div::-webkit-scrollbar-thumb:hover {
                      background: #B69A6E;
                    }
                  `}</style>
                  <h2 className="text-2xl font-bold mb-4">{title}</h2>
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
} 