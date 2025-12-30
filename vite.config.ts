import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const config = defineConfig({
  base: isGitHubPages ? "/keyboard-building/" : "/",
  build: isGitHubPages ? {
    outDir: "dist",
    emptyOutDir: true,
  } : undefined,
  plugins: [
    !isGitHubPages && devtools(),
    !isGitHubPages && nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    !isGitHubPages && tanstackStart({
      autoCodeSplitting: true,
    }),
    viteReact(),
  ].filter(Boolean),
});

export default config;
