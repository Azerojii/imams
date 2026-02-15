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
          DEFAULT: '#0D4F5C',
          light: '#167A8A',
          dark: '#073540',
        },
        accent: {
          DEFAULT: '#5BA4B5',
          light: '#8DC5D2',
          dark: '#3D8999',
        },
        destructive: '#C62828',
        'bg-main': '#F0F4F6',
        'bg-card': '#FFFFFF',
        'bg-sidebar': '#E6ECF0',
        'text-primary': '#1A1F24',
        'text-secondary': '#4A5568',
        border: '#B0C4CE',
        'border-light': '#D1DEE5',
      },
      fontFamily: {
        arabic: ['Noto Naskh Arabic', 'Amiri', 'serif'],
        heading: ['Aref Ruqaa', 'Amiri', 'serif'],
        amiri: ['Amiri', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1A1F24',
            maxWidth: 'none',
            direction: 'rtl',
            textAlign: 'right',
            a: {
              color: '#0D4F5C',
              textDecoration: 'none',
              borderBottom: '1px solid #8DC5D2',
              '&:hover': {
                color: '#167A8A',
                borderBottomColor: '#5BA4B5',
              },
            },
            h2: {
              fontFamily: 'Aref Ruqaa, Amiri, serif',
              borderBottom: '2px solid #D1DEE5',
              paddingBottom: '0.5rem',
              marginBottom: '1rem',
              color: '#0D4F5C',
            },
            h3: {
              fontFamily: 'Aref Ruqaa, Amiri, serif',
              color: '#073540',
            },
            blockquote: {
              borderRightWidth: '4px',
              borderRightColor: '#5BA4B5',
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
