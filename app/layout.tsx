import type React from "react"
import "./globals.css"
import "./styles/responsive.css"
import "./styles/typography.css"
import "./styles/theme.css"
import "./styles/navigation-fix.css"
import "./styles/scrollbar.css"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display, Cormorant_Garamond, Montserrat, Roboto } from "next/font/google"
import RootClient from "./components/root-client"
import { MediaProvider } from "./components/media-context"

const inter = Inter({ subsets: ["latin"] })
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '700'],
})
const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
  weight: ['300', '400', '500', '700'],
})
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
})
const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700'],
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
    icon: [
      { url: process.env.NODE_ENV === 'production' ? '/vocal-coaching/favicon.ico' : '/favicon.ico' },
      { url: process.env.NODE_ENV === 'production' ? '/vocal-coaching/images/logo/ml-logo.PNG' : '/images/logo/ml-logo.PNG', type: 'image/png', sizes: '64x64' }
    ],
    shortcut: { url: process.env.NODE_ENV === 'production' ? '/vocal-coaching/images/logo/ml-logo.PNG' : '/images/logo/ml-logo.PNG', sizes: '196x196' },
    apple: { url: process.env.NODE_ENV === 'production' ? '/vocal-coaching/images/logo/ml-logo.PNG' : '/images/logo/ml-logo.PNG', sizes: '180x180' },
    other: [
      {
        url: process.env.NODE_ENV === 'production' ? '/vocal-coaching/favicon/site.webmanifest' : '/favicon/site.webmanifest',
        rel: 'manifest'
      }
    ]
  },
  manifest: process.env.NODE_ENV === 'production' ? '/vocal-coaching/favicon/site.webmanifest' : '/favicon/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${montserrat.variable} ${roboto.variable} scroll-smooth`}>
      <head>
        <link 
          rel="icon" 
          href={process.env.NODE_ENV === 'production' ? '/vocal-coaching/images/logo/ml-logo.PNG' : '/images/logo/ml-logo.PNG'} 
          sizes="64x64" 
          type="image/png" 
        />
        <link 
          rel="apple-touch-icon" 
          href={process.env.NODE_ENV === 'production' ? '/vocal-coaching/images/logo/ml-logo.PNG' : '/images/logo/ml-logo.PNG'} 
          sizes="180x180" 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="/js/dom-observer-fix.js" defer></script>
      </head>
      <body className={roboto.className}>
        <MediaProvider>
          <RootClient className={`dark-theme-black ${playfair.variable} ${cormorant.variable} ${montserrat.variable} ${roboto.variable} ${inter.className} antialiased`}>
            {children}
          </RootClient>
        </MediaProvider>
      </body>
    </html>
  )
}