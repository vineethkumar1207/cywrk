// @lovable.dev/vite-tanstack-config already includes the core plugin stack
// (tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro, @ alias) — do NOT add them manually.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// On Vercel builds (VERCEL=1 is set automatically) emit Vercel Build Output; elsewhere keep the default target.
const onVercel = !!process.env['VERCEL'];

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  ...(onVercel ? { nitro: { preset: "vercel" } } : {}),
});