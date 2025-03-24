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
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover'
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
        <link 
          rel="stylesheet" 
          href={process.env.NODE_ENV === 'production' ? '/vocal-coaching/css/blackbar-fix.css' : '/css/blackbar-fix.css'} 
        />
        <link 
          rel="stylesheet" 
          href={process.env.NODE_ENV === 'production' ? '/vocal-coaching/css/mobile-fixes.css' : '/css/mobile-fixes.css'} 
        />
        <link 
          rel="stylesheet" 
          href={process.env.NODE_ENV === 'production' ? '/vocal-coaching/css/ios-fix.css' : '/css/ios-fix.css'} 
        />
        <link 
          rel="stylesheet" 
          href={process.env.NODE_ENV === 'production' ? '/vocal-coaching/css/critical-fix.css' : '/css/critical-fix.css'} 
        />
        <link 
          rel="stylesheet" 
          href={process.env.NODE_ENV === 'production' ? '/vocal-coaching/css/last-resort.css' : '/css/last-resort.css'} 
        />
        <link 
          rel="stylesheet" 
          href={process.env.NODE_ENV === 'production' ? '/vocal-coaching/css/fix-container.css' : '/css/fix-container.css'} 
        />
        <link 
          rel="stylesheet" 
          href={process.env.NODE_ENV === 'production' ? '/vocal-coaching/css/extend-beyond.css' : '/css/extend-beyond.css'} 
        />
        <link 
          rel="stylesheet" 
          href={process.env.NODE_ENV === 'production' ? '/vocal-coaching/css/negative-margin-fix.css' : '/css/negative-margin-fix.css'} 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#000000" />
        <style>
          {`
            html, body {
              width: 100vw !important;
              max-width: 100vw !important;
              margin: 0 !important;
              padding: 0 !important;
              background-color: black !important;
              overflow-x: hidden !important;
              position: relative !important;
            }
            
            @media screen and (max-width: 926px) {
              body {
                width: 100% !important;
                min-width: 100% !important;
                max-width: 100% !important;
              }
            }
          `}
        </style>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Fix for mobile viewport issues
              document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
              
              // Get actual viewport width - crucial for iOS
              var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
              document.documentElement.style.setProperty('--real-vw', viewportWidth + 'px');
              
              window.addEventListener('resize', function() {
                document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
                document.documentElement.style.setProperty('--real-vw', Math.max(document.documentElement.clientWidth, window.innerWidth || 0) + 'px');
              });
              
              // Direct fix for iOS
              if (/iPad|iPhone|iPod/.test(navigator.userAgent) || ('ontouchstart' in window && /AppleWebKit/.test(navigator.userAgent))) {
                document.documentElement.classList.add('ios-device');
                document.documentElement.style.width = viewportWidth + 'px';
                document.body.style.width = viewportWidth + 'px';
              }
            })();
          `
        }} />
        <script src={process.env.NODE_ENV === 'production' ? '/vocal-coaching/js/ios-viewport-fix.js' : '/js/ios-viewport-fix.js'}></script>
        <script src={process.env.NODE_ENV === 'production' ? '/vocal-coaching/js/dom-observer-fix.js' : '/js/dom-observer-fix.js'} defer></script>
        <script src={process.env.NODE_ENV === 'production' ? '/vocal-coaching/js/fix-ios-viewport.js' : '/js/fix-ios-viewport.js'}></script>
        <script src={process.env.NODE_ENV === 'production' ? '/vocal-coaching/js/ios-fix.js' : '/js/ios-fix.js'}></script>
        <script src={process.env.NODE_ENV === 'production' ? '/vocal-coaching/js/direct-fix.js' : '/js/direct-fix.js'}></script>
      </head>
      <body className={`${roboto.className} w-full min-w-full overflow-x-hidden bg-black`}>
        <MediaProvider>
          <RootClient className={`dark-theme-black ${playfair.variable} ${cormorant.variable} ${montserrat.variable} ${roboto.variable} ${inter.className} antialiased`}>
            {children}
          </RootClient>
        </MediaProvider>
      </body>
    </html>
  )
}