/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'sb-green': '#00704A',
        'sb-dark': '#1E3932',
        'sb-light': '#D4E9E2',
        'sb-cream': '#F2F0EB',
        'sb-black': '#1C1C1C',
        'sb-gold': '#CBA258',
      },
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
        pill: '9999px',
      },
    },
  },
  plugins: [],
};
