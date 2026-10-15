import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      screens: {
        xl1: "1440px",
        xl2: "1536px",
        xl3: "1680px",
        xl4: "1920px",
      },
    },
  },
};

export default config;
