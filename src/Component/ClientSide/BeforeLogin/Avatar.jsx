"use client";

import { motion } from 'framer-motion';

const AvatarCarousel = () => {
  const avatars = [
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://randomuser.me/api/portraits/women/2.jpg',
    'https://randomuser.me/api/portraits/men/3.jpg',
    'https://randomuser.me/api/portraits/women/4.jpg',
    'https://randomuser.me/api/portraits/men/5.jpg',
    'https://randomuser.me/api/portraits/women/6.jpg',
  ];

  const names = [
    'Ethan Brooks',
    'Isabella Davis',
    'Liam Johnson',
    'Ava Martinez',
    'Noah Thompson',
    'Mia Robinson',
  ];

  const duplicatedAvatars = [...avatars, ...avatars];
  const duplicatedNames = [...names, ...names];

  const ratings = [
    4.9, 4.8, 4.7, 5.0, 4.85, 4.95,
    4.9, 4.8, 4.7, 5.0, 4.85, 4.95,
  ];

  return (
    <div className="max-w-[1300px] mx-auto overflow-hidden">
      <motion.div
        className="flex"
        animate={{ x: ['0%', '-100%'] }}
        transition={{
          ease: 'linear',
          duration: 20,
          repeat: Infinity,
        }}
      >
        {duplicatedAvatars.map((url, idx) => (
          <div key={idx} className="mx-2">
            <div className="flex items-center w-[200px] sm:w-[250px] rounded-full space-x-2 bg-[#031F26] px-2 sm:px-4 py-3 sm:py-6">
              <img
                src={url}
                alt={`Avatar ${idx + 1}`}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-white font-medium text-sm sm:text-base">
                  {duplicatedNames[idx]}
                </p>
                <div className="flex items-center text-yellow-400 text-xs sm:text-sm">
                  <span className="mr-1">★</span>
                  <span className="text-gray-300 font-medium">{ratings[idx]} Ratings</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default AvatarCarousel;
