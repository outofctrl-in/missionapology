import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The `assets/` folder at the project root holds every original file the
// sister-provided art/video lives in. We point Vite's publicDir straight at
// it (instead of copying into `public/`) so the files on disk are the exact
// files served — nothing gets renamed, re-encoded, or duplicated.
//
// `base` only changes for the GitHub Pages build (see .github/workflows/deploy.yml,
// which sets GITHUB_PAGES=true) — GitHub Pages serves a project site from
// /<repo-name>/, so every asset URL needs that prefix there. Local dev/build/
// preview stay at the root ('/') so nothing about running it locally changes.
export default defineConfig({
  plugins: [react()],
  publicDir: 'assets',
  base: process.env.GITHUB_PAGES ? '/mission-apology/' : '/',
})
