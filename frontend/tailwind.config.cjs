/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#07111f',
          900: '#0b1730',
          800: '#14213d',
          700: '#1e2c4c',
        },
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#14b8a6',
          600: '#0f766e',
          700: '#115e59',
        },
        sky: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
        },
        sand: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
        },
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.12)',
      },
      backgroundImage: {
        'dashboard-radial': 'radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 40%), radial-gradient(circle at top right, rgba(20,184,166,0.18), transparent 32%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
      },
    },
  },
  plugins: [],
};
