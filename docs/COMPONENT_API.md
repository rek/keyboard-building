# Component API Reference

## Context Providers

### UserChoicesProvider

Wraps the entire application (in `__root.tsx`) to provide global state.

```tsx
import { UserChoicesProvider } from '../contexts/UserChoicesContext';

<UserChoicesProvider>
  {children}
</UserChoicesProvider>
```

### CurrencyProvider

Wraps the entire application (in `__root.tsx`) to provide currency management.

```tsx
import { CurrencyProvider } from '../contexts/CurrencyContext';

<CurrencyProvider>
  {children}
</CurrencyProvider>
```

## Hooks

### useUserChoices

Access and update user choices.

```tsx
import { useUserChoices } from '../contexts/UserChoicesContext';

const {
  choices,        // Current UserChoices object
  updateChoice,   // Update a top-level choice
  updateFeature,  // Update a feature boolean
  resetChoices,   // Clear all choices
  isComplete      // Boolean: are core choices complete?
} = useUserChoices();
```

**Methods:**

```typescript
// Update a choice
updateChoice('buildMethod', 'handwired');
updateChoice('controller', 'pro-micro');
updateChoice('layout', { formFactor: 'flat-splay', keyCount: 60 });

// Update a feature
updateFeature('hotswap', true);
updateFeature('rgb', false);

// Reset everything
resetChoices();
```

### useCurrency

Access and manage currency settings.

```tsx
import { useCurrency } from '../contexts/CurrencyContext';

const {
  currency,           // Current currency ('USD' | 'NPR')
  setCurrency,        // Update currency
  formatCurrency,     // Format number as currency
  convertAmount       // Convert USD to current currency
} = useCurrency();
```

**Methods:**

```typescript
// Format a price
formatCurrency(45.99);  // "$45.99" (USD) or "रू 6,139" (NPR)

// Convert USD to current currency
convertAmount(100);     // 100 (USD) or 13350 (NPR)

// Change currency
setCurrency('NPR');
setCurrency('USD');
```

**Available Currencies:**

- `USD` - US Dollar ($)
- `NPR` - Nepali Rupee (रू)

Conversion rate: 1 USD = 133.5 NPR

### useCostEstimate

Get real-time cost, complexity, and time estimates.

```tsx
import { useCostEstimate } from '../hooks/useCostEstimate';

const {
  breakdown,        // CostBreakdown object
  total,            // Total cost (number)
  perHalf,          // Per-half cost breakdown
  complexity,       // Complexity score 1-10
  buildTimeHours    // Estimated build time
} = useCostEstimate();
```

**CostBreakdown:**

```typescript
interface CostBreakdown {
  controller: number;
  switches: number;
  keycaps: number;
  pcb: number;
  case: number;
  hardware: number;
  features: number;
  connectivity: number;
  shipping: number;
  tools: number;
}
```

## Components

### DecisionTree

Main interactive decision flow component.

**Location:** `src/components/keyboard/DecisionTree.tsx`

**Usage:**

```tsx
import { DecisionTree } from '../components/keyboard/DecisionTree';

<DecisionTree />
```

**Props:** None (uses context internally)

**Features:**
- Reads decision steps from `decision-trees.json`
- Shows consequence preview on option click
- Updates user choices on confirmation
- Runs compatibility checks before allowing selection
- Visual indication of completed steps

**State:**
- Manages preview modal visibility internally
- Tracks which decision is being previewed

### ConsequencePreview

Modal showing impact of a decision before confirming.

**Location:** `src/components/keyboard/ConsequencePreview.tsx`

**Usage:**

```tsx
import { ConsequencePreview } from '../components/keyboard/ConsequencePreview';

<ConsequencePreview
  data={previewData}
  onClose={() => setPreviewData(null)}
  onConfirm={handleConfirm}
/>
```

**Props:**

```typescript
interface ConsequencePreviewProps {
  data: ConsequencePreviewData | null;  // null = hidden
  onClose: () => void;                  // Close handler
  onConfirm: () => void;                // Confirm handler
}

interface ConsequencePreviewData {
  decision: string;                     // Decision title
  option: {
    id: string;
    name: string;
    shortDesc: string;
    costDelta: number;
    complexityDelta: number;
    timeHours: number;
    skillLevel: string;
    requiredTools: string[];
    downstreamEffects: string[];
  };
  warnings: Array<{
    severity: 'error' | 'warning' | 'info';
    message: string;
  }>;
}
```

**Features:**
- Displays cost, time, and complexity impacts
- Shows required tools
- Lists downstream effects
- Displays compatibility warnings with color coding
- Disables confirm button if there are errors

### CostEstimator

Real-time cost tracking sidebar.

**Location:** `src/components/keyboard/CostEstimator.tsx`

**Usage:**

