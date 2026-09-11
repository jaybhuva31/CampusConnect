import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import gu from './locales/gu.json';
import hi from './locales/hi.json';

// Fetch stored language preference, strictly default to 'en'
const storedLanguage = localStorage.getItem('preferredLanguage') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      gu: { translation: gu },
      hi: { translation: hi },
    },
    lng: storedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already escapes values
    },
  });

export default i18n;
