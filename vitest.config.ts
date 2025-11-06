import swc from "unplugin-swc";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: "./",
    globals: true,
    environment: "node",
    isolate: false,
    passWithNoTests: true,
    include: ["tests/unit/**/*.test.ts"],
    env: loadEnv("test", process.cwd(), ""),
    reporters: ["verbose"],
    silent: false,
    clearMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "json-summary", "lcov"],
      reportsDirectory: "coverage/unit",
      include: ["src/auth/strategies/**/*.ts"],
    },
  },
  plugins: [swc.vite({ module: { type: "es6" } })],
});
