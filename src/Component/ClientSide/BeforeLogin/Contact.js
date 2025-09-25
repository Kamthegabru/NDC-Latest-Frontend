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

      
  {/* CONTACT GRID (Updated) */}
<div className="max-w-6xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center text-sm sm:text-base">

  {/* Call Us */}
  <div>
    <div className="flex justify-center mb-2">
      <div className="p-3 bg-black rounded-full">
        <div className="w-10">
          {/* Phone */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
               className="w-full h-full inline-block fill-[#C6FF5C]">
            <path d="M146.34,109.66a8,8,0,0,1,0-11.32L180.69,64H160a8,8,0,0,1,0-16h40a8,8,0,0,1,8,8V96a8,8,0,0,1-16,0V75.31l-34.34,34.35a8,8,0,0,1-11.32,0Zm68,56.8-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L126.87,168c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L89.54,41.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,24,88c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,214.37,166.46Z"/>
          </svg>
        </div>
      </div>
    </div>
    <h4 className="font-semibold">Call Us</h4>
    <p className="text-gray-600">
      <a href="tel:+13602497511" className="underline block">+1 (360) 249-7511</a>
    </p>
  </div>

  {/* Billing & General Inquiries */}
  <div>
    <div className="flex justify-center mb-2">
      <div className="p-3 bg-black rounded-full">
        <div className="w-10">
          {/* Billing: Credit Card/Receipt */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
               className="w-full h-full inline-block fill-[#C6FF5C]">
            <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,64H216v24H40ZM216,200H40V112H216Zm-136-56h32a8,8,0,0,1,0,16H80a8,8,0,0,1,0-16Zm64,0h32a8,8,0,0,1,0,16H144a8,8,0,0,1,0-16Z"/>
          </svg>
        </div>
      </div>
    </div>
    <h4 className="font-semibold">Billing &amp; General Inquiries</h4>
    <p className="text-gray-600">
      <a href="mailto:info@nwdrugtesting.com" className="underline block">
        info@nwdrugtesting.com
      </a>
    </p>
  </div>

  {/* Tech Support */}
  <div>
    <div className="flex justify-center mb-2">
      <div className="p-3 bg-black rounded-full">
        <div className="w-10">
          {/* Tech Support: Headset */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
               className="w-full h-full inline-block fill-[#C6FF5C]">
            <path d="M128,40A88,88,0,0,0,40,128v40a24,24,0,0,0,24,24h16a16,16,0,0,0,16-16V144a16,16,0,0,0-16-16H56a72,72,0,0,1,144,0H160a16,16,0,0,0-16,16v32a16,16,0,0,0,16,16h16a24,24,0,0,0,24-24V128A88,88,0,0,0,128,40Z"/>
          </svg>
        </div>
      </div>
    </div>
    <h4 className="font-semibold">Tech Support</h4>
    <p className="text-gray-600">
      <a href="mailto:help@nwdrugtesting.com" className="underline block">
        help@nwdrugtesting.com
      </a>
    </p>
  </div>

  {/* Random Questions / Verification */}
  <div>
    <div className="flex justify-center mb-2">
      <div className="p-3 bg-black rounded-full">
        <div className="w-10">
          {/* Verification: Shield Check */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
               className="w-full h-full inline-block fill-[#C6FF5C]">
            <path d="M128,24,40,56v56c0,72.2,58.3,112.86,84.23,124a8,8,0,0,0,7.54,0C157.7,224.86,216,184.2,216,112V56ZM176.49,104.49l-48,48a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L120,136.69l42.34-42.35a8,8,0,0,1,11.31,11.32Z"/>
          </svg>
        </div>
      </div>
    </div>
    <h4 className="font-semibold">Random Questions / Verification</h4>
    <p className="text-gray-600">
      <a href="mailto:fmcsa@nwdrugtesting.com" className="underline block">
        fmcsa@nwdrugtesting.com
      </a>
    </p>
  </div>

</div>


      


    </section>
  );
}