```tsx
import { CostEstimator } from '../components/keyboard/CostEstimator';

<CostEstimator />
```

**Props:** None (uses hooks internally)

**Features:**
- Large total cost display
- Compatibility warnings summary
- Complexity progress bar
- Build time estimate
- Detailed cost breakdown
- Export build plan (JSON or text format)

**Styling:**
- Sticky positioning (`sticky top-4`)
- Designed for sidebar layout

### ComponentGrid

Component encyclopedia with filtering and search.

**Location:** `src/components/keyboard/ComponentGrid.tsx`

**Usage:**

```tsx
import { ComponentGrid } from '../components/keyboard/ComponentGrid';

<ComponentGrid />
```

**Props:** None

**Features:**
- Category tabs (controllers, switches, features, connectivity, firmware)
- Educational category introductions (from category-info.json)
- Search bar
- Grid layout of component cards
- Filters by category and search term

**Category Information:**
Each category displays:
- Title and tagline
- Description explaining what the category is
- "Why It Matters" bullet points
- Key trade-offs with detailed explanations
- Quick tips for decision-making

**Data Source:**
Category information loaded from `src/data/category-info.json`

**State:**
- Manages selected category
- Manages search term

### ComponentCard

Individual component display card.

**Location:** `src/components/keyboard/ComponentCard.tsx`

**Usage:**

```tsx
import { ComponentCard } from '../components/keyboard/ComponentCard';

<ComponentCard
  component={componentData}
  category="controllers"
  onClick={() => handleClick()}
/>
```

**Props:**

```typescript
interface ComponentCardProps {
  component: {
    id: string;
    name: string;
    price: number;
    priceUnit?: string;
    image: string;
    complexity: number;
    specs?: Record<string, any>;
    pros: string[];
    cons: string[];
    compatibleWith?: string[];
    incompatibleWith?: string[];
  };
  category: string;
  onClick?: () => void;              // Optional click handler
}
```

**Features:**
- Image placeholder
- Price display
- Complexity visualization
- Top 3 specs preview
- Top 2 pros/cons
- Compatibility tags
- Hover effects

## Utility Functions

### calculateCost

Calculate total cost based on choices.

```tsx
import { calculateCost } from '../utils/costCalculator';

const { breakdown, total, perHalf } = calculateCost(choices);
```

### calculateComplexity

Calculate complexity score (1-10).

```tsx
import { calculateComplexity } from '../utils/costCalculator';

const complexity = calculateComplexity(choices);  // number 1-10
```

### estimateBuildTime

Calculate estimated build time in hours.

```tsx
import { estimateBuildTime } from '../utils/costCalculator';

const hours = estimateBuildTime(choices);  // number
```

### checkCompatibility

Check for compatibility issues.

```tsx
import { checkCompatibility } from '../utils/compatibilityChecker';

const warnings = checkCompatibility(choices);
// Returns: CompatibilityWarning[]

interface CompatibilityWarning {
  severity: 'error' | 'warning' | 'info';
  message: string;
  affectedChoices: string[];
}
```

### getCompatibilityStatus

Get overall compatibility status.

```tsx
import { getCompatibilityStatus } from '../utils/compatibilityChecker';

const status = getCompatibilityStatus(warnings);
// Returns: 'ok' | 'warnings' | 'errors'
```

## Styling Conventions

### Tailwind Classes

**Container widths:**
- Max content width: `max-w-7xl mx-auto`

**Cards:**
- White cards: `bg-white rounded-lg shadow-md p-6`
- Hover effect: `hover:shadow-xl transition-shadow`

**Buttons:**
- Primary: `bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors`
- Secondary: `bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50`

**Color Palette:**
- Primary: `blue-600` (#2563eb)
- Success: `green-500/600`
- Warning: `yellow-500/600`
- Error: `red-500/600`
- Info: `blue-500/600`
- Purple accent: `purple-600`

**Complexity Indicators:**
- Dots: `w-3 h-3 rounded-full`
- Active: `bg-orange-500`
- Inactive: `bg-gray-300`

**Spacing:**
- Section padding: `p-6` or `p-8`
- Grid gaps: `gap-4` to `gap-8`
- Vertical spacing: `space-y-4` to `space-y-8`

## Route Structure

All routes use TanStack Router file-based routing.

### Creating a New Route

1. Create file in `src/routes/`
2. Export route with `createFileRoute`
3. Define component

**Example:**

```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my-page')({
  component: MyPage,
});

function MyPage() {
  return <div>My Page Content</div>;
}
```

### Navigation

Use TanStack Router's `Link` component:

```tsx
import { Link } from '@tanstack/react-router';

<Link to="/builder">Go to Builder</Link>
```

### Available Routes

- `/` - Landing page
- `/builder` - Interactive builder
- `/components` - Component encyclopedia
- `/demo/*` - Demo pages (can be removed)
