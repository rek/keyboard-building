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
