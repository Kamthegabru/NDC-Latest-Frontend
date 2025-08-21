'use client';

import { motion } from 'framer-motion';

export default function ImageCard({ image, isActive, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      className={`relative cursor-pointer rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-500
        ${isActive ? 'w-[75vw] sm:w-[60%]' : 'w-[40vw] sm:w-[12%]'}
        h-[300px] sm:h-[400px]`}
      layout
    >
      <img
        src={image.src}
        alt="carousel"
        className="object-cover w-full h-full"
      />

      {/* Text Overlay */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/60 to-transparent text-white p-4 sm:p-6"
      >
        <h2 className="text-base sm:text-xl font-semibold">{image.title}</h2>
        <p className="text-xs sm:text-sm mt-1 sm:mt-2">{image.desc}</p>
      </motion.div>
    </motion.div>
  );
}
