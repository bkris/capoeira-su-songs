export var LanguageService = (function () {
  const DEFAULT_LANGUAGE = 'eng'
  let _selectedLanguage = null;

  function getLanguage() {
    if (_selectedLanguage) {
      return _selectedLanguage;
    }

    const lang = localStorage.getItem("preferred_language");
    _selectedLanguage = lang ?? DEFAULT_LANGUAGE;
    return _selectedLanguage;
  }

  function storeLanguage(lang) {
    localStorage.setItem("preferred_language", lang);
    _selectedLanguage = lang;
  }

  return {
    getLanguage,
    storeLanguage
  }
})()
