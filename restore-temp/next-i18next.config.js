module.exports = {
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    localeDetection: true,
  },
  localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
} 