import { heroui } from "@heroui/react";
import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    // Include Shadcn UI components
    "./node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add any custom colors here if needed
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui(),
    require("tailwindcss-animate"), // Include Shadcn's animation plugin
  ],
};
