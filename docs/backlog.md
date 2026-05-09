# Backlog

To assign work to an agent, say: **"Read docs/backlog.md and do item N"**

Follow the [AI Workflow](../guide/ai-workflow.md) (orient → design → plan → implement → validate → wrap up).
All items: remove when resolved

At the end: update design doc status → Implemented, update specs to match what was actually built, update `implementation-status.md`, then review and add any learnings to `docs/guide/ai-workflow.md`.

---

## 1

review builder page. do available options change when i make selections? hiding incompatiable things?

## 2 — Project / profile model (multi-build saves)

`src/contexts/UserChoicesContext.tsx` currently stores a single `UserChoices` blob under one localStorage key (`kb-choices`). Refactor to support multiple named projects so a returning user can keep separate "Corne wireless", "Sofle handwired", etc. and jump back into any of them.

Suggested shape:

- `ProjectsContext` storing `{ projects: Record<projectId, UserChoices>, activeProjectId }`
- Migrate the existing single-build localStorage key into a default project on first load
- Add `/projects` index route (list, create, rename, delete, switch)
- Existing `/builder` and `/assembly` read/write the active project

## 3 — Fill PCB-from-scratch content

Phase `pcb-design-kicad` exists in `src/data/assembly-steps.json` with 13 step skeletons (each marked `TODO — fill in later`). Replace each `content` string with the real walkthrough. Steps:

- `kicad-project-setup`, `kicad-schematic`, `kicad-footprint-assoc`, `kicad-layout`, `kicad-drc`
- `kicad-gerber-export`, `kicad-drill-export`, `kicad-plot-svg-pdf`, `kicad-raster-copper`
- `laser-pcb-prep-copper`, `laser-pcb-isolation-toolpath`, `laser-pcb-double-sided-alignment`, `laser-pcb-post-process`

Topics that link these steps already exist (`/topics/kicad-export`, `/topics/laser-pcb`).
