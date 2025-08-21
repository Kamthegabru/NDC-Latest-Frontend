'use client';

import { useState } from 'react';
import ImageCard from './ImageCard';
import useTranslation from '../../hooks/useTranslation'; // ✅ Import translation hook

export default function ImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { t, locale } = useTranslation(); // ✅ Get t and locale

  const images = [
    { 
      src: "/images/s1.jpg",
      title: t("carousel.card1.title"),
      desc: t("carousel.card1.desc")
    },
    {
      src: '/images/s2.jpg',
      title: t("carousel.card2.title"),
      desc: t("carousel.card2.desc")
    },
    {
      src: '/images/s3.jpg',
      title: t("carousel.card3.title"),
      desc: t("carousel.card3.desc")
    },
    {
      src: '/images/s4.jpg',
      title: t("carousel.card4.title"),
      desc: t("carousel.card4.desc")
    },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto  py-6 scrollbar-hide " key={locale}>
      {images.map((img, index) => (
        <ImageCard
          key={index}
          image={img}
          isActive={index === activeIndex}
          onClick={() => setActiveIndex(index)}
        />
      ))}
    </div>
  );
}


