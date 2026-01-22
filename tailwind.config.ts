// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg-rgb) / <alpha-value>)",
        fg: "rgb(var(--fg-rgb) / <alpha-value>)",

        card: "rgb(var(--card-rgb) / <alpha-value>)",
        "card-fg": "rgb(var(--card-fg-rgb) / <alpha-value>)",

        muted: "rgb(var(--muted-rgb) / <alpha-value>)",
        "muted-fg": "rgb(var(--muted-fg-rgb) / <alpha-value>)",

        accent: "rgb(var(--accent-rgb) / <alpha-value>)",
        "accent-fg": "rgb(var(--accent-fg-rgb) / <alpha-value>)",

        border: "rgb(var(--border-rgb) / <alpha-value>)",
      },
      borderRadius: {
        glass: "var(--radius-glass)",
        card: "var(--radius-card)",
      },
      boxShadow: {
        glass: "var(--shadow-glass)",
        "glass-soft": "var(--shadow-glass-soft)",
      },
      backdropBlur: {
        glass: "var(--blur-glass)",
      },
    },
  },
  plugins: [],
} satisfies Config;
