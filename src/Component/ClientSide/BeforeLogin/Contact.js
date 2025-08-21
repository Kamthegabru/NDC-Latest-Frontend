import { useState } from "react";
import useTranslation from "../../hooks/useTranslation";

export default function Contact() {
  const { t, locale } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <section id="contact" className="w-full bg-[#f9fafb] py-20 px-6 md:px-16" key={locale}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Content */}
        <div className="flex flex-col justify-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {t("contact.heading")}
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            {t("contact.subheading")}
          </p>

          <form
            action="https://formsubmit.co/info@ndctesting.com"
            method="POST"
            className="space-y-5"
            onSubmit={() => setSending(true)}
          >
            {/* Optional customization */}
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_subject" value="New Contact Form Message" />
            <input type="hidden" name="_template" value="table" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder={t("contact.form.name")}
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder={t("contact.form.email")}
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">{t("contact.form.select")}</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="UK">UK</option>
                <option value="Other">{t("contact.form.other")}</option>
              </select>
              <input
                type="text"
                name="subject"
                placeholder={t("contact.form.subject")}
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <textarea
              name="message"
              placeholder={t("contact.form.message")}
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-[#BFFF47] hover:bg-transparent hover:border-black border border-[#BFFF47] rounded-2xl text-[#1C2C30] transition font-semibold py-3 px-6"
            >
              {sending ? "Sending..." : t("contact.form.submit")}
            </button>
          </form>
        </div>

        {/* Right Illustration */}
        <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-xl">
          <img
            src="/images/contact.jpg"
            alt="People collaborating"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
