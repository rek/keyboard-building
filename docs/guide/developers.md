# Developers Guide

## Local Development

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Production

The project uses GitHub Pages for deployment via CI/CD. Pushes to `main` trigger an automatic build and deploy through GitHub Actions.

To build locally:

```bash
npm run build
npm run preview
```

## Code Style

- TypeScript — no `any` types. Use `unknown` with type guards.
- No Zod or other runtime validation libraries. Use the helpers in `src/utils/dataValidation.ts`.
- Complexity and time lookup tables belong in `src/data/build-complexity.json`, not inline in TypeScript.
- All user-facing strings go in `src/constants/strings.ts`, not inline in components.
- Favour editing existing files over creating new ones.
