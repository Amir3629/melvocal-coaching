'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './language-switcher';

interface TranslatedTextProps {
  text: string;
  as?: 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  html?: boolean;
  translations?: {
    de: string;
    en: string;
  };
  letterAnimation?: boolean;
}

// Letter animation variants
const letterVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.3,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    y: -10,
    transition: {
      delay: i * 0.01,
      duration: 0.2,
    },
  }),
};

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.01,
      staggerDirection: -1,
      duration: 0.3,
    },
  },
};

// Standard motion props for non-letter animations
const motionProps = {
  initial: { y: 5, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -5, opacity: 0 },
  transition: { 
    duration: 0.4,
    ease: [0.2, 0.65, 0.3, 0.9],
  },
};

export default function TranslatedText({ 
  text, 
  as = 'div', 
  className = '', 
  html = false,
  translations,
  letterAnimation = false
}: TranslatedTextProps) {
  const { currentLang } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(Date.now());
  const prevLangRef = useRef(currentLang);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear any existing timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Only trigger transition if language actually changed
    if (prevLangRef.current !== currentLang) {
      if (translations) {
        setIsTransitioning(true);
        
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Generate a new key to force re-render of animation components
        setKey(Date.now());
        
        // Set the translated text based on current language
        const newText = currentLang === 'de' ? translations.de : translations.en;
        setTranslatedText(newText);
        
        // Set a timeout to end the transition state
        timeoutRef.current = setTimeout(() => {
          setIsTransitioning(false);
        }, letterAnimation ? 800 : 500);
        
        // Update the previous language ref
        prevLangRef.current = currentLang;
      } else {
        setTranslatedText(text);
      }
    }
  }, [text, currentLang, translations, letterAnimation]);

  // Force update when translations prop changes
  useEffect(() => {
    if (translations) {
      const newText = currentLang === 'de' ? translations.de : translations.en;
      setTranslatedText(newText);
    } else {
      setTranslatedText(text);
    }
  }, [translations, text, currentLang]);

  const combinedClassName = `${className} ${isTransitioning ? 'opacity-90' : ''}`;

  const commonProps = {
    key: `${key}-${translatedText}`,
    ...(translations 
      ? { 'data-notranslate': 'true', className: `${combinedClassName} notranslate` } 
      : { className: combinedClassName }),
  };

  const LetterAnimation = ({ text }: { text: string }) => {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="inline-flex flex-wrap"
        style={{ overflow: 'hidden' }}
      >
        {Array.from(text).map((letter, index) => (
          <motion.span
            key={`letter-${index}-${key}`}
            variants={letterVariants}
            custom={index}
            style={{ 
              display: 'inline-block',
              whiteSpace: letter === ' ' ? 'pre' : 'normal',
              position: 'relative'
            }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  const renderComponent = () => {
    if (letterAnimation && !html) {
      if (as === 'div') {
        return <div {...commonProps}><LetterAnimation text={translatedText} /></div>;
      } else if (as === 'span') {
        return <span {...commonProps}><LetterAnimation text={translatedText} /></span>;
      } else if (as === 'p') {
        return <p {...commonProps}><LetterAnimation text={translatedText} /></p>;
      } else if (as === 'h1') {
        return <h1 {...commonProps}><LetterAnimation text={translatedText} /></h1>;
      } else if (as === 'h2') {
        return <h2 {...commonProps}><LetterAnimation text={translatedText} /></h2>;
      } else if (as === 'h3') {
        return <h3 {...commonProps}><LetterAnimation text={translatedText} /></h3>;
      } else if (as === 'h4') {
        return <h4 {...commonProps}><LetterAnimation text={translatedText} /></h4>;
      } else if (as === 'h5') {
        return <h5 {...commonProps}><LetterAnimation text={translatedText} /></h5>;
      } else if (as === 'h6') {
        return <h6 {...commonProps}><LetterAnimation text={translatedText} /></h6>;
      } else {
        return <div {...commonProps}><LetterAnimation text={translatedText} /></div>;
      }
    }
    
    const standardProps = {
      ...commonProps,
      ...motionProps
    };
    
    if (as === 'div') {
      return html 
        ? <motion.div {...standardProps} dangerouslySetInnerHTML={{ __html: translatedText }} />
        : <motion.div {...standardProps}>{translatedText}</motion.div>;
    } else if (as === 'span') {
      return html 
        ? <motion.span {...standardProps} dangerouslySetInnerHTML={{ __html: translatedText }} />
        : <motion.span {...standardProps}>{translatedText}</motion.span>;
    } else if (as === 'p') {
      return html 
        ? <motion.p {...standardProps} dangerouslySetInnerHTML={{ __html: translatedText }} />
        : <motion.p {...standardProps}>{translatedText}</motion.p>;
    } else if (as === 'h1') {
      return html 
        ? <motion.h1 {...standardProps} dangerouslySetInnerHTML={{ __html: translatedText }} />
        : <motion.h1 {...standardProps}>{translatedText}</motion.h1>;
    } else if (as === 'h2') {
      return html 
        ? <motion.h2 {...standardProps} dangerouslySetInnerHTML={{ __html: translatedText }} />
        : <motion.h2 {...standardProps}>{translatedText}</motion.h2>;
    } else if (as === 'h3') {
      return html 
        ? <motion.h3 {...standardProps} dangerouslySetInnerHTML={{ __html: translatedText }} />
        : <motion.h3 {...standardProps}>{translatedText}</motion.h3>;
    } else if (as === 'h4') {
      return html 
        ? <motion.h4 {...standardProps} dangerouslySetInnerHTML={{ __html: translatedText }} />
        : <motion.h4 {...standardProps}>{translatedText}</motion.h4>;
    } else if (as === 'h5') {
      return html 
        ? <motion.h5 {...standardProps} dangerouslySetInnerHTML={{ __html: translatedText }} />
        : <motion.h5 {...standardProps}>{translatedText}</motion.h5>;
    } else if (as === 'h6') {
      return html 
        ? <motion.h6 {...standardProps} dangerouslySetInnerHTML={{ __html: translatedText }} />
        : <motion.h6 {...standardProps}>{translatedText}</motion.h6>;
    } else {
      return html 
        ? <motion.div {...standardProps} dangerouslySetInnerHTML={{ __html: translatedText }} />
        : <motion.div {...standardProps}>{translatedText}</motion.div>;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {renderComponent()}
    </AnimatePresence>
  );
} 