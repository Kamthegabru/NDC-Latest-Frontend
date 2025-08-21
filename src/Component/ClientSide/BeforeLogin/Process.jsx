import React from "react";
import { FiShoppingBag, FiBriefcase, FiDatabase } from "react-icons/fi";
import useTranslation from "../../hooks/useTranslation"; // ✅ adjust path for your project

const HiringProcess = () => {
  const { t, locale } = useTranslation(); // ✅ get t() and current locale

  const items = [
    {
      number: "01",
      icon: <FiShoppingBag className="text-3xl md:text-4xl text-[#A3FF3F]" />,
      title: t("hiring.card1.title"),
      description: t("hiring.card1.description"),
    },
    {
      number: "02",
      icon: <FiBriefcase className="text-3xl md:text-4xl text-[#A3FF3F]" />,
      title: t("hiring.card2.title"),
      description: t("hiring.card2.description"),
    },
    {
      number: "03",
      icon: <FiDatabase className="text-3xl md:text-4xl text-[#A3FF3F]" />,
      title: t("hiring.card3.title"),
      description: t("hiring.card3.description"),
    },
  ];

  return (
    <section key={locale} className="bg-[#031519] w-full py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        {/* Heading */}
        <div className="text-left mb-16">
          <p className="text-[#A3FF3F] uppercase text-sm font-medium tracking-wide">
            {t("hiring.heading.label")}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 leading-tight">
            {t("hiring.heading.title")} <br />
            {t("hiring.heading.subtitle.part1")}{" "}
            <span className="text-[#A3FF3F]">
              {t("hiring.heading.subtitle.part2")}
            </span>
          </h2>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-[#03232B] p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-lg transition duration-300"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#D6D6D6] to-[#3C5054]">
                  {item.number}
                </h3>
                {item.icon}
              </div>
              <h4 className="text-lg font-semibold mt-6">{item.title}</h4>
              <p className="mt-4 text-base text-[#E5E5E5] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HiringProcess;
