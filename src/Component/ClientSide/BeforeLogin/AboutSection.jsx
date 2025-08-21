import React from "react";
import { motion } from "framer-motion";
import useTranslation from "../../hooks/useTranslation"; 

export default function AboutSection() {
  const { t, locale } = useTranslation(); // ✅ Use hook

  return (
    <>
       <section className="w-full bg-[#f9f9f9] py-16 px-4 md:px-12 lg:px-20">
        <section className="max-w-7xl mx-auto px-4 py-12" key={locale}>
          {/* Top Section - Text Left, Image Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {t("recruitment.top.heading")}
              </h2>
              <p className="text-base md:text-lg text-[#03151A] mt-4 leading-relaxed">
                {t("recruitment.top.paragraph")}
              </p>
              <a href="#contact">
              <button className="mt-6 px-5 py-3 text-sm md:text-base font-semibold border border-black rounded-lg bg-black text-white hover:bg-white hover:text-black transition-all duration-200">
                {t("recruitment.top.button")}
              </button>
              </a>
              <hr className="my-8 border-gray-200" />

              <div className="space-y-8">
                {/* Item 1 */}
                <div>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-6 w-6"
                      dangerouslySetInnerHTML={{
                        __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-3.586l-1.707-1.707A.996.996 0 0014 4h-4c-.265 0-.52.105-.707.293L7.586 6H4c-1.103 0-2 .897-2 2v11c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2zm0 13H4V8h4.586l2-2h2.828l2 2H20v11z"></path></svg>`,
                      }}
                    />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t("recruitment.top.card1.title")}
                    </h3>
                  </div>
                  <p className="ml-9 text-sm md:text-base text-[#03151A] mt-2">
                    {t("recruitment.top.card1.description")}
                  </p>
                </div>

                {/* Item 2 */}
                <div>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-6 w-6"
                      dangerouslySetInnerHTML={{
                        __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"></path></svg>`,
                      }}
                    />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t("recruitment.top.card2.title")}
                    </h3>
                  </div>
                  <p className="ml-9 text-sm md:text-base text-[#03151A] mt-2">
                    {t("recruitment.top.card2.description")}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              className="relative w-full h-full rounded-xl overflow-hidden shadow-md"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <img
                src="images/test.jpg"
                alt="Team Growth"
                className="w-full h-full rounded-3xl object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-white rounded-xl px-2 md:px-4 py-1 md:py-2 shadow-md text-sm">
                <p className="text-gray-400">99.28% Test Result</p>
                <div className="flex gap-1 mt-1">
                  <div className="w-2 h-6 bg-lime-400 rounded-sm"></div>
                  <div className="w-2 h-6 bg-lime-400 rounded-sm"></div>
                  <div className="w-2 h-6 bg-lime-400 rounded-sm"></div>
                  <div className="w-2 h-6 bg-black rounded-sm"></div>
                  <div className="w-2 h-6 bg-black rounded-sm"></div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Section - Image Left, Text Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-24 items-center">
            {/* Left Image */}
            <motion.div
              className="relative rounded-xl w-full h-full overflow-hidden shadow-md"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <img
                src="images/unlock-main.png"
                alt="Team Collaboration"
                className="w-full h-full rounded-3xl object-cover"
              />
            </motion.div>

            {/* Right Text */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {t("recruitment.bottom.heading")}
              </h2>
              <p className="text-base md:text-lg text-[#03151A] mt-4 leading-relaxed">
                {t("recruitment.bottom.paragraph")}
              </p>



<a href="#contact">
              <button className="mt-6 px-5 py-3 rounded-xl text-sm font-medium border border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-200">
                {t("recruitment.bottom.button")}
              </button>
</a>






              <hr className="my-8 border-gray-200" />

              {/* Mobile Cards */}
              <div className="grid md:hidden grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                {["card1", "card2", "card3", "card4"].map((key, idx) => (
                  <div
                    key={idx}
                    className="border-[2px] border-[#DDDDDD] rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="rgb(3, 21, 26)">
                        <path d="M10 0L12.701 7.299 20 10l-7.299 2.701L10 20l-2.701-7.299L0 10l7.299-2.701z" />
                      </svg>
                      <p className="text-md font-semibold">{t(`recruitment.bottom.${key}.title`)}</p>
                    </div>
                    <p className="text-sm text-[#555] leading-relaxed">{t(`recruitment.bottom.${key}.desc`)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          

          {/* Desktop Cards */}
          <div className="md:grid hidden grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {["card1", "card2", "card3", "card4"].map((key, idx) => (
              <div
                key={idx}
                className="border-[2px] border-[#DDDDDD] rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3  mb-2">
                  <div className="min-w-[20px]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="rgb(3, 21, 26)">
                    <path d="M10 0L12.701 7.299 20 10l-7.299 2.701L10 20l-2.701-7.299L0 10l7.299-2.701z" />
                  </svg>
                  </div>
                  
                  <p className="text-lg font-semibold">{t(`recruitment.bottom.${key}.title`)}</p>
                </div>
                <p className="text-sm text-[#555] leading-relaxed">{t(`recruitment.bottom.${key}.desc`)}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </>
  );
}
