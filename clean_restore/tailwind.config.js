/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        md: "2rem",
        lg: "2.5rem",
        xl: "3rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1400px',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-roboto)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        display: ['var(--font-playfair)', 'serif'],
      },
      fontSize: {
        // Mobile-first font sizes
        'display-2xl': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['2rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-xs': ['1.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'body-xl': ['1.125rem', { lineHeight: '1.6' }],
        'body-lg': ['1rem', { lineHeight: '1.6' }],
        'body-base': ['0.9375rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'body-xs': ['0.75rem', { lineHeight: '1.5' }],
        // Tablet and desktop font sizes
        md: {
          'display-2xl': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
          'display-xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
          'display-lg': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
          'display-md': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
          'display-sm': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
          'display-xs': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        },
        lg: {
          'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
          'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
          'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
          'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
          'display-sm': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
          'display-xs': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        }
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        "pulse-slow": {
          '0%, 100%': { opacity: 0 },
          '50%': { opacity: 0.7 },
        },
        "pulse-very-slow": {
          '0%, 100%': { opacity: 0 },
          '50%': { opacity: 0.3 },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 1.5s ease-out",
        "pulse-slow": "pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-very-slow": "pulse-very-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

