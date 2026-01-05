# Documentation Index

Welcome to the Split Keyboard Builder Guide documentation. These guides will help you understand, maintain, and extend the application.

## Quick Links

- **[Project Overview](./PROJECT_OVERVIEW.md)** - Start here to understand the project
- **[Data Schemas](./DATA_SCHEMAS.md)** - Complete reference for all JSON data structures
- **[Component API](./COMPONENT_API.md)** - How to use components, hooks, and utilities
- **[Extending the Application](./EXTENDING.md)** - Step-by-step guides for adding features
- **[Settings & Images](./SETTINGS_AND_IMAGES.md)** - Learning mode and image management
- **[Image Sources](./IMAGE_SOURCES.md)** - Where to find and how to add component images

## For Agents

If you're an AI agent helping to develop this project, follow this sequence:

### 1. Understand the Project

Read **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** to learn:

- What the application does
- Core features and user flow
- Tech stack
- Project structure
- Target audience

### 2. Learn the Data Layer

Read **[DATA_SCHEMAS.md](./DATA_SCHEMAS.md)** to understand:

- How `components.json` is structured
- How `decision-trees.json` defines the decision flow
- How `cost-database.json` stores pricing
- How `UserChoices` state is organized
- How to add new data entries

### 3. Reference Components & APIs

Use **[COMPONENT_API.md](./COMPONENT_API.md)** as a reference for:

- Available React components and their props
- Hooks like `useUserChoices` and `useCostEstimate`
- Utility functions for calculations and formatting
- Styling conventions
- Route structure

### 4. Add New Features

Follow **[EXTENDING.md](./EXTENDING.md)** for step-by-step instructions on:

- Adding new decision steps
- Adding new component categories
- Adding feature toggles
- Creating new pages/routes
- Adding utility functions
- Best practices

## Common Tasks

### I want to add a new keyboard component (e.g., new controller)

1. Read [Data Schemas - Controller Schema](./DATA_SCHEMAS.md#controller-schema)
2. Add entry to `src/data/components.json` under `controllers`
3. Add pricing to `src/data/cost-database.json`
4. Follow [Extending - Adding a New Decision Step](./EXTENDING.md#adding-a-new-decision-step) if it should appear in the builder

### I want to add a new decision step to the builder

1. Read [Data Schemas - DecisionStep Schema](./DATA_SCHEMAS.md#decisionstep-schema)
2. Follow [Extending - Adding a New Decision Step](./EXTENDING.md#adding-a-new-decision-step)
3. Update cost calculations if needed
4. Add compatibility rules if needed

### I want to create a new page

1. Read [Component API - Route Structure](./COMPONENT_API.md#route-structure)
2. Follow [Extending - Adding a New Page/Route](./EXTENDING.md#adding-a-new-pageroute)
3. Add navigation link in Header

### I want to modify cost calculations

1. Read [Component API - Utility Functions](./COMPONENT_API.md#utility-functions)
2. Edit `src/utils/costCalculator.ts`
3. Refer to existing calculation logic

### I want to add compatibility warnings

1. Read [Component API - checkCompatibility](./COMPONENT_API.md#checkcompatibility)
2. Edit `src/utils/compatibilityChecker.ts`
3. Add warning rules based on user choices

## File Quick Reference

```
docs/
├── README.md                  ← You are here
├── PROJECT_OVERVIEW.md        ← High-level project info
├── DATA_SCHEMAS.md            ← JSON data structure reference
├── COMPONENT_API.md           ← Component, hook, utility reference
└── EXTENDING.md               ← How to add features

src/
├── components/
│   ├── Header.tsx             ← Navigation
│   └── keyboard/              ← Main components
│       ├── ConsequencePreview.tsx
│       ├── DecisionTree.tsx
│       ├── ComponentCard.tsx
│       ├── ComponentGrid.tsx
│       └── CostEstimator.tsx
├── contexts/
│   └── UserChoicesContext.tsx  ← Global state
├── data/
│   ├── components.json         ← Component database
│   ├── decision-trees.json     ← Decision definitions
│   └── cost-database.json      ← Pricing data
├── hooks/
│   └── useCostEstimate.ts      ← Cost calculation hook
├── utils/
│   ├── costCalculator.ts       ← Cost/complexity calculations
│   └── compatibilityChecker.ts ← Compatibility validation
└── routes/
    ├── __root.tsx              ← Root layout
    ├── index.tsx               ← Landing page
    ├── builder.tsx             ← Interactive builder
    └── components.tsx          ← Component encyclopedia
```

## Development Workflow

### Starting Development

```bash
npm install
npm run dev
```

### Building for Production

```bash
npm run build
npm run preview
```

### Making Changes

1. Identify what you need to change
2. Read relevant documentation section
3. Make changes to appropriate files
4. Test in development mode
5. Check for TypeScript errors
6. Verify functionality

## Key Concepts

### State Management

- Global state via `UserChoicesContext`
- Persisted to localStorage automatically
- Access via `useUserChoices()` hook

### Cost Calculation

- Centralized in `costCalculator.ts`
- Recalculates on every state change
- Returns breakdown + total

### Compatibility Checking

- Runs before allowing option selection
- Shows warnings in ConsequencePreview modal
- Errors prevent selection, warnings allow with notice

### Decision Flow

- Defined in `decision-trees.json`
- Rendered by `DecisionTree` component
- Each option shows consequence before confirming

### Component Architecture

- Presentation components in `components/keyboard/`
- Data fetching via hooks
- State management via context
- Utilities for calculations

## Need Help?

1. Check the relevant documentation file
2. Search for similar patterns in existing code
3. Review the data schemas
4. Check component props and hook return types

## Contributing

When adding new features:

1. Update relevant data files
2. Update TypeScript types
3. Add documentation to these files
4. Follow existing patterns and conventions
5. Test thoroughly
