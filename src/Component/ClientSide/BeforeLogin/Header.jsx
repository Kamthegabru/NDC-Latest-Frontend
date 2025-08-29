import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Globe2 } from "lucide-react";


import useTranslation from "../../hooks/useTranslation"; 

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLangReady, setIsLangReady] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const { t, locale, changeLanguage } = useTranslation();

  const languages = [
    { code: "en", label: "English" },
    { code: "fr", label: "French" },
    { code: "de", label: "German" },
    // { code: "es", label: "Spanish" },
    // { code: "nl", label: "Dutch" },
    { code: "ko", label: "Hindhi" },
  ];

  const handleLanguageChange = async (newLocale) => {
    try {
      const messages = (await import(`../../messages/${newLocale}.json`)).default;
      changeLanguage(newLocale, messages);
    } catch (error) {
      console.error("Failed to load language messages:", error);
    }
  };

  useEffect(() => {
    const initLanguage = async () => {
      try {
        const messages = (await import(`../../messages/en.json`)).default;
        changeLanguage("en", messages);
        setIsLangReady(true);
      } catch (err) {
        console.error("Could not preload en.json", err);
      }
    };

    initLanguage();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLangReady) return null;

  const selectedLabel = languages.find((lang) => lang.code === locale)?.label || "English";

  return (
    <header id="main-header" className="">
      <section className="max-w-[1300px] mx-auto px-6 py-2 flex justify-between items-center">
       
        <a href="/" className="flex cursor-pointer items-center space-x-2">
          <img src="/Images/logo11.png" className="w-24" alt="Global Product Database Logo" />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-white text-md font-medium">
         <a href="../#home">
           <button className="hover:text-[#032B59]  text-white    transition">{t("nav.home")}</button>
          </a>
          <a href="../#pricing" > <button className="hover:text-[#032B59] text-white transition" >{t("nav.stores")}</button></a>
          <a href="../#service" > <button className="hover:text-[#032B59] text-white transition" >{t("nav.how")}</button></a>
          <a href="../#about" > <button className="hover:text-[#032B59] text-white transition" >{t("nav.about")}</button></a>
          <a href="../#contact" > <button className="hover:text-[#032B59] text-white transition" >{t("nav.contact")}</button></a>
        </nav>  

        {/* Right Side */}
        <div className="flex w-auto md:w-[250px] items-center space-x-3">
          {/* Language Selector */}
           <div
      ref={dropdownRef}
      className="hidden md:flex items-center w-[120px] relative"
    >
      <Globe2 size={20} className="text-white mr-1" />
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center justify-between w-full text-white bg-transparent px-2 py-1 border border-gray-500 rounded-md text-sm hover:border-white hover:bg-gray-800 transition"
      >
        <span>{selectedLabel}</span>
        <span className="text-xs">▼</span>
      </button>

      {dropdownOpen && (
        <ul className="absolute left-0 top-full mt-2 w-full bg-white rounded-md shadow-lg border border-gray-200 z-50">
          {languages.map((lang) => (
            <li
              key={lang.code}
              onClick={() => {
                handleLanguageChange(lang.code);
                setDropdownOpen(false);
              }}
              className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition"
            >
              {lang.label}
            </li>
          ))}
        </ul>
      )}
    </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="bg-[#07242D] md:hidden flex p-3 rounded-full text-white"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={16} />}
          </button>

          {/* CTA Buttons */}
         <a href="/login" className="no-underline">
  <button className="
    bg-[#032B59] 
    text-white 
    hidden md:block 
    text-sm 
    font-medium 
    px-4 py-2 
    rounded-lg 
    border-2 border-[#032B59] 
    transition-all duration-300 
    hover:bg-transparent 
    hover:text-[#032B59] 
    hover:border-[#032B59]
  ">
    {t("nav.button1")}
  </button>
</a>


        <a href="/pricing" className="no-underline">
  <button className="
    bg-[#032B59] 
    text-white 
    hidden md:block 
    text-sm 
    font-medium 
    px-5 py-2 
    rounded-lg 
    border-2 border-[#032B59] 
    transition-all duration-300 
    hover:bg-transparent 
    hover:text-[#032B59] 
    hover:border-[#032B59]
    min-w-[130px]
  ">
    {t("nav.button")}
  </button>
</a>

        </div>
      </section>
   
     {mobileMenuOpen && (
  <div className="md:hidden bg-[#031318] border-t-2 border-[#BFFF47] text-white px-4 sm:px-6 py-6 space-y-1">
    <a href="../#home" className="block no-underline text-white hover:text-[#BFFF47] py-3 px-2 transition-colors duration-200 text-base font-medium">{t("nav.home")}</a>
    <a href="../#about" className="block no-underline text-white hover:text-[#BFFF47] py-3 px-2 transition-colors duration-200 text-base font-medium">{t("nav.about")}</a>
    <a href="../#price" className="block no-underline text-white hover:text-[#BFFF47] py-3 px-2 transition-colors duration-200 text-base font-medium">{t("nav.stores")}</a>
    <a href="../#service" className="block no-underline text-white hover:text-[#BFFF47] py-3 px-2 transition-colors duration-200 text-base font-medium">{t("nav.how")}</a>
    <a href="../#contact" className="block no-underline text-white hover:text-[#BFFF47] py-3 px-2 transition-colors duration-200 text-base font-medium">{t("nav.contact")}</a>
    
    <div className="pt-4 pb-2">
      <label htmlFor="language" className="text-sm text-gray-300 mb-2 block font-medium">🌍 Language</label>
      <select
        id="language"
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="w-full bg-[#07242D] border-2 border-[#1a3a42] hover:border-[#BFFF47] focus:border-[#BFFF47] text-white px-4 py-3 rounded-lg transition-colors duration-200 text-base appearance-none focus:outline-none"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="text-white bg-[#07242D]">
            {lang.label}
          </option>
        ))}
      </select>
    </div>
    
    <div className="space-y-3 pt-2">
      <a href="/login" className="block">
        <button className="w-full bg-[#032B59] hover:bg-[#043d7a] active:bg-[#021d3f] border-2 border-transparent hover:border-[#BFFF47] text-white font-semibold px-6 py-4 rounded-xl transition-all duration-200 text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0">
          {t("nav.button1")}
        </button>
      </a>
      
      <a href="/pricing" className="block">
        <button className="w-full bg-transparent hover:bg-[#BFFF47] border-2 border-[#BFFF47] text-[#BFFF47] hover:text-[#031318] font-semibold px-6 py-4 rounded-xl transition-all duration-200 text-base transform hover:-translate-y-0.5 active:translate-y-0">
          {t("nav.button")}
        </button>
      </a>
    </div>
  </div>
)}
    </header>
  );
}
