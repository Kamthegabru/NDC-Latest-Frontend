'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import useTranslation from '../../hooks/useTranslation'; // ✅ Add translation hook

export default function TestimonialSection() {
  const { t, locale } = useTranslation(); // ✅ Use locale for key reset

  const testimonials = [
    {
      quote: t("testimonial.card1.quote"),
      name: t("testimonial.card1.name"),
      role: t("testimonial.card1.role"),
      image: 'https://framerusercontent.com/images/rctYhlyNAvPDoHrghhddkKDnI.jpg?scale-down-to=1024',
    },
    {
      quote: t("testimonial.card2.quote"),
      name: t("testimonial.card2.name"),
      role: t("testimonial.card2.role"),
      image: 'https://framerusercontent.com/images/g7oTpPzxIrRGMR5AC1hi2ZNeug0.jpg',
    },
    {
      quote: t("testimonial.card3.quote"),
      name: t("testimonial.card3.name"),
      role: t("testimonial.card3.role"),
      image: 'https://framerusercontent.com/images/XYXMho6s3T5R6UP9ICIAH7DV9t4.jpg',
    },
  ];

  return (
    <section
      className="w-full max-w-[1300px] mt-8 px-4 mx-auto md:px-10 pb-16 bg-white text-center"
      key={locale} // ✅ Ensure re-render on language switch
    >
      {/* Heading */}
      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-5xl font-bold leading-tight md:leading-[70px]">
          {t("testimonial.heading.title")} <br className="hidden md:block" />
          {t("testimonial.heading.titleLine2")}
        </h2>
        <p className="mt-5 text-md font-semibold max-w-[600px] mx-auto md:text-xl text-gray-600">
          {t("testimonial.heading.subtitle")}
        </p>
      </div>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        loop
        className="w-full"
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className="p-5 mb-8 rounded-2xl w-full border-gray-200 bg-gray-200 mx-auto grid md:grid-cols-2 gap-6 items-center">
              {/* Testimonial Text */}
              <div className="bg-white rounded-2xl h-auto lg:h-[280px] w-full shadow-sm border border-gray-200 p-6 md:p-8 text-left flex flex-col justify-between">
                <p className="text-[#03151A] text-base md:text-[22px] font-bold opacity-90 leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="text-[#03151A] text-base md:text-[18px] font-semibold opacity-90">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>

              {/* Testimonial Image */}
              <div className="h-52 md:h-[280px] w-full">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="rounded-xl object-cover w-full h-full object-top"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
