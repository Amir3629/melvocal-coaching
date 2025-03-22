export interface Translation {
  nav: {
    home: string;
    services: string;
    about: string;
    references: string;
    testimonials: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  music: {
    title: string;
  };
  video: {
    title: string;
  };
  services: {
    title: string;
    singing: {
      title: string;
      description: string;
      features: readonly string[];
      details: {
        includes: readonly string[];
        suitable: readonly string[];
        duration: string;
        location: string;
      };
    };
    coaching: {
      title: string;
      description: string;
      features: readonly string[];
      details: {
        includes: readonly string[];
        suitable: readonly string[];
        duration: string;
        location: string;
      };
    };
    workshop: {
      title: string;
      description: string;
      features: readonly string[];
      details: {
        includes: readonly string[];
        suitable: readonly string[];
        duration: string;
        location: string;
        price: string;
      };
    };
    choir: {
      title: string;
      description: string;
      features: readonly string[];
      details: {
        includes: readonly string[];
        suitable: readonly string[];
        duration: string;
        location: string;
      };
    };
    cta: string;
  };
  about: {
    title: string;
    intro: string;
    expanded: string;
    projects: {
      title: string;
      description: string;
    };
    more: string;
    less: string;
  };
  references: {
    title: string;
  };
  testimonials: {
    title: string;
  };
  contact: {
    title: string;
    form: {
      name: string;
      email: string;
      message: string;
      send: string;
    };
  };
  footer: {
    subtitle: string;
    legal: {
      privacy: string;
      terms: string;
      imprint: string;
    };
    copyright: string;
    rights: string;
  };
  booking: {
    title: string;
    steps: {
      service: string;
      date: string;
      time: string;
      contact: string;
      confirm: string;
    };
    form: {
      name: string;
      email: string;
      phone: string;
      message: string;
      terms: string;
      privacy: string;
    };
    buttons: {
      next: string;
      back: string;
      book: string;
      close: string;
    };
  };
}

export const translations = {
  DE: {
    nav: {
      home: "Start",
      services: "Angebote",
      about: "Über mich",
      references: "Referenzen",
      testimonials: "Erfahrungen",
      contact: "Kontakt"
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
        title: "Professioneller Gesang",
        description: "Gesangsauftritte für Events und Veranstaltungen",
        features: [
          "Live-Auftritte",
          "Hochzeiten & Feiern",
          "Firmenevents",
          "Maßgeschneiderte Programme"
        ],
        details: {
          includes: [
            "Professionelle Darbietung",
            "Flexible Songauswahl",
            "Technische Betreuung",
            "Anpassung an Ihr Event"
          ],
          suitable: [
            "Hochzeiten",
            "Firmenfeiern",
            "Kulturelle Events",
            "Private Veranstaltungen"
          ],
          duration: "Nach Vereinbarung",
          location: "Vor Ort oder online"
        }
      },
      coaching: {
        title: "Vocal Coaching",
        description: "CVT-basiertes Stimmtraining für alle Genres",
        features: [
          "Complete Vocal Technique",
          "Stimmgesundheit",
          "Genrespezifisches Training",
          "Individuelle Betreuung"
        ],
        details: {
          includes: [
            "CVT Stimmanalyse",
            "Personalisierter Trainingsplan",
            "Gesundheitsorientiertes Training",
            "Regelmäßiges Feedback"
          ],
          suitable: [
            "Alle Gesangslevel",
            "Verschiedene Genres",
            "Professionelle Sänger",
            "Gesangslehrer"
          ],
          duration: "60-90 min",
          location: "Online & Studio Berlin"
        }
      },
      workshop: {
        title: "Workshops",
        description: "Gruppenunterricht & Workshops",
        features: [
          "Stimmbildung in der Gruppe",
          "Ensemble-Arbeit",
          "Theorie & Praxis",
          "Performance Training"
        ],
        details: {
          includes: [
            "Theoretische Grundlagen",
            "Praktische Übungen",
            "Gruppendynamik",
            "Abschlussaufführung"
          ],
          suitable: [
            "Chöre",
            "Bands",
            "Ensembles",
            "Schulklassen"
          ],
          duration: "2-4 Stunden",
          location: "Nach Vereinbarung",
          price: "Auf Anfrage"
        }
      },
      choir: {
        title: "Chor Coaching",
        description: "Professionelle Chorleitung",
        features: [
          "Stimmbildung",
          "Harmoniearbeit",
          "Rhythmustraining",
          "Ensemble-Klang"
        ],
        details: {
          includes: [
            "Warm-up Routinen",
            "Stimmbildung",
            "Repertoire-Arbeit",
            "Auftrittsvorbereitung"
          ],
          suitable: [
            "Laienchöre",
            "Professionelle Chöre",
            "Vokalensembles",
            "A-cappella Gruppen"
          ],
          duration: "90-120 min",
          location: "Nach Vereinbarung"
        }
      },
      cta: "Jetzt anfragen"
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
      title: "Referenzen"
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
    },
    footer: {
      subtitle: "Vocal Coaching Berlin",
      legal: {
        privacy: "Datenschutz",
        terms: "AGB",
        imprint: "Impressum"
      },
      copyright: "© 2024 Melanie Wainwright",
      rights: "Alle Rechte vorbehalten"
    },
    booking: {
      title: "Buchung",
      steps: {
        service: "Angebot wählen",
        date: "Datum wählen",
        time: "Zeit wählen",
        contact: "Kontaktdaten",
        confirm: "Bestätigung"
      },
      form: {
        name: "Name",
        email: "E-Mail",
        phone: "Telefon",
        message: "Nachricht",
        terms: "AGB akzeptieren",
        privacy: "Datenschutz akzeptieren"
      },
      buttons: {
        next: "Weiter",
        back: "Zurück",
        book: "Jetzt buchen",
        close: "Schließen"
      }
    }
  },
  EN: {
    nav: {
      home: "Home",
      services: "Services",
      about: "About",
      references: "References",
      testimonials: "Testimonials",
      contact: "Contact"
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
        title: "Professional Singing",
        description: "Vocal performances for events and occasions",
        features: [
          "Live Performances",
          "Weddings & Celebrations",
          "Corporate Events",
          "Customized Programs"
        ],
        details: {
          includes: [
            "Professional Performance",
            "Flexible Song Selection",
            "Technical Support",
            "Adaptation to Your Event"
          ],
          suitable: [
            "Weddings",
            "Corporate Events",
            "Cultural Events",
            "Private Celebrations"
          ],
          duration: "As arranged",
          location: "On-site or online"
        }
      },
      coaching: {
        title: "Vocal Coaching",
        description: "CVT-based voice training for all genres",
        features: [
          "Complete Vocal Technique",
          "Voice Health",
          "Genre-specific Training",
          "Individual Support"
        ],
        details: {
          includes: [
            "CVT Voice Analysis",
            "Personalized Training Plan",
            "Health-oriented Training",
            "Regular Feedback"
          ],
          suitable: [
            "All Singing Levels",
            "Various Genres",
            "Professional Singers",
            "Singing Teachers"
          ],
          duration: "60-90 min",
          location: "Online & Studio Berlin"
        }
      },
      workshop: {
        title: "Workshops",
        description: "Group lessons & workshops",
        features: [
          "Group Voice Training",
          "Ensemble Work",
          "Theory & Practice",
          "Performance Training"
        ],
        details: {
          includes: [
            "Theoretical Foundations",
            "Practical Exercises",
            "Group Dynamics",
            "Final Performance"
          ],
          suitable: [
            "Choirs",
            "Bands",
            "Ensembles",
            "School Classes"
          ],
          duration: "2-4 hours",
          location: "By arrangement",
          price: "On request"
        }
      },
      choir: {
        title: "Choir Coaching",
        description: "Professional Choir Direction",
        features: [
          "Voice Training",
          "Harmony Work",
          "Rhythm Training",
          "Ensemble Sound"
        ],
        details: {
          includes: [
            "Warm-up Routines",
            "Voice Training",
            "Repertoire Work",
            "Performance Preparation"
          ],
          suitable: [
            "Amateur Choirs",
            "Professional Choirs",
            "Vocal Ensembles",
            "A Cappella Groups"
          ],
          duration: "90-120 min",
          location: "By arrangement"
        }
      },
      cta: "Inquire Now"
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
      title: "References"
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
    },
    footer: {
      subtitle: "Vocal Coaching Berlin",
      legal: {
        privacy: "Privacy",
        terms: "Terms",
        imprint: "Imprint"
      },
      copyright: "© 2024 Melanie Wainwright",
      rights: "All rights reserved"
    },
    booking: {
      title: "Booking",
      steps: {
        service: "Choose Service",
        date: "Choose Date",
        time: "Choose Time",
        contact: "Contact Details",
        confirm: "Confirmation"
      },
      form: {
        name: "Name",
        email: "Email",
        phone: "Phone",
        message: "Message",
        terms: "Accept Terms",
        privacy: "Accept Privacy Policy"
      },
      buttons: {
        next: "Next",
        back: "Back",
        book: "Book Now",
        close: "Close"
      }
    }
  } as const
} as const; 