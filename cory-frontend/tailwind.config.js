module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0px)', opacity: '1' },
        },
        fadeOut: {
          '0%': { transform: 'translateX(0px)', opacity: '1' },
          '100%': { transform: 'translateX(-30px)', opacity: '0' },
        },
        fadeInNoTranslate: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in-out 1',
        fadeOut: 'fadeOut 1s ease-in-out 1',
        fadeInNoTranslate: 'fadeInNoTranslate 1s ease-in-out 1',
      },
    },
  },
  plugins: [],
}
