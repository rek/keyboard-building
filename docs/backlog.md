# Backlog

To assign work to an agent, say: **"Read docs/backlog.md and do item N"**

Follow the [AI Workflow](../guide/ai-workflow.md) (orient → design → plan → implement → validate → wrap up).
All items: remove when resolved

At the end: update design doc status → Implemented, update specs to match what was actually built, update `implementation-status.md`, then review and add any learnings to `docs/guide/ai-workflow.md`.

---

## 1

review builder page. do available options change when i make selections? hiding incompatiable things?

## 2 — Bug: `getBuildHash` omits `switchType`

`src/utils/assemblyStepFilter.ts` — `getBuildHash()` does not include `switchType` in the hash it computes. Changing switch type changes which assembly steps are shown (via `isStepRelevant`), but the hash stays the same, so saved progress is incorrectly preserved across the change instead of being reset.

Fix: add `switchType: choices.switchType` to the `relevantChoices` object in `getBuildHash`.

Test to update: `assemblyStepFilter.test.ts` → `getBuildHash > BUG: hash does not change when switchType changes` — flip the assertion from `toBe` to `not.toBe` once fixed.

## 3 — Bug: `isStepRelevant` ignores feature requirements of `false`

`src/utils/assemblyStepFilter.ts` — Feature requirements expressed as `false` (e.g. `{ features: { hotswap: false } }`, meaning "only show this step if hotswap is NOT enabled") are silently skipped. The guard `if (required && ...)` short-circuits on `false`, so the step is shown regardless of whether the feature is enabled.

Fix: change the guard to check both directions — hide the step if `required === true` and the feature is off, or if `required === false` and the feature is on.

Test to update: `assemblyStepFilter.test.ts` → `isStepRelevant > BUG: feature requirement of false is not enforced` — change `toHaveLength(1)` to `toHaveLength(0)` once fixed.

## 4 — Bug: `pcb-kit` case cost overwritten by `ergonomic-3d` layout

`src/utils/costCalculator.ts` — When `buildMethod === 'pcb-kit'` and `layout.formFactor === 'ergonomic-3d'`, the kit's included case cost ($40) is set first then silently overwritten to $20 by the ergonomic-3d check. The $40 drops out of the estimate without trace.

Decide intended behaviour: if the 3D layout requires a custom case that replaces the kit case, the overwrite is correct but should use `+=` or be made explicit. If the kit case cost should be preserved, guard the ergonomic-3d block with `if (!breakdown.case)`.

Test to update: `costCalculator.test.ts` → `calculateCost > case cost — ergonomic-3d layout > overwrites pcb-kit case cost` — update the expected value and remove the `// BUG` comment once resolved.

## 2

[vite:css][postcss] @import must precede all other statements (besides @charset or empty @layer)
1170 | }
1171 | }
1172 | @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=IBM+Plex+Sans:wg...
| ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
1173 | :root {
1174 | --color-bg-primary: #f5f3ee;
