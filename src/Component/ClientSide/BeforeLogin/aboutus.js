import React from 'react';

const ContactSection = () => {
  const contactInfo = [
    {
      title: "Address",
      details: "3055 NW YEON AVE UNIT #271\nPortland, OR 97210",
      link: "https://www.google.com/maps/search/?api=1&query=3055+NW+Yeon+Ave+Unit+271,+Portland,+OR+97210",
      linkText: "View Location",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="w-full h-full">
          <path d="M128,24a80,80,0,0,0-80,80c0,58.53,71.2,122.7,74.23,125.41a8,8,0,0,0,11.54,0C136.8,226.7,208,162.53,208,104A80,80,0,0,0,128,24Zm0,112a32,32,0,1,1,32-32A32,32,0,0,1,128,136Z"/>
        </svg>
      )
    },
    {
      title: "Call Us",
      details: "+1 (360) 249-7511",
      link: "tel:+13602497511",
      linkText: "Call Now",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="w-full h-full">
          <path d="M146.34,109.66a8,8,0,0,1,0-11.32L180.69,64H160a8,8,0,0,1,0-16h40a8,8,0,0,1,8,8V96a8,8,0,0,1-16,0V75.31l-34.34,34.35a8,8,0,0,1-11.32,0Zm68,56.8-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L126.87,168c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L89.54,41.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,24,88c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,214.37,166.46Z"/>
        </svg>
      )
    },
    {
      title: "General Inquiries",
      details: "info@nwdrugtesting.com",
      link: "mailto:info@nwdrugtesting.com",
      linkText: "Send Email",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="w-full h-full">
          <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,64H216v24H40ZM216,200H40V112H216Zm-136-56h32a8,8,0,0,1,0,16H80a8,8,0,0,1,0-16Zm64,0h32a8,8,0,0,1,0,16H144a8,8,0,0,1,0-16Z"/>
        </svg>
      )
    },
    {
      title: "Tech Support",
      details: "help@nwdrugtesting.com",
      link: "mailto:help@nwdrugtesting.com",
      linkText: "Get Help",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="w-full h-full">
          <path d="M128,40A88,88,0,0,0,40,128v40a24,24,0,0,0,24,24h16a16,16,0,0,0,16-16V144a16,16,0,0,0-16-16H56a72,72,0,0,1,144,0H160a16,16,0,0,0-16,16v32a16,16,0,0,0,16,16h16a24,24,0,0,0,24-24V128A88,88,0,0,0,128,40Z"/>
        </svg>
      )
    },
    {
      title: "Verification Services",
      details: "fmcsa@nwdrugtesting.com",
      link: "mailto:fmcsa@nwdrugtesting.com",
      linkText: "Contact Us",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="w-full h-full">
          <path d="M128,24,40,56v56c0,72.2,58.3,112.86,84.23,124a8,8,0,0,0,7.54,0C157.7,224.86,216,184.2,216,112V56ZM176.49,104.49l-48,48a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L120,136.69l42.34-42.35a8,8,0,0,1,11.31,11.32Z"/>
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 bg-[#03151A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Multiple ways to reach us for all your testing needs
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="space-y-6">
          {/* First Row - 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactInfo.slice(0, 3).map((contact, index) => (
              <div
                key={contact.title}
                className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/15 transition-all duration-300 p-6 hover:-translate-y-1"
              >
                {/* Icon and Title Row */}
                <div className="flex items-center gap-4 mb-4">
                  {/* Large Icon */}
                  <div className="w-12 h-12 bg-[#C6FF5C] rounded-lg p-2.5 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <div className="w-full h-full fill-black">
                      {contact.icon}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white group-hover:text-[#C6FF5C] transition-colors duration-300">
                    {contact.title}
                  </h3>
                </div>

                {/* Details */}
                <div className="mb-4">
                  <p className="text-gray-300 font-medium whitespace-pre-line text-sm leading-relaxed">
                    {contact.details}
                  </p>
                </div>

                {/* Action Button */}
                <div>
                  <a
                    href={contact.link}
                    target={contact.link.startsWith('http') ? '_blank' : undefined}
                    rel={contact.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center justify-center px-4 py-2 bg-[#C6FF5C] text-black font-medium rounded-lg hover:bg-[#b8e854] transform hover:scale-105 transition-all duration-300 text-sm"
                  >
                    {contact.linkText}
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Second Row - 2 Centered Cards */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
              {contactInfo.slice(3, 5).map((contact, index) => (
                <div
                  key={contact.title}
                  className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/15 transition-all duration-300 p-6 hover:-translate-y-1"
                >
                  {/* Icon and Title Row */}
                  <div className="flex items-center gap-4 mb-4">
                    {/* Large Icon */}
                    <div className="w-12 h-12 bg-[#C6FF5C] rounded-lg p-2.5 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <div className="w-full h-full fill-black">
                        {contact.icon}
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#C6FF5C] transition-colors duration-300">
                      {contact.title}
                    </h3>
                  </div>

                  {/* Details */}
                  <div className="mb-4">
                    <p className="text-gray-300 font-medium whitespace-pre-line text-sm leading-relaxed">
                      {contact.details}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div>
                    <a
                      href={contact.link}
                      target={contact.link.startsWith('http') ? '_blank' : undefined}
                      rel={contact.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center justify-center px-4 py-2 bg-[#C6FF5C] text-black font-medium rounded-lg hover:bg-[#b8e854] transform hover:scale-105 transition-all duration-300 text-sm"
                    >
                      {contact.linkText}
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-gray-300 text-sm border border-white/20">
            <div className="w-2 h-2 bg-[#C6FF5C] rounded-full mr-2 animate-pulse"></div>
            Available 24/7 for emergency testing needs
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;