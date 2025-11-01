/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'xs': ['11px', '14px'],      // reduced from 12px
        'sm': ['12px', '16px'],      // reduced from 14px
        'base': ['13px', '18px'],    // reduced from 16px
        'lg': ['14px', '20px'],      // reduced from 18px
        'xl': ['16px', '24px'],      // reduced from 20px
        '2xl': ['18px', '28px'],     // reduced from 24px
        '3xl': ['22px', '32px'],     // reduced from 30px
        '4xl': ['26px', '36px'],     // reduced from 36px
      }
    },
  },
  plugins: [],
};
