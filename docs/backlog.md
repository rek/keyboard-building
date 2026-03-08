# Backlog

To assign work to an agent, say: **"Read docs/backlog.md and do item N"**

Follow the [AI Workflow](../guide/ai-workflow.md) (orient → design → plan → implement → validate → wrap up).
All items: remove when resolved

At the end: update design doc status → Implemented, update specs to match what was actually built, update `implementation-status.md`, then review and add any learnings to `docs/guide/ai-workflow.md`.

---

## 1

review builder page. do available options change when i make selections? hiding incompatiable things?

## 2

[vite:css][postcss] @import must precede all other statements (besides @charset or empty @layer)
1170 | }
1171 | }
1172 | @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=IBM+Plex+Sans:wg...
| ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
1173 | :root {
1174 | --color-bg-primary: #f5f3ee;
