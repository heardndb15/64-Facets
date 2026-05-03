/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      colors: {
        garden: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
        },
        bloom: {
          pink: "#f9a8d4",
          rose: "#fb7185",
          peach: "#fed7aa",
          sky: "#bae6fd",
          lavender: "#c4b5fd",
          mint: "#6ee7b7",
          sun: "#fde68a",
        },
        aura: {
          bg: "var(--bg-primary)",
          card: "var(--bg-card)",
          border: "var(--bg-border)",
          muted: "var(--bg-muted)",
          fg: "var(--text-primary)",
        },
      },
      backgroundImage: {
        "garden-gradient": "linear-gradient(135deg, #f0fdf4 0%, #fdf4ff 50%, #fff7ed 100%)",
        "dark-gradient": "linear-gradient(135deg, #0f1117 0%, #141b2d 50%, #0f1117 100%)",
        "aura-hero": "radial-gradient(ellipse at top, #1a2744 0%, #0f1117 70%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "bloom": "bloom 0.5s ease-out forwards",
        "shimmer": "shimmer 2s linear infinite",
        "grow": "grow 1s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        bloom: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        grow: {
          "0%": { transform: "scaleY(0)", opacity: "0" },
          "100%": { transform: "scaleY(1)", opacity: "1" },
        },
      },
      boxShadow: {
        "glow-green": "0 0 20px rgba(34, 197, 94, 0.3)",
        "glow-pink": "0 0 20px rgba(249, 168, 212, 0.3)",
        "glow-purple": "0 0 20px rgba(196, 181, 253, 0.3)",
        "card": "0 4px 24px rgba(0,0,0,0.2)",
      },
    },
  },
  plugins: [],
};
