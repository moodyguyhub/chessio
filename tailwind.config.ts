import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        chessio: {
          bg: "#f8fafc",
          "bg-dark": "#020617",
          card: "#ffffff",
          "card-dark": "#0f172a",
          primary: "#4f46e5",
          "primary-dark": "#6366f1",
          text: "#0f172a",
          "text-dark": "#e5e7eb",
          muted: "#6b7280",
          "muted-dark": "#9ca3af",
          border: "#e2e8f0",
          "border-dark": "#1e293b",
          success: "#22c55e",
          danger: "#dc2626",
          warning: "#f97316",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
