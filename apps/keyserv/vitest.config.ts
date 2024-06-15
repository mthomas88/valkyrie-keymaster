import { defineProject, coverageConfigDefaults } from "vitest/config";

export default defineProject({
  test: {
    include: ["src/**/*.spec.ts"],
    exclude: ["node_modules", "dist"],
    passWithNoTests: true,
    coverage: {
      ...coverageConfigDefaults,
      exclude: ["node_modules", "dist", "*.js", "./src/index.ts"],
    },
  },
});
