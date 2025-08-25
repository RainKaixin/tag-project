/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'tag-blue': '#3B82F6',
        'tag-purple': '#8B5CF6',
        'tag-dark-blue': '#1E40AF',
        'tag-light-blue': '#DBEAFE',
      },
    },
  },
  plugins: [],
};
