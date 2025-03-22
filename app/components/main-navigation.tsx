"use client"

import React from 'react'
import Link from 'next/link'

interface NavigationLinkProps {
  href: string;
  label: string;
}

export default function MainNavigationLink({ href, label }: NavigationLinkProps) {
  return (
    <Link
      href={href}
      className="text-white hover:text-white/80 transition-colors duration-300"
    >
      {label}
    </Link>
  )
} 