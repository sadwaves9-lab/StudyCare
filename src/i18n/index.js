import { translations } from './translations';

let currentLang = 'en';

export function setLanguage(code) {
  if (translations[code]) {
    currentLang = code;
    return true;
  }
  return false;
}

export function getLanguage() {
  return currentLang;
}

export function t(key, fallback) {
  const dict = translations[currentLang] || translations.en;
  return dict[key] || translations.en[key] || fallback || key;
}

export default { t, setLanguage, getLanguage };
