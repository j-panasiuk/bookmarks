import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  define: {
    "import.meta.vitest": false,
  },
  test: {
    includeSource: ["app/**/*.{ts,tsx}"],
  },
});
