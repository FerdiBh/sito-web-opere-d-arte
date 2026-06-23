export default {
  plugins: {
    tailwindcss: {
      config: {
        content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
        theme: { extend: { colors: { gold: '#D4A853', dark: '#1a1a2e', darker: '#0f0f1a', accent: '#e2b96f' }, fontFamily: { serif: ['Playfair Display', 'Georgia', 'serif'], sans: ['Inter', 'system-ui', 'sans-serif'] } } },
        plugins: [],
      }
    },
    autoprefixer: {},
  },
}
