/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'ibm-blue': '#0F62FE',
        'ibm-purple': '#6929C4',
        'ibm-gray': {
          50: '#F4F4F4',
          100: '#E0E0E0',
          200: '#C6C6C6',
          300: '#A8A8A8',
          400: '#8D8D8D',
          500: '#6F6F6F',
          600: '#525252',
          700: '#393939',
          800: '#262626',
          900: '#161616',
        }
      },
      fontFamily: {
        'ibm': ['IBM Plex Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'ibm': '2px',
      },
      boxShadow: {
        'ibm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'ibm-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
