import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#6C3CE1", light: "#8B5CF6", dark: "#5B21B6" },
        surface: { DEFAULT: "#f5f5f7", card: "#ffffff", hover: "#f0f0f2" },
        accent: "#00D4AA",
      },
    },
  },
  plugins: [],
};

export default config;
