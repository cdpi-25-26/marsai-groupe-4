import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');

  // Charge la langue sauvegardée au démarrage
  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng') || 'en';
    i18n.changeLanguage(savedLang);
    setCurrentLang(savedLang);
  }, [i18n]);

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
    setCurrentLang(newLang);
    localStorage.setItem('i18nextLng', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="
        px-4 py-2 rounded-full cursor-pointer text-sm font-semibold
        bg-white/30
        text-whtie shadow-md
        transition-all duration-200
        hover:scale-105 active:scale-95
      "
    >
      {currentLang.toUpperCase()}
    </button>
  );
}