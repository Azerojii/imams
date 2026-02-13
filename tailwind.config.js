/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B5E20',
          light: '#2E7D32',
          dark: '#0D3B13',
        },
        accent: {
          DEFAULT: '#D4A843',
          light: '#E8C876',
          dark: '#B8892E',
        },
        destructive: '#C62828',
        'bg-main': '#FDF8F0',
        'bg-card': '#FFFFFF',
        'bg-sidebar': '#F5F0E8',
        'text-primary': '#1A1A1A',
        'text-secondary': '#4A4A4A',
        border: '#D4C5A0',
        'border-light': '#E8DCC8',
      },
      fontFamily: {
        arabic: ['Noto Naskh Arabic', 'Amiri', 'serif'],
        heading: ['Aref Ruqaa', 'Amiri', 'serif'],
        amiri: ['Amiri', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1A1A1A',
            maxWidth: 'none',
            direction: 'rtl',
            textAlign: 'right',
            a: {
              color: '#1B5E20',
              textDecoration: 'none',
              borderBottom: '1px solid #E8C876',
              '&:hover': {
                color: '#2E7D32',
                borderBottomColor: '#D4A843',
              },
            },
            h2: {
              fontFamily: 'Aref Ruqaa, Amiri, serif',
              borderBottom: '2px solid #E8DCC8',
              paddingBottom: '0.5rem',
              marginBottom: '1rem',
              color: '#1B5E20',
            },
            h3: {
              fontFamily: 'Aref Ruqaa, Amiri, serif',
              color: '#0D3B13',
            },
            blockquote: {
              borderRightWidth: '4px',
              borderRightColor: '#D4A843',
              borderLeftWidth: '0',
              paddingRight: '1rem',
              paddingLeft: '0',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
