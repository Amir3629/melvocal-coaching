import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import type { InitOptions } from 'i18next'

const resources = {
  de: {
    translation: {
      nav: {
        home: "Start",
        services: "Unterricht",
        about: "Über mich",
        references: "Referenzen & Kooperationen",
        testimonials: "Erfahrungen",
        contact: "Kontakt",
      },
      hero: {
        title: "Entdecke deine Stimme",
        subtitle: "Professionelles Vocal Coaching in Berlin",
        cta: "Jetzt buchen"
      },
      music: {
        title: "Meine Musik"
      },
      video: {
        title: "Einblicke"
      },
      services: {
        title: "Angebote",
        singing: {
          title: "Gesangsunterricht",
          description: "Individueller Unterricht für alle Level",
          features: [
            "Stimmbildung",
            "Atemtechnik",
            "Interpretation",
            "Bühnenpräsenz"
          ],
          details: {
            includes: [
              "Stimmanalyse",
              "Individueller Trainingsplan",
              "Aufnahmen",
              "Übe-Material"
            ],
            suitable: [
              "Anfänger",
              "Fortgeschrittene",
              "Profis",
              "Alle Genres"
            ],
            duration: "60-90 min",
            location: "Online & Studio Berlin"
          }
        }
      },
      about: {
        title: "Über mich",
        intro: "Professionelle Sängerin & Vocal Coach",
        expanded: "Mit jahrelanger Erfahrung im Gesangsunterricht...",
        projects: {
          title: "Aktuelle Projekte",
          description: "Entdecken Sie meine aktuellen musikalischen Projekte"
        },
        more: "Mehr erfahren",
        less: "Weniger anzeigen"
      },
      references: {
        title: "Referenzen & Kooperationen"
      },
      testimonials: {
        title: "Erfahrungen"
      },
      contact: {
        title: "Kontakt",
        form: {
          name: "Name",
          email: "E-Mail",
          message: "Nachricht",
          send: "Senden"
        }
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: "Home",
        services: "Lessons",
        about: "About",
        references: "References & Collaborations",
        testimonials: "Testimonials",
        contact: "Contact",
      },
      hero: {
        title: "Discover Your Voice",
        subtitle: "Professional Vocal Coaching in Berlin",
        cta: "Book Now"
      },
      music: {
        title: "My Music"
      },
      video: {
        title: "Insights"
      },
      services: {
        title: "Services",
        singing: {
          title: "Singing Lessons",
          description: "Individual lessons for all levels",
          features: [
            "Voice Training",
            "Breathing Technique",
            "Interpretation",
            "Stage Presence"
          ],
          details: {
            includes: [
              "Voice Analysis",
              "Individual Training Plan",
              "Recordings",
              "Practice Material"
            ],
            suitable: [
              "Beginners",
              "Advanced",
              "Professionals",
              "All Genres"
            ],
            duration: "60-90 min",
            location: "Online & Studio Berlin"
          }
        }
      },
      about: {
        title: "About Me",
        intro: "Professional Singer & Vocal Coach",
        expanded: "With years of experience in vocal training...",
        projects: {
          title: "Current Projects",
          description: "Discover my current musical projects"
        },
        more: "Learn More",
        less: "Show Less"
      },
      references: {
        title: "References & Collaborations"
      },
      testimonials: {
        title: "Testimonials"
      },
      contact: {
        title: "Contact",
        form: {
          name: "Name",
          email: "Email",
          message: "Message",
          send: "Send"
        }
      }
    }
  }
}

const i18nConfig: InitOptions = {
  resources,
  lng: 'de',
  fallbackLng: 'de',
  supportedLngs: ['de', 'en'],
  debug: true,
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
    lookupQuerystring: 'lng',
    lookupLocalStorage: 'language',
    caches: ['localStorage'],
  },
  react: {
    useSuspense: false,
  },
}

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(i18nConfig)

// Log the current language and loaded resources in development
if (process.env.NODE_ENV === 'development') {
  i18n.on('initialized', (options) => {
    console.log('i18next initialized:', options)
  })

  i18n.on('languageChanged', (lng) => {
    console.log('Language changed to:', lng)
  })

  i18n.on('loaded', (loaded) => {
    console.log('i18next loaded:', loaded)
  })
}

export default i18n
