/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'bricolage': ['Bricolage Grotesque', 'sans-serif'],
      },
      colors: {
        // Light Theme Colors (from global.css)
        'foreground': '#404040',
        'background': '#d5d9e2',
        'card-bg': '#eef0f2',
        'border-color': '#e0e0e0',
        'button-bg': '#f0f1f3',
        
        // Dark Theme Colors (from global.css)
        'foreground-dark': '#fafafa',
        'background-dark': '#2c2f3e',
        'card-bg-dark': '#3a3f53',
        'border-color-dark': '#424242',
        'button-bg-dark': '#5f6478',
        
        // Accent Colors (from global.css scrollbar and cursor)
        'light-accent': '#C30B4E',
        'dark-accent': '#FF90E8',
        
        // Brand Colors
        'linkedin-blue': '#0077B5',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
} 