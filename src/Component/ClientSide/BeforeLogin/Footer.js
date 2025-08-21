import React from "react";
import useTranslation from "../../hooks/useTranslation";


export default function Footer() {
  const { t, locale } = useTranslation();

  return (
    <section
      className="bg-[#0B1B22] text-white pt-16 pb-[150px] relative overflow-hidden"
      key={locale}
    >
      <footer className="max-w-[1200px] mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-12 relative z-10">
          {/* Left Section */}
          <div className="md:w-1/2">
            <div className="mb-4">
              <a href="/" className="flex cursor-pointer items-center space-x-3">
                <img
                  src="/images/logo11.png"
                  alt="NDC Logo"
                  className="w-28 md:w-32"
                />
              </a>
              <p className="mt-4 text-xl md:text-2xl font-semibold leading-snug">
                {t("footer.tagline.line1")}
                <br />
                {t("footer.tagline.line2")}
              </p>
            </div>

            <div className="text-sm text-[#C5C8C9] mt-6 flex flex-wrap gap-3 items-center">
              <a href="/privacy" className="no-underline text-white hover:underline">
                {t("footer.links.privacy")}
              </a>
              <span className="hidden sm:inline">|</span>
              <a href="/termsAndConditions" className="no-underline text-white hover:underline">
                {t("footer.links.terms")}
              </a>
            </div>

            <div className="max-w-[250px]">
              <hr className="my-4 border-[#C5C8C9]" />
            </div>

            <div className="text-sm text-[#C5C8C9]">
              © 2025 — {t("footer.copyright")}
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-1/2 grid grid-cols-2 sm:grid-cols-2 gap-10">
            {/* Links Column */}
            <div>
              <h4 className="text-lg font-semibold mb-3">
                {t("footer.column1.heading")}
              </h4>
              <span className="space-y-2  list-none  text-sm text-[#C5C8C9]">
                <li>
                  <a href="../#home" className="no-underline text-white hover:underline">
                    {t("footer.column1.home")}
                  </a>
                </li>
                <li>
                  <a href="../#about" className="no-underline text-white hover:underline">
                    {t("footer.column1.about")}
                  </a>
                </li>
                <li>
                  <a href="../#service" className="no-underline text-white hover:underline">
                    {t("footer.column1.stores")}
                  </a>
                </li>
                <li>
                  <a href="../#how" className="no-underline text-white hover:underline">
                    {t("footer.column1.how")}
                  </a>
                </li>
                <li>
                  <a href="../#contact" className="no-underline text-white hover:underline">
                    {t("footer.column1.contact")}
                  </a>
                </li>
              </span>
            </div>

            {/* Other Column */}
            <div>
              <h4 className="text-lg font-semibold mb-3 ">
                {t("footer.column2.heading")}
              </h4>
            <span className="space-y-2 list-none text-sm text-[#C5C8C9]">
  <li>
    <a
      href="../service"
      className="no-underline text-white hover:underline"
    >
      {t("footer.column2.who")}
    </a>
  </li>
  <li>
    <a
      href="../#service"
      className="no-underline text-white hover:underline"
    >
      {t("footer.column2.access")}
    </a>
  </li>
  <li>
    <a
      href="../#about"
      className="no-underline text-white hover:underline"
    >
      {t("footer.column2.benefits")}
    </a>
  </li>
  <li>
    <a
      href="../#about"
      className="no-underline text-white hover:underline"
    >
      {t("footer.column2.data")}
    </a>
  </li>
  <li>
    <a
      href="../#contact"
      className="no-underline text-white hover:underline"
    >
      {t("footer.column2.partner")}
    </a>
  </li>
</span>

            </div>
          </div>
        </div>

        {/* Bottom Gradient Overlay */}
        <div className="hidden md:flex absolute bottom-0 left-0 w-full text-[70px] md:text-[80px] font-bold text-transparent bg-gradient-to-t from-[#BFFF47] to-green-200 bg-clip-text opacity-25 leading-none select-none">
          <div className="container mx-auto px-4 text-center">
            NATIONWIDE DRUG CENTERS
          </div>
          <div className="absolute bottom-0 left-0 w-full -mb-[300px]">
            <img
              src="https://framerusercontent.com/images/aysrYRRlD1DbQwqgdINmKqafxI.svg"
              alt="Decor"
            />
          </div>
        </div>
      </footer>
    </section>
  );
}
