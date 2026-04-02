/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C9A227',    // Gold
          hover: '#B08D20',
          light: '#F5E6C8',
        },
        secondary: {
          DEFAULT: '#1A1A1A',  // Black
          light: '#2A2A2A',
        },
        accent: '#F5E6C8',      // Light Gold
        background: '#0F0F0F',  // Dark
        muted: '#A0A0A0',       // Muted
        saloon: {
          '500': '#C9A227', // Gold override
        }
      },
      screens: {
        xs: "320px",
        sm375: "375px",
        sm: "425px",
        md600: "601px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
        "3xl": "1920px",
        "4xl": "2560px",
      },
      container: {
        center: true,
        screens: {
          sm: '420px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
        luxury: ['Poppins', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #C9A227 0%, #B08D20 100%)',
        'gold-shine': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        'dark-card': 'linear-gradient(180deg, rgba(26,26,26,0.8) 0%, rgba(15,15,15,0.9) 100%)',
      },
      boxShadow: {
        'premium': '0 8px 32px 0 rgba(201, 162, 39, 0.1)',
        'glass': '0 4px 15px 0 rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),

    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",

          /* Firefox */
          "scrollbar-width": "none",

          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    },
  ],
}
