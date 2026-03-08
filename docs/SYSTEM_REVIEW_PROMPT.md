# System Review Prompt

Use this prompt with an AI assistant (Claude, GPT-4, Gemini, etc.) to get a comprehensive, multi-angle review of the keyboard-building guide. Paste it in full, along with access to the codebase.

---

## The Prompt

You are performing a full system review of a web application called the **Split Keyboard Builder Guide** — a single-page React/TypeScript app that guides users through designing and building a custom split keyboard.

The source lives in `src/`. Key directories:

- `src/routes/` — TanStack Router pages (home, builder, components, assembly)
- `src/components/` — UI components (keyboard builder, assembly guide, component browser)
- `src/contexts/` — React contexts (UserChoices, Currency, AppSettings)
- `src/hooks/` — Custom hooks (useCostEstimate, useAssemblySteps, useAssemblyProgress)
- `src/utils/` — Pure utility functions (costCalculator, compatibilityChecker, assemblyStepFilter, exportBuildPlan)
- `src/data/` — JSON data files (decision-trees, components, assembly-steps, cost-database)
- `src/types/` — TypeScript interfaces

Please review this application across **four distinct lenses**, giving each section equal weight.

---

### Lens 1 — New User Experience (Know-Nothing Perspective)

Imagine you are someone who has never built a keyboard, never soldered anything, and only vaguely knows that custom keyboards exist. You land on this site wanting to build your first split keyboard.

Evaluate:

1. **Onboarding clarity** — Does the home page explain what this site is for and what a split keyboard even is? Can a complete beginner understand the value proposition within 30 seconds?
2. **Decision guidance** — The builder asks users to choose build method, layout, controller, switches, connectivity, and firmware. Are these concepts explained well enough that a novice can make informed choices? Are there tooltips, explanations, or contextual help?
3. **Jargon audit** — List specific terms used in the UI (component names, option labels, error messages, assembly steps) that a beginner would not understand. Rate how well each is explained.
4. **Fear reduction** — Building a keyboard is intimidating. Does the site acknowledge difficulty honestly, reassure the user, and set realistic expectations about time and complexity?
5. **Completeness as a one-stop shop** — After using only this site, could someone confidently order parts, assemble a keyboard, and flash firmware? What critical information gaps exist? What would force a user to Google something the site should cover?
6. **Call to action flow** — Is the path from "I know nothing" → "I have a parts list and assembly guide" clear and linear? Where do users get lost or hit dead ends?
7. **Missing beginner content** — What pages, sections, or features are absent that a beginner would desperately need? (e.g. a glossary, a "what tools do I need?" page, photos of real builds, community links, common mistakes)

---

### Lens 2 — Content Completeness & Accuracy

Evaluate the actual information content of the site, not the code.

1. **Decision tree coverage** — Read `src/data/decision-trees.json`. Are all major split keyboard build paths represented? Are there gaps (e.g. missing controller options, missing switch types, missing firmware choices)?
2. **Component database** — Read `src/data/components.json`. Is the component information accurate and up to date? Are prices realistic? Are there important components missing from each category?
3. **Assembly guide quality** — Read `src/data/assembly-steps.json`. For each phase, are the steps accurate, sufficiently detailed, and in the right order? Are there missing phases (e.g. PCB inspection, ESD safety, case foam, gasket mounting)?
4. **Compatibility rules** — Read `src/utils/compatibilityChecker.ts`. Are all the compatibility rules correct? Are there real-world incompatibilities that are not yet modelled?
5. **Cost accuracy** — Read `src/data/cost-database.json`. Are the cost estimates reasonable for 2024/2025 prices? What categories are missing or underestimated?
6. **Troubleshooting coverage** — Is the troubleshooting section in the assembly data comprehensive enough? What common problems are not listed?

---

### Lens 3 — Code Quality & Architecture

Review the codebase as a senior engineer performing a technical audit.

1. **Module boundaries** — Are responsibilities cleanly separated between routes, components, hooks, utils, and data? Identify any cases where business logic leaks into components or UI logic leaks into utilities.
2. **State management** — Evaluate the three React contexts (UserChoices, Currency, AppSettings). Are they appropriately scoped? Is there any state that belongs in a different layer?
3. **Data flow** — Trace the path from a user selecting an option in `DecisionTree` through to the cost estimate updating in `CostEstimator` and the assembly steps filtering in `AssemblyGuide`. Is the flow clean and predictable?
4. **Type safety** — Identify all uses of `any`, unsafe type assertions (`as Type`), and missing type definitions. How much of the codebase is genuinely type-safe?
5. **Error handling** — How does the app behave when localStorage is corrupted? When a JSON data file has an unexpected shape? When an image 404s? When the user's browser blocks localStorage?
6. **Performance** — Are there unnecessary re-renders? Are expensive computations (cost calculation, assembly filtering, compatibility checking) memoized correctly?
7. **Testability** — Could the utility functions (`costCalculator`, `compatibilityChecker`, `assemblyStepFilter`) be unit tested as written? What would need to change to make them easy to test?
8. **Dead code & consistency** — Identify any remaining inconsistencies in coding patterns, unused exports, or divergence from the established style.

---

### Lens 4 — Extensibility & Maintainability

Evaluate how easy it would be for a developer to maintain and grow this project over time.

1. **Adding a new component category** — Walk through exactly what files would need to be edited to add a new category (e.g. "stabilisers") to the component browser. Is the process obvious and contained?
2. **Adding a new decision step** — What would it take to add a new step to the builder decision tree (e.g. choosing a case material)? How many files need to change?
3. **Adding a new firmware option** — Walk through adding a new firmware (e.g. "BlueMicro") to the system: decision tree, compatibility checker, cost calculator, assembly steps. Are the data and logic files easy to extend?
4. **Adding a new language/locale** — Is internationalisation feasible with the current architecture? What would need to change?
5. **Data vs. logic coupling** — How much business logic is hardcoded in TypeScript files that should really live in the JSON data files? (e.g. keycap cost lookup in `costCalculator.ts`, compatibility rules in `compatibilityChecker.ts`)
6. **Documentation quality** — Review the files in `docs/`. Are they accurate, complete, and sufficient for a new contributor to get productive quickly?
7. **Schema evolution** — If the shape of `assembly-steps.json` or `components.json` needed to change, how painful would that migration be? Is there any runtime validation of data schemas?

---

### Deliverables

For each lens, produce:

- A **summary verdict** (1–2 sentences)
- A **scored rating** out of 10
- A **prioritised list of findings** (most impactful first), each with:
  - The specific file, component, or data section it applies to
  - The impact on the relevant stakeholder (user, developer, maintainer)
  - A concrete recommendation

Finally, produce an **overall health score** (average of the four lens scores) and a **top 5 action items** — the five changes that would have the greatest combined impact across all four lenses.
