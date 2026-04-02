/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brew: {
          bg:      '#1A1208',
          surface: '#2C1F0E',
          mid:     '#3D2B14',
          accent:  '#C8956C',
          cream:   '#E8C99A',
          text:    '#F5ECD7',
          muted:   '#A68B6A',
          border:  '#4A3520',
          success: '#7DB87A',
          error:   '#C0614E',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body:    ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card:  '16px',
        input: '12px',
      }
    }
  },
  plugins: []
};
