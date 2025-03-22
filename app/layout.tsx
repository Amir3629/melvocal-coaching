import './globals.css'
import './mobile-fixes.css'
import type { Metadata } from 'next'
import { Playfair_Display, Cormorant, Montserrat, Roboto, Inter } from 'next/font/google'
import ClientProviders from '@/app/providers/client-providers'
import RootClient from '@/app/components/root-client'
import { MediaProvider } from './components/media-context'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-playfair',
  display: 'swap',
})

const cormorant = Cormorant({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})

const roboto = Roboto({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-roboto',
  display: 'swap',
})

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Mel jazz - Vocal Coaching in Berlin",
  description: "Professional vocal coaching and performance in Berlin",
  icons: {
    icon: [
      { url: process.env.NODE_ENV === 'production' ? '/melvocal-coaching/favicon.ico' : '/favicon.ico' },
      { url: process.env.NODE_ENV === 'production' ? '/melvocal-coaching/images/logo/ml-logo.PNG' : '/images/logo/ml-logo.PNG', type: 'image/png', sizes: '64x64' }
    ],
    shortcut: { url: process.env.NODE_ENV === 'production' ? '/melvocal-coaching/images/logo/ml-logo.PNG' : '/images/logo/ml-logo.PNG', sizes: '196x196' },
    apple: { url: process.env.NODE_ENV === 'production' ? '/melvocal-coaching/images/logo/ml-logo.PNG' : '/images/logo/ml-logo.PNG', sizes: '180x180' },
    other: [
      {
        url: process.env.NODE_ENV === 'production' ? '/melvocal-coaching/favicon/site.webmanifest' : '/favicon/site.webmanifest',
        rel: 'manifest'
      }
    ]
  },
  manifest: process.env.NODE_ENV === 'production' ? '/melvocal-coaching/favicon/site.webmanifest' : '/favicon/site.webmanifest',
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
          href={process.env.NODE_ENV === 'production' ? '/melvocal-coaching/images/logo/ml-logo.PNG' : '/images/logo/ml-logo.PNG'} 
          sizes="64x64" 
          type="image/png" 
        />
        <link 
          rel="apple-touch-icon" 
          href={process.env.NODE_ENV === 'production' ? '/melvocal-coaching/images/logo/ml-logo.PNG' : '/images/logo/ml-logo.PNG'} 
          sizes="180x180" 
        />
      </head>
      <body className={`${inter.className} max-w-[100vw] overflow-x-hidden w-full`}>
        <MediaProvider>
          <RootClient className={`dark-theme-black ${playfair.variable} ${cormorant.variable} ${montserrat.variable} ${roboto.variable} ${inter.className} antialiased`}>
            <div className="w-full overflow-x-hidden max-w-[100vw]">
              {children}
            </div>
          </RootClient>
        </MediaProvider>
      </body>
    </html>
  )
}