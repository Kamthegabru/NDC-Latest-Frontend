import { useLanguageStore } from "../store/useLanguageStore";

const useTranslation = () => {
  const { locale, messages, setLocale, setMessages } = useLanguageStore();

  const t = (key) => {
    const keys = key.split(".");
    return keys.reduce((acc, curr) => acc?.[curr], messages) || key;
  };

  const changeLanguage = (newLocale, newMessages) => {
    setLocale(newLocale);
    setMessages(newMessages);
  };

  return { t, locale, changeLanguage };
};

export default useTranslation;
