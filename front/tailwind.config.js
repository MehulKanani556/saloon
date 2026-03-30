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
        parlour: {
          '50': '#fef1f8',
          '100': '#fee5f2',
          '200': '#ffcce8',
          '300': '#ffa2d6',
          '400': '#ff68bb',
          '500': '#ff3d9f',
          '600': '#ef1a7c',
          '700': '#cf1061',
          '800': '#ab1053',
          '900': '#8f1248',
          '950': '#580428',
        },
        rosegold: {
          '50': '#faf6f3',
          '100': '#f4ebe5',
          '200': '#ead9ce',
          '300': '#dbbcab',
          '400': '#c89d88',
          '500': '#b57e65',
          '600': '#a76a5b',
          '700': '#8a544c',
          '800': '#714643',
          '900': '#5d3c39',
          '950': '#311e1d',
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
        center: true, // Center the container by default
        screens: {
          sm: '420px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
          '3xl': '1800px',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(to right, #fef1f8, #fee5f2, #ead9ce)',
        'luxury-soft': 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
      },
      boxShadow: {
        'premium': '0 8px 32px 0 rgba(181, 126, 101, 0.15)',
        'glass': '0 4px 15px 0 rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
