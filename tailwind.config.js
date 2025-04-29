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
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
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