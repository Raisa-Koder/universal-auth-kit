const config = {
  "**/*.{ts?(x),mts}": () => "tsc -p tsconfig.prod.json --noEmit",
  "*.{js,jsx,mjs,cjs,ts,tsx,mts}": [
    "vitest related --run",
  ],
  "*.{md,json}": "prettier --write",
  "*": "node --run typos",
};

export default config;
