/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    // Configure responsive breakpoints
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    // Configure the container
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    // Configure the 12-column grid
    gridColumn: {
      'span-1': 'span 1 / span 1',
      'span-2': 'span 2 / span 2',
      'span-3': 'span 3 / span 3',
      'span-4': 'span 4 / span 4',
      'span-5': 'span 5 / span 5',
      'span-6': 'span 6 / span 6',
      'span-7': 'span 7 / span 7',
      'span-8': 'span 8 / span 8',
      'span-9': 'span 9 / span 9',
      'span-10': 'span 10 / span 10',
      'span-11': 'span 11 / span 11',
      'span-12': 'span 12 / span 12',
    },
    gridTemplateColumns: {
      '12': 'repeat(12, minmax(0, 1fr))',
    },
    // Configure spacing based on 8pt grid
    spacing: {
      '0': '0',
      '1': '0.25rem',  // 4px
      '2': '0.5rem',   // 8px
      '3': '0.75rem',  // 12px
      '4': '1rem',     // 16px
      '5': '1.25rem',  // 20px
      '6': '1.5rem',   // 24px
      '7': '1.75rem',  // 28px
      '8': '2rem',     // 32px
      '9': '2.25rem',  // 36px
      '10': '2.5rem',  // 40px
      '11': '2.75rem', // 44px
      '12': '3rem',    // 48px
      '14': '3.5rem',  // 56px
      '16': '4rem',    // 64px
      '20': '5rem',    // 80px
      '24': '6rem',    // 96px
      '28': '7rem',    // 112px
      '32': '8rem',    // 128px
      '36': '9rem',    // 144px
      '40': '10rem',   // 160px
      '44': '11rem',   // 176px
      '48': '12rem',   // 192px
      '52': '13rem',   // 208px
      '56': '14rem',   // 224px
      '60': '15rem',   // 240px
      // Convert 120pt for vertical margins to rem (120pt ≈ 160px = 10rem)
      'vertical-lg': '10rem', // 160px (120pt) - for vertical margins in the layout
    },
    extend: {
      // Font family configuration
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'sans-serif'],
      },
      // Font size configuration based on 4pt modular scale with 1.25 ratio
      // Converting pt to rem (1pt ≈ 1.333px, 1rem = 16px)
      fontSize: {
        // 64pt ≈ 85.3px ≈ 5.33rem 
        'display': ['5.33rem', { lineHeight: '1.1', fontWeight: '700' }],
        // 32pt ≈ 42.7px ≈ 2.67rem
        'heading': ['2.67rem', { lineHeight: '1.2', fontWeight: '400' }],
        // 18pt ≈ 24px ≈ 1.5rem
        'subheading': ['1.5rem', { lineHeight: '1.3', fontWeight: '500' }],
        // 14pt ≈ 18.7px ≈ 1.17rem
        'body': ['1.17rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      // Font weight configuration
      fontWeight: {
        regular: 400,
        medium: 500,
        bold: 700,
      },
      colors: {
        // Brand colors - T001
        ink: "#121212",      // Ink Black
        chalk: "#FAFAFA",    // Chalk White
        cobalt: "#0047AB",   // Cobalt Blue
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}