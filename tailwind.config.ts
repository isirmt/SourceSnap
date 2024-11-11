import { iconsPlugin, getIconCollections, } from '@egoist/tailwindcss-icons'
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [
    iconsPlugin({
      collections: getIconCollections(["tabler"]),
    }),
  ],
};
export default config;
