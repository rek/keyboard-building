# AI Workflow

Use this process for non-trivial work.

## 0) Orient

Before any design or implementation:

- Check [README.md](../README.md) to find relevant modules and their paths.

## 1) Design

- Create/update a design doc in `docs/design/`.
- Focus on problem, constraints, architecture impact, rollout.

## 2) Plan

- Create/update implementation tasks in `docs/specs/`.
- Keep tasks small and ordered.
- Note unresolved questions explicitly.

## 3) Implement

- Follow existing patterns and conventions in the codebase.
- Keep changes focused — one concern per commit.
- Run `npm run build` to check for TypeScript errors before finishing.

## 4) Validate

- Run `npm run build` to check for TypeScript errors.

## 5) Wrap Up

- Update design doc status → Implemented.
- Update specs to match what was actually built.
- Update `implementation-status.md`.
- Review and add any learnings to `docs/guide/ai-workflow.md`.

---

## Learnings

### CI: fix order matters

Run `npm run format` before touching lint or TS errors — formatter rewrites whitespace that would invalidate manual edits.
The three CI gates in order: `format:check` → `lint` → `typecheck`.

### Unused React imports

JSX transform (React 17+) doesn't require `import React`. Both TypeScript (`TS6133`) and ESLint (`no-unused-vars`) flag it. Remove entirely.

### JSX `//` text nodes (design aesthetic)

This project uses `//` as a visual prefix in rendered text (e.g. `// Step-by-step instructions`).
ESLint `react/jsx-no-comment-textnodes` misidentifies these as forgotten JS comments.
Fix: wrap in JSX expression braces — `{'// text here'}` or `{'// '}{variable}`.

### JSON.parse type safety

`JSON.parse()` returns `any`. Even with an explicit variable type annotation, ESLint `no-unsafe-assignment` still fires.
Correct pattern: `const data = JSON.parse(str) as MyType` — cast at the call site, not the declaration.

### Accessibility: interactive divs

`jsx-a11y` requires click handlers on non-semantic elements to also have keyboard support.

| Pattern                               | Fix                                                                         |
| ------------------------------------- | --------------------------------------------------------------------------- |
| Backdrop/overlay with click-to-close  | `role="button"` + `tabIndex={0}` + `aria-label` + `onKeyDown` (Enter/Space) |
| Inner div that stops propagation only | `role="presentation"`                                                       |
| Card div acting as a button           | `role="button"` + `tabIndex={0}` + `onKeyDown`                              |
| Transparent dropdown-close overlay    | `aria-hidden="true"`                                                        |

Longer-term: modal panels should use `role="dialog"` + `aria-modal="true"` for proper screen reader semantics.

### ESLint `projectService` and `.js` config files

`projectService: true` only covers files in `tsconfig.json`. Plain `.js` files (like `eslint.config.js`) fall outside the project and trigger a parsing error.
Fix: `projectService: { allowDefaultProject: ['*.config.js', '*.config.mjs'] }`.
Do **not** include `*.config.ts` — those are already in the TS project and cause a duplicate conflict.
If a third-party ESLint plugin exports an `any`-typed config object, add `@typescript-eslint/no-unsafe-argument: 'off'` to the config-files rule override.

### JSON data typing in components

Imported JSON (`componentsData[category]`) is loosely typed when accessed by a string key.
Pattern: cast to `Record<string, ComponentData> | undefined` and define a local interface that matches the consuming component's prop shape. Use `Record<string, unknown>` for open-ended spec objects.
