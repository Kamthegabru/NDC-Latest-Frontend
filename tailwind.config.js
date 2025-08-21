/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    screens: {
      sm: "640px",   // Small screens (mobile)
      md: "768px",   // Medium screens (tablets)
      lg: "1024px",  // Large screens (laptops)
      xl: "1280px",  // Extra large screens (desktops)
      "2xl": "1536px" // Very large screens (big monitors)
    },
  },
  plugins: [],
};
