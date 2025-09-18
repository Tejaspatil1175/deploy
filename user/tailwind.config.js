/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
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
      colors: {
        border: "rgb(226 232 240)",
        input: "rgb(226 232 240)",
        ring: "rgb(59 130 246)",
        background: "rgb(255 255 255)",
        foreground: "rgb(15 23 42)",
        primary: {
          DEFAULT: "rgb(59 130 246)",
          foreground: "rgb(255 255 255)",
        },
        secondary: {
          DEFAULT: "rgb(248 250 252)",
          foreground: "rgb(15 23 42)",
        },
        destructive: {
          DEFAULT: "rgb(239 68 68)",
          foreground: "rgb(255 255 255)",
        },
        muted: {
          DEFAULT: "rgb(248 250 252)",  
        },
        "muted-foreground": "rgb(100 116 139)", // ✅ keep only here
        accent: {
          DEFAULT: "rgb(248 250 252)",
          foreground: "rgb(15 23 42)",
        },
        popover: {
          DEFAULT: "rgb(255 255 255)",
          foreground: "rgb(15 23 42)",
        },
        card: {
          DEFAULT: "rgb(255 255 255)",
          foreground: "rgb(15 23 42)",
        },
        success: {
          DEFAULT: "rgb(34 197 94)",
          foreground: "rgb(255 255 255)",
        },
        warning: {
          DEFAULT: "rgb(245 158 11)",
          foreground: "rgb(255 255 255)",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
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
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(59, 130, 246, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "bounce-in": "bounce-in 0.6s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
