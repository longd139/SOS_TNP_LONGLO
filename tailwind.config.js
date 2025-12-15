/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'xs': ['11px', '14px'],     
        'sm': ['12px', '16px'],     
        'base': ['13px', '18px'],    
        'lg': ['14px', '20px'],      
        'xl': ['16px', '24px'],      
        '2xl': ['18px', '28px'],     
        '3xl': ['22px', '32px'],     
        '4xl': ['26px', '36px'], 
      }
    },
  },
  plugins: [],
};
