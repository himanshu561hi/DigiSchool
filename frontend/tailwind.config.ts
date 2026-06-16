import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",

  content: [
    "./index.html",

    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#2563eb",

        secondary: "#7c3aed",

        success: "#16a34a",

        warning: "#f59e0b",

        danger: "#dc2626",

        muted: "#64748b",
      },
    },
  },

  plugins: [],
};

export default config;