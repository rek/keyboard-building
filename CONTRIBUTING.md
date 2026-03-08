# Contributing to Split Keyboard Builder Guide

Thank you for your interest in contributing! This document explains how the project is structured and how to add new content.

## Project Structure

```
src/
├── components/       # React UI components
│   ├── assembly/     # Assembly guide components (StepCard, PhaseSection, AssemblyGuide)
│   ├── keyboard/     # Builder components (DecisionTree, CostEstimator, ComponentCard)
│   └── common/       # Shared components (ImageModal)
├── constants/        # Centralised user-facing strings (strings.ts)
├── contexts/         # React context providers (UserChoices, Currency, AppSettings)
├── data/             # JSON data files (see Data Files section)
├── hooks/            # Custom React hooks (useCostEstimate, useAssemblySteps)
├── routes/           # TanStack Router page routes
├── types/            # TypeScript interfaces (assembly.ts)
└── utils/            # Pure utility functions (costCalculator, compatibilityChecker, ...)
```

## Data Files

All content lives in `src/data/`. Editing these files is the most common contribution.

| File | Purpose |
|---|---|
| `components.json` | Component database (controllers, switches, features, stabilisers, …) |
| `cost-database.json` | Pricing for all components and build methods |
| `decision-trees.json` | Interactive builder steps and options |
| `assembly-steps.json` | Phase-by-phase assembly instructions |
| `build-complexity.json` | Complexity and time lookup tables for build methods, layouts, firmware |
| `category-info.json` | Metadata for component categories shown in the Components page |

For detailed schemas, see [`docs/DATA_SCHEMAS.md`](docs/DATA_SCHEMAS.md).

## Adding a New Component Category

1. **Add entries to `components.json`**
   Add a new top-level key (e.g., `"cables"`) containing an object where each key is a component ID:

   ```json
   {
     "cables": {
       "trrs-coiled": {
         "id": "trrs-coiled",
         "name": "Coiled TRRS Cable",
         "price": 12.0,
         "image": "/images/components/cables/trrs-coiled.webp",
         "specs": { ... },
         "complexity": 1,
         "pros": ["..."],
         "cons": ["..."],
         "compatibleWith": ["trrs"],
         "incompatibleWith": [],
         "vendors": [{ "name": "...", "url": "...", "price": 12.0 }]
       }
     }
   }
   ```

   See `docs/DATA_SCHEMAS.md` for the full component schema.

2. **Add a category entry to `category-info.json`**
   This controls how the category appears on the `/components` page:

   ```json
   {
     "id": "cables",
     "title": "Cables",
     "description": "Cables for connecting split keyboard halves.",
     "icon": "cable"
   }
   ```

3. **Update cost-database.json if pricing is needed**
   Add a matching key under the appropriate section if the component has a purchasable cost that feeds into build estimates.

4. **Add images** to `public/images/components/<category>/`. Use `.webp` format at roughly 400×300px.

5. **Verify** by running `npm run dev` and browsing to `/components`.

## Adding Assembly Steps

Edit `src/data/assembly-steps.json`. Each step lives inside a phase:

```json
{
  "id": "my-new-step",
  "title": "My Step Title",
  "description": "One-sentence description shown in the step header.",
  "order": 5,
  "estimatedTime": "10-15 minutes",
  "content": "Full instructions. Supports **bold**, `code`, and - bullet lists.",
  "requirements": {
    "buildMethod": ["handwired"],
    "firmware": null,
    "features": null
  },
  "warnings": ["Important caution here."],
  "tips": ["Helpful tip here."],
  "requiredTools": ["Soldering iron", "Flux"],
  "externalLinks": [
    {
      "title": "Reference Article",
      "url": "https://example.com",
      "type": "article",
      "description": "Explains the concept in more detail."
    }
  ]
}
```

Steps support markdown in `content`: `**bold**`, `` `code` ``, `- list items`, `1. numbered lists`, and `[link text](url)`.

Use `requirements` to filter steps to specific builds. Leave a field `null` to show the step to all users.

## Adding Compatibility Rules

Edit `src/utils/compatibilityChecker.ts`. Add a new `warnings.push(...)` block:

```typescript
if (choices.firmware === 'my-firmware' && choices.controller !== 'my-controller') {
  warnings.push({
    severity: 'error', // 'error' | 'warning' | 'info'
    message: 'Clear, user-friendly explanation of the issue.',
    affectedChoices: ['firmware', 'controller'],
  })
}
```

## Adding UI Strings

All user-facing strings should be added to `src/constants/strings.ts` rather than scattered inline through components. Import from there:

```typescript
import { BUILDER } from '../constants/strings'
// ...
<span>{BUILDER.COMPLEXITY}</span>
```

## Running Locally

```bash
npm install
npm run dev        # Start dev server on http://localhost:3000
npm run check      # Lint + typecheck + build
npm run test       # Run tests
```

## Code Style

- TypeScript — no `any` types. Use `unknown` with type guards.
- No Zod or other runtime validation libraries. Use the helpers in `src/utils/dataValidation.ts`.
- Complexity and time lookup tables belong in `src/data/build-complexity.json`, not inline in TypeScript.
- Favour editing existing files over creating new ones.
