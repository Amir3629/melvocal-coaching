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
        <script dangerouslySetInnerHTML={{
          __html: `
            // Set scrollRestoration to auto - let the browser handle it naturally
            if ('scrollRestoration' in history) {
              history.scrollRestoration = 'auto';
            }
            
            // ULTRA-SIMPLE EMERGENCY FIX
            (function() {
              let savedScrollY = 0;
              
              // Check for modals and handle scroll locking
              function checkForModals() {
                const hasModal = document.querySelector('[role="dialog"], .modal, .fixed.inset-0');
                const isLocked = document.body.classList.contains('modal-open');
                
                if (hasModal && !isLocked) {
                  // Save position and lock
                  savedScrollY = window.scrollY;
                  document.body.classList.add('modal-open');
                  document.body.style.overflow = 'hidden';
                  document.body.style.height = '100%';
                  document.body.style.position = 'relative';
                } 
                else if (!hasModal && isLocked) {
                  // Unlock
                  document.body.classList.remove('modal-open');
                  document.body.style.overflow = '';
                  document.body.style.height = '';
                  document.body.style.position = '';
                  
                  // Restore scroll position directly
                  window.scrollTo(0, savedScrollY);
                }
              }
              
              // Run checks on DOM changes
              new MutationObserver(checkForModals).observe(
                document.body, 
                { childList: true, subtree: true }
              );
              
              // Also check on page load
              document.addEventListener('DOMContentLoaded', checkForModals);
            })();
          `
        }} />
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