const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        primary: {
          DEFAULT: "#65D6AD", // Mint Green
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#1A2E53", // Navy Blue
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#FF8360", // Coral
          foreground: "#FFFFFF",
        },

        // Secondary Colors
        background: {
          DEFAULT: "#F5F5F5", // Light Gray
          alt: "#B8F4FF", // Light Blue
        },
        highlight: "#FFE17B", // Soft Yellow

        // Text Colors
        foreground: "#333333", // Dark Gray

        // Functional Colors
        success: {
          DEFAULT: "#4CAF50",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#FFC107",
          foreground: "#333333",
        },
        error: {
          DEFAULT: "#F44336",
          foreground: "#FFFFFF",
        },
        info: {
          DEFAULT: "#2196F3",
          foreground: "#FFFFFF",
        },

        // Keep existing system colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        muted: {
          DEFAULT: "#F5F5F5",
          foreground: "#666666",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#333333",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#333333",
        },
      },
      fontFamily: {
        sans: ["Nunito Sans", "sans-serif"],
        display: ["Montserrat", "sans-serif"],
      },
      fontSize: {
        h1: [
          "28px",
          { lineHeight: "34px", fontWeight: "700", fontFamily: "Nunito Sans" },
        ],
        h2: [
          "24px",
          { lineHeight: "29px", fontWeight: "700", fontFamily: "Nunito Sans" },
        ],
        h3: [
          "20px",
          { lineHeight: "24px", fontWeight: "600", fontFamily: "Nunito Sans" },
        ],
        subtitle: [
          "18px",
          { lineHeight: "22px", fontWeight: "600", fontFamily: "Nunito Sans" },
        ],
        body: [
          "16px",
          { lineHeight: "20px", fontWeight: "400", fontFamily: "Nunito Sans" },
        ],
        small: [
          "14px",
          { lineHeight: "17px", fontWeight: "300", fontFamily: "Nunito Sans" },
        ],
        micro: [
          "12px",
          { lineHeight: "15px", fontWeight: "300", fontFamily: "Nunito Sans" },
        ],
        data: [
          "36px",
          { lineHeight: "44px", fontWeight: "500", fontFamily: "Montserrat" },
        ],
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      borderWidth: {
        hairline: hairlineWidth(),
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
  plugins: [require("tailwindcss-animate")],
};
