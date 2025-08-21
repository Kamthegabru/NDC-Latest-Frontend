"use client";

import { motion } from "framer-motion";
import AvatarCarousel from "./Avatar";
import AvatarCarouselRight from "./AvatarRight";
import ImageCarousel from "./ImageCrousal";
import useTranslation from "../../hooks/useTranslation";

export default function DrivenByResultsSection() {
  const { t, locale } = useTranslation(); // ✅ Use hook

  return (
    <section className="bg-[#03151A] text-white overflow-hidden pb-14">
      <section className="relative max-w-7xl mx-auto" key={locale}>
        {/* Background SVG Overlay */}
        <img
          src="https://framerusercontent.com/images/3KnQr5EGsatJ9PgCasC2oMw9L1c.svg"
          alt=""
          className="w-full h-full absolute object-cover opacity-60"
        />
        <div className="absolute inset-0 opacity-80" />

        <div className="relative z-10 container mx-auto px-4 py-16">
          {/* Heading and CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row w-full mb-12 gap-8"
          >
            <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-8 md:items-start  md:text-left">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight md:leading-[65px] max-w-full md:max-w-[500px]">
                  {t("results.heading")}
                </h2>
              </div>
              <div>
                <p className="mt-4 text-base sm:text-lg text-[#EFEFF0] max-w-full md:max-w-3xl">
                  {t("results.paragraph")}
                </p>
                <a  href="#how" >
                <button className="mt-6 px-6 py-3 bg-[#BFFF47] hover:bg-transparent hover:border-white border border-[#BFFF47] rounded-2xl text-[#1C2C30] hover:text-white font-semibold transition">
                  {t("results.button")}
                </button>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Image Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-white px-4 sm:px-6 lg:px-8"
          >
            <ImageCarousel />
          </motion.div>

          {/* Trusted By Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mt-12 text-center max-w-[1200px] mx-auto"
          >
            <h3 className="text-2xl md:text-5xl font-bold">
              {t("results.trustedBy")}{" "}
              <span className="text-green-400">{t("results.globalRetailers")}</span>
            </h3>
            <p className="mx-auto text-lg mt-3 mb-6 text-[#F5F5F5] max-w-xl">
              {t("results.description")}
            </p>

            <div className="w-full relative">
              {/* Left Gradient Overlay */}
              <div className="absolute top-0 left-0 h-full w-2.5 md:w-10 bg-gradient-to-r from-black/30 to-transparent backdrop-blur-sm z-10 pointer-events-none" />

              <div className="my-5">
                <AvatarCarousel />
              </div>

              <AvatarCarouselRight />

              {/* Right Gradient Overlay */}
              <div className="absolute top-0 right-0 h-full w-2.5 md:w-10 bg-gradient-to-l from-black/30 to-transparent backdrop-blur-sm z-10 pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </section>
    </section>
  );
}
