import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "fat-black": "#0D0D0D",
        "fat-dark": "#1A1A1A",
        "fat-card": "#1F1F1F",
        "fat-gold": "#E8B84B",
        "fat-gold-dark": "#C9A235",
        "fat-cream": "#F5F5F0",
        "fat-muted": "#9A9A8A",
      },
      fontFamily: {
        jakarta: ["var(--font-jakarta)", "sans-serif"],
        archivo: ["var(--font-archivo)", "sans-serif"],
        marker: ["var(--font-permanent-marker)", "cursive"],
      },
    },
  },
  plugins: [],
};

export default config;
