import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: t('languages.en'), flag: '🇬🇧' },
    { code: 'fr', name: t('languages.fr'), flag: '🇫🇷' },
    { code: 'es', name: t('languages.es'), flag: '🇪🇸' },
    { code: 'ru', name: t('languages.ru'), flag: '🇷🇺' }
  ];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="position-relative">
      <button
        className="btn btn-outline-light d-flex align-items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe size={18} className="me-2" />
        <span className="d-none d-md-inline">
          {languages.find(lang => lang.code === i18n.language)?.name}
        </span>
      </button>

      {isOpen && (
        <div className="dropdown-menu show position-absolute mt-1" style={{ minWidth: '160px' }}>
          {languages.map(language => (
            <button
              key={language.code}
              className={`dropdown-item d-flex align-items-center ${i18n.language === language.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className="me-2">{language.flag}</span>
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;