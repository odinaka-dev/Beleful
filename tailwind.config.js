/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        "banner-bg": "var(--banner-bg)",
        "heading-color": "var(--heading-color)",
        "sub-heading-color": "var(--sub-heading-color)",
        "sub-text-color": "var(--sub-text-color)",
        "red-variant": "var(--red-variant)",
        "ash-variant": "var(--ash-variant)",
        "green-variant": "var(--green-variant)",
        "deep-ash-variant": "var(--deep-ash-variant)",
      },

      fontFamily: {
        primary: ["Quicksand", "sans-serif"],
        heading: ["Plus Jakarta Sans", "sans-serif"],
      },

      borderRadius: {
        card: "1.5rem",
      },

      spacing: {
        section: "8rem",
      },

      boxShadow: {
        card: "0 10px 30px rgba(0,0,0,0.08)",
      },

      screens: {
        "3xl": "120rem",
      },
    },
  },

  plugins: [],
};
