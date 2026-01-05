# Split Keyboard Builder Guide - Project Overview

## Purpose

An interactive web application that guides users through building custom split keyboards. The app helps users make informed decisions by showing real-time cost estimates, complexity scores, and compatibility warnings before they commit to choices.

## Key Features

### 1. Interactive Decision Tree

- Step-by-step guided decision-making process
- 6 main decision categories: Build Method, Layout, Controller, Switches, Connectivity, Firmware
- Consequence preview modal shows impact before confirming choices
- Real-time compatibility checking

### 2. Real-Time Cost Estimator

- Live cost calculation as users make choices
- Detailed breakdown by category (controller, switches, PCB, features, etc.)
- Complexity score (1-10 scale)
- Estimated build time in hours
- Compatibility warnings integration

### 3. Component Encyclopedia

- Browsable database of keyboard components
- Categorized by: Controllers, Switches, Features, Connectivity, Firmware
- Search functionality
- Detailed specs, pros/cons, compatibility info

### 4. State Persistence

- Automatic localStorage saving of user choices
- Progress persists across browser sessions

## Tech Stack

- **Framework**: TanStack Start (React-based)
- **Routing**: TanStack Router
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: React Context API

## Project Structure

```
src/
├── components/
│   ├── Header.tsx                    # Navigation header
│   └── keyboard/                     # Keyboard-specific components
│       ├── ConsequencePreview.tsx    # Modal for decision impact
│       ├── DecisionTree.tsx          # Main decision flow
│       ├── ComponentCard.tsx         # Individual component display
│       ├── ComponentGrid.tsx         # Component encyclopedia grid
│       └── CostEstimator.tsx         # Real-time cost sidebar
├── contexts/
│   └── UserChoicesContext.tsx        # Global state for user decisions
├── data/
│   ├── components.json               # Component database
│   ├── decision-trees.json           # Decision flow definitions
│   └── cost-database.json            # Pricing data
├── hooks/
│   └── useCostEstimate.ts            # Cost calculation hook
├── utils/
│   ├── costCalculator.ts             # Cost/complexity/time calculations
│   └── compatibilityChecker.ts       # Component compatibility validation
└── routes/
    ├── __root.tsx                    # Root layout with context provider
    ├── index.tsx                     # Landing page
    ├── builder.tsx                   # Interactive builder page
    └── components.tsx                # Component encyclopedia page
```

## User Flow

1. **Landing Page** (`/`)
   - Introduction to split keyboards
   - Feature highlights
   - Call-to-action buttons to Builder or Component Encyclopedia

2. **Builder Page** (`/builder`)
   - Left side: Decision tree with step-by-step choices
   - Right side: Real-time cost estimator sidebar
   - Modal: Consequence preview when hovering/clicking options

3. **Components Page** (`/components`)
   - Category tabs for filtering
   - Search bar
   - Grid of component cards
   - Click for detailed view (not yet implemented)

## Core Concepts

### Decision Tree

Each decision step has:

- Title and description
- Multiple options (2-4 typically)
- Each option shows: cost delta, complexity, time, skill level, tools needed, downstream effects

### Consequence Preview

Before confirming a choice, users see:

- Cost impact
- Build time increase
- Complexity increase
- Required tools
- Downstream effects (what this affects)
- Compatibility warnings (errors/warnings/info)

### Compatibility System

Automatically checks for:

- Firmware/controller mismatches (e.g., ZMK requires nice!nano)
- Pin count requirements vs available pins
- Wireless build requirements
- Feature complexity warnings

### Cost Calculation

Calculates total cost including:

- Controllers (x2 for split)
- Switches (based on key count)
- Keycaps
- PCB manufacturing costs
- Case costs
- Features (hotswap sockets, RGB, OLED, encoders, trackball)
- Connectivity (TRRS cable or wireless batteries)
- Hardware and shipping

## Target Audience

- **Beginners**: Learn about split keyboards with guided decisions
- **Intermediate**: Make informed component choices with cost/complexity awareness
- **Advanced**: Quick component reference and build planning

## Future Enhancements (Not Yet Implemented)

- Export build plan as PDF/JSON
- Visual pin calculator
- Build gallery with user submissions
- Firmware configurator integration
- Wiring diagram generation
- Shopping cart integration with vendor links
- Build progress tracker
- Community features (ratings, comments)
