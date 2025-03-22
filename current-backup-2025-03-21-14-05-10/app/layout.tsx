import type React from "react"
import "./globals.css"
import "./styles/responsive.css"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import RootClient from "./components/root-client"
import { MediaProvider } from "./components/media-context"

const inter = Inter({ subsets: ["latin"] })
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: "Mel jazz - Vocal Coaching in Berlin",
  description: "Professional vocal coaching and performance in Berlin",
  icons: {
    icon: process.env.NODE_ENV === 'production' ? '/vocal-coaching/favicon.ico' : '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <MediaProvider>
          <RootClient className={`dark-theme-black ${playfair.variable} ${inter.className} antialiased`}>
            {children}
          </RootClient>
        </MediaProvider>
      </body>
    </html>
  )
} 