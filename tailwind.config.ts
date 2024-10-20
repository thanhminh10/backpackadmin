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
          "dark-color": "#053729",
          "dark-default": "#92AB32",
          "dark-light": "#F9FFB6",
          "light-cream":"#FDFFE8",
          "neutral-gray-80" : "#0E1010",
          "neutral-gray-60" : "#525655",
          "neutral-gray-40" : "#C5C5C5",
          "neutral-gray-20" : "#F6F8F8",
          "semantics-succeed":"#006736",
          "semantics-warning":"#FBBD08",
          "semantics-error":"#B60202",
          "semantics-info":"#0099E9",
          "semantics-cancel":"#202020",
          "white":"#FFFFFF",
          "main-bg-color" : "#EBEBEB",
          "bg-section" : "#F1F1EE",
          "content-bg" : "#F2F4F3",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      spacing: {
        '3rem': '3rem', // Thêm giá trị 3rem vào spacing 48px
      },
      gap: {
        1:"4px",
        2: "8px",
        4: "16px",
        6: "24px", // Added value for gap
        9: "36px",
        12: "48px",
      },
      padding: {
        '2': "8px",
        '3':'12px',
        '4': "16px",
        '6': "24px", 
        '8': "32px", 
        '9': '36px', // Added value for padding 36px
        '12': '48px',
        '20': '80px', // Added value for padding 80px
      },
      fontSize: {
        '12':'12px',
        '14':'14px',
        '16':'16px',
        '20':'20px',
        '26': '26px',
      },
      fontWeight: {
        '100': '100',
        '200': '200',
        '300': '300',
        '400': '400',
        '500': '500',
        '600': '600',
        '700': '700',
        '800': '800',
        '900': '900',
      },

    },
  },
  plugins: [],
};
export default config;
