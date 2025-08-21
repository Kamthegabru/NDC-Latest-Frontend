import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // ✅ React Router
import useTranslation from "../../hooks/useTranslation";
import "../../styles/BackgroundImage.css";
import CountUpOnView from "../CountUpOnView";





const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function HeroComponent() {
  const { t, locale } = useTranslation();
  const [searchRef, setSearchRef] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 

 

  return (
    <>
      {loading && (
        <div className="fullscreen-loader">
          <div className="loader-ring"></div>
        </div>
      )}

      <section
        id="hero-section"
        key={locale}
        className="w-full bg-custom h-[55vh] md:h-[80vh] text-white pt-24 px-2 sm:px-6 text-center"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative max-w-5xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center pr-3 pl-2 py-1 mb-4 sm:mb-6 border border-[#1b3f3d] rounded-full bg-[#062222] text-white/80 text-xs sm:text-sm font-medium shadow-lg">
            <div className="bg-[#03151A] py-2 px-3 flex items-center gap-2 rounded-full mr-2">
              <div className="relative w-2 h-2">
                <div className="absolute inset-0 bg-[#032B59] rounded-full" />
                <div className="absolute inset-0 bg-lime-300 rounded-full animate-ping opacity-40" />
              </div>
              <span className="text-white font-semibold">
                {t("hero.badgeLabel")}
              </span>
            </div>
            <span className="text-xs sm:text-sm">{t("hero.badgeText")}</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 sm:mb-6">
            {t("hero.title1")} <br className="hidden sm:block" />
            <span className="text-white">{t("hero.title2")}</span>
          </h1>

          {/* Subheading */}
          <p className="text-white text-xs max-w-3xl text-center mx-auto sm:text-base mb-6 sm:mb-8">
            {t("hero.subtitle")}
          </p>

          <div className="w-full max-w-md mx-auto mt-2 sm:mt-6 flex flex-row justify-center ">
             <a href="/pricing" className="no-underline">
            <button className="bg-[#022B36] text-white md:block hidden hover:bg-transparent border-[2px] text-[16px] border-[#575958] hover:text-white max-h-[60px] px-6 hover:text-[#022B36] text-black font-semibold py-3 rounded-[10px]">
              <p className="min-w-[130px]">{t("nav.button")}</p>
            </button>
             </a>
          </div>
        </motion.div>

        {/* Grid Section */}
        <div className="flex items-center justify-center min-h-screen">
          <section className="py-12 px-6 mt-[150px] md:mt-[-300px] absolute sm:px-6 overflow-hidden">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="max-w-7xl mx-auto grid grid-cols-2 gap-3 sm:grid-cols-4 sm:grid-rows-2 sm:gap-4"
            >
              {/* Box 1 */}
              <div className="col-span-1 row-span-2 bg-[#022B36] rounded-2xl pb-3 px-3 sm:py-6 sm:px-7 flex flex-col items-center text-center justify-center">
                <div className="mb-1">
                  <img
                    src="/images/solo.jpg"
                    alt="Verify Before You Buy"
                    className="rounded-2xl w-20 md:w-[140px] mx-auto"
                  />
                </div>
                <h3 className="text-xs sm:text-lg font-semibold mb-1">
                  {t("hero.box1.title")}
                </h3>
                <p className="text-white opacity-90 mb-3 text-[10px] sm:text-sm">
                  {t("hero.box1.description")}
                </p>
                <a href="#home">
                  <button className="border border-white px-2.5 py-1.5 text-xs sm:text-sm rounded-lg hover:bg-white hover:text-black transition">
                    {t("hero.box1.button")}
                  </button>
                </a>
              </div>

              {/* Box 2 */}
              <div className="col-span-1 row-span-1 bg-[#022B36] text-white rounded-2xl p-2.5 sm:p-6 flex flex-col justify-between">
                <h4 className="font-semibold text-xs sm:text-xl">
                  {t("hero.box2.title")}
                </h4>
                <p className="text-lg sm:text-2xl font-bold mt-1">
                  <CountUpOnView end={114705} duration={5000} />+{" "}
                  <span className="text-[10px] sm:text-sm text-white font-semibold">
                    {t("hero.box2.label")}
                  </span>
                </p>
                <p className="mt-2 text-[9px] sm:text-xs font-medium text-white">
                  {t("hero.box2.subtitle")}
                </p>
              </div>

              {/* Box 3 */}
              <div className="col-span-1 row-span-1">
                <img
                  className="rounded-2xl w-full h-46 object-cover"
                  src="images/market.jpg"
                  alt="Team"
                />
              </div>

              {/* Box 4 */}
              <div className="col-span-1 row-span-2 bg-[#022B36] rounded-2xl overflow-hidden relative">
                <img
                  src="/images/person3.jpg"
                  alt="Global Reach"
                  className="w-full h-full object-cover"
                />

                <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-gray-800/70 backdrop-blur-md rounded-xl p-2 sm:p-6 border border-white/10 shadow-md text-left">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <div className="w-4 h-4 bg-[#BFFF47] rounded-full flex items-center justify-center">
                      <span className="text-black text-[10px] font-bold">
                        🌍
                      </span>
                    </div>
                    <h5 className="font-bold text-[10px] sm:text-xs text-white">
                      {t("hero.box4.title")}
                    </h5>
                  </div>
                  <p className="text-white/80 text-[10px] sm:text-xs">
                    {t("hero.box4.subtitle")}
                  </p>
                </div>
              </div>

              {/* Box 5 */}
              <div className="col-span-1 row-span-1">
                <img
                  src="images/box5.jpg"
                  alt="Satisfied Team"
                  className="rounded-2xl h-[200px] h-full"
                />
              </div>

              {/* Box 6 */}
              <div className="text-center sm:py-3 py-4 px-4 bg-[#0D1B2A] rounded-lg">
                <h4 className="text-white text-xs sm:text-lg font-semibold mb-2 sm:mb-1">
                  {t("hero.box6.title")}{" "}
                  <span className="text-[#BFFF47]">
                    <CountUpOnView end={15290} duration={3000} />+
                  </span>{" "}
                  {t("hero.box6.title2")}
                </h4>

                {/* Avatars */}
                <div className="flex justify-center items-center gap-3 mb-1">
                  <img
                    src="https://framerusercontent.com/images/6RhPqEmOwb7vN6bm2YsYb1RjBA.png"
                    alt="Avatar 1"
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
                  />
                  <img
                    src="https://framerusercontent.com/images/7oH7exiO1Qqr2K7SEIDldsYInuk.png"
                    alt="Avatar 2"
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
                  />
                  <img
                    src="images/a1.jpg"
                    alt="Avatar 3"
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
                  />
                  <img
                    src="images/a2.jpg"
                    alt="Avatar 4"
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
                  />
                </div>

                {/* Arrow */}
                <div className="flex justify-center mb-0 md:mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 100 50"
                    className="md:w-15 h-5 w-12"
                  >
                    <path
                      d="M10 10c20 20 60 20 80 0"
                      stroke="white"
                      strokeWidth="4"
                      fill="none"
                      markerEnd="url(#arrowhead)"
                    />
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="0"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 10 3.5, 0 7"
                          fill="white"
                        />
                      </marker>
                    </defs>
                  </svg>
                </div>
                <p className="text-white text-[9px] sm:text-[12px] font-medium">
                  {t("hero.box6.subtitle")}{" "}
                  <span className="text-[#BFFF47] font-semibold">
                    {t("hero.box6.subtitle2")}
                  </span>{" "}
                  {t("hero.box6.subtitle3")}
                </p>
              </div>
            </motion.div>
          </section>
        </div>
      </section>
    </>
  );
}
