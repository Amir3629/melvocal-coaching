"use client"

import React, { Fragment, useRef, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'

interface LegalDocumentModalProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  title?: string
}

export default function LegalDocumentModal({ 
  children, 
  isOpen, 
  onClose,
  title
}: LegalDocumentModalProps) {
  const cancelButtonRef = useRef(null)
  const contentRef = useRef<HTMLDivElement>(null)
  
  // Prevent scroll propagation when reaching the top or bottom of the modal content
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const { currentTarget } = e;
    const isAtTop = currentTarget.scrollTop === 0;
    const isAtBottom = 
      currentTarget.scrollHeight - currentTarget.scrollTop <= currentTarget.clientHeight + 1;
    
    if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-[1000]" 
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
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel 
                className="relative transform overflow-hidden rounded-lg bg-[#121212] border border-gray-800 text-left shadow-xl transition-all my-4 w-full max-w-2xl mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
                  {title && <h2 className="text-xl font-semibold text-white mb-0.5">{title}</h2>}
                  <div className={title ? '' : 'ml-auto'}>
                    <motion.button
                      type="button"
                      className="text-gray-400 hover:text-white focus:outline-none transition-all duration-200"
                      onClick={onClose}
                      ref={cancelButtonRef}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="sr-only">Close</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </motion.button>
                  </div>
                </div>
                <div 
                  ref={contentRef}
                  onWheel={handleWheel}
                  className="max-h-[70vh] overflow-y-auto custom-scrollbar px-8 pt-5 pb-8 legal-document-content overscroll-contain"
                >
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