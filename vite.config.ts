import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const config = defineConfig({
  base: isGitHubPages ? "/keyboard-building/" : "/",
  build: isGitHubPages
    ? {
        outDir: "dist",
        emptyOutDir: true,
      }
    : undefined,
  plugins: [
    TanStackRouterVite(),
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    viteReact(),
  ],
});

export default config;
