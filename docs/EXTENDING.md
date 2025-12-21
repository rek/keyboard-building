# Extending the Application

This guide shows how to add new features to the Split Keyboard Builder Guide.

## Adding a New Decision Step

Let's say you want to add a "Case Material" decision step.

### 1. Define the Decision in decision-trees.json

```json
{
  "id": "caseMaterial",
  "title": "Choose Your Case Material",
  "description": "The case material affects weight, durability, and aesthetics.",
  "order": 7,
  "options": [
    {
      "id": "3d-printed-pla",
      "name": "3D Printed PLA",
      "shortDesc": "Affordable, customizable, DIY-friendly",
      "image": "/images/case/pla.jpg",
      "costDelta": 20,
      "complexityDelta": 2,
      "timeHours": 8,
      "skillLevel": "Beginner",
      "requiredTools": [
        "3D printer or printing service"
      ],
      "downstreamEffects": [
        "Lightweight but less durable",
        "Easy to modify and reprint",
        "Can customize colors"
      ]
    },
    {
      "id": "acrylic",
      "name": "Acrylic Layers",
      "shortDesc": "Clean look, laser-cut precision",
      "image": "/images/case/acrylic.jpg",
      "costDelta": 40,
      "complexityDelta": 1,
      "timeHours": 2,
      "skillLevel": "Beginner",
      "requiredTools": [
        "Screwdriver"
      ],
      "downstreamEffects": [
        "Professional appearance",
        "More fragile than other materials",
        "Laser cutting service needed"
      ]
    }
  ]
}
```

Add this to the `steps` array in `decision-trees.json`.

### 2. Update UserChoices Interface

In `src/contexts/UserChoicesContext.tsx`:

```typescript
export interface UserChoices {
  buildMethod: string | null;
  layout: { formFactor: string | null; keyCount: number };
  controller: string | null;
  switchType: string | null;
  caseMaterial: string | null;  // ADD THIS
  features: { /* ... */ };
  connectivity: string | null;
  firmware: string | null;
  keycaps: string | null;
}

const defaultChoices: UserChoices = {
  // ... existing defaults
  caseMaterial: null,  // ADD THIS
};
```

### 3. Update DecisionTree Component

In `src/components/keyboard/DecisionTree.tsx`, update the mapping functions:

```typescript
const getCurrentValue = (decisionId: string): string | null => {
  if (decisionId === 'buildMethod') return choices.buildMethod;
  if (decisionId === 'layout') return choices.layout.formFactor;
  if (decisionId === 'controller') return choices.controller;
  if (decisionId === 'switches') return choices.switchType;
  if (decisionId === 'connectivity') return choices.connectivity;
  if (decisionId === 'firmware') return choices.firmware;
  if (decisionId === 'caseMaterial') return choices.caseMaterial;  // ADD THIS
  return null;
};

const handleConfirm = () => {
  // ... existing code

  // ADD THIS
  else if (selectedDecisionId === 'caseMaterial') {
    updateChoice('caseMaterial', optionId);
  }

  // ... existing code
};
```

### 4. Update Cost Calculator (Optional)

If this affects cost, update `src/utils/costCalculator.ts`:

```typescript
export function calculateCost(choices: UserChoices): CostEstimate {
  const breakdown: CostBreakdown = {
    // ... existing
  };

  // ADD THIS
  if (choices.caseMaterial === '3d-printed-pla') {
    breakdown.case = 20;
  } else if (choices.caseMaterial === 'acrylic') {
    breakdown.case = 40;
  }

  // ... rest of function
}
```

### 5. Update Compatibility Checker (Optional)

If there are compatibility rules, add them in `src/utils/compatibilityChecker.ts`:

```typescript
export function checkCompatibility(choices: UserChoices): CompatibilityWarning[] {
  const warnings: CompatibilityWarning[] = [];

  // ADD THIS
  if (choices.layout.formFactor === 'ergonomic-3d' && choices.caseMaterial === 'acrylic') {
    warnings.push({
      severity: 'warning',
      message: 'Acrylic cases are difficult to create for 3D curved layouts. Consider 3D printing.',
      affectedChoices: ['layout', 'caseMaterial'],
    });
  }

  // ... existing checks
  return warnings;
}
```

## Adding a New Component Category

Let's add "Keycap Sets" as a browsable category.

### 1. Add Data to components.json

```json
{
  "controllers": { /* ... */ },
  "switches": { /* ... */ },
  "keycaps": {
    "gmk-standard": {
      "id": "gmk-standard",
      "name": "GMK Keycap Set",
      "price": 120,
      "priceUnit": "per set",
      "image": "/images/keycaps/gmk.jpg",
      "complexity": 1,
      "specs": {
        "profile": "Cherry",
        "material": "ABS",
        "compatibility": "MX only"
      },
      "pros": [
        "Premium quality",
        "Thick legends",
        "Many color options"
      ],
      "cons": [
        "Expensive",
        "Long wait times",
        "MX switches only"
      ],
      "compatibleWith": ["mx"]
    }
  }
}
```

### 2. Update ComponentGrid Component

In `src/components/keyboard/ComponentGrid.tsx`:

```typescript
type ComponentCategory =
  | 'controllers'
  | 'switches'
  | 'features'
  | 'connectivity'
  | 'firmware'
  | 'keycaps';  // ADD THIS

const categories: { id: ComponentCategory; label: string }[] = [
  { id: 'controllers', label: 'Controllers' },
  { id: 'switches', label: 'Switches' },
  { id: 'features', label: 'Features' },
  { id: 'connectivity', label: 'Connectivity' },
  { id: 'firmware', label: 'Firmware' },
  { id: 'keycaps', label: 'Keycap Sets' },  // ADD THIS
];
```

That's it! The component will automatically render the new category.

## Adding a New Feature Toggle

Let's add a "Wireless Charging" feature.

### 1. Add to components.json

```json
{
  "features": {
    "wireless-charging": {
      "id": "wireless-charging",
      "name": "Wireless Charging",
      "price": 15.0,
      "priceUnit": "per charging pad",
      "image": "/images/features/wireless-charging.jpg",
      "complexity": 3,
      "description": "Qi wireless charging for battery-powered keyboards",
      "pros": [
        "Convenient charging",
        "No cable wear",
        "Modern feature"
      ],
      "cons": [
        "Requires wireless keyboard",
        "Slower than wired",
        "Additional components needed"
      ],
      "requiredTools": ["Soldering iron", "Hot glue gun"],
      "pinRequirement": 0
    }
  }
}
```

### 2. Update UserChoices

```typescript
features: {
  hotswap: boolean;
  rgb: boolean;
  oled: boolean;
  encoder: boolean;
  trackball: boolean;
  wireless: boolean;
  wirelessCharging: boolean;  // ADD THIS
}

const defaultChoices: UserChoices = {
  // ...
  features: {
    hotswap: false,
    rgb: false,
    oled: false,
    encoder: false,
    trackball: false,
    wireless: false,
    wirelessCharging: false,  // ADD THIS
  },
};
```

### 3. Add Cost Calculation

In `src/utils/costCalculator.ts`:

```typescript
// Wireless charging
if (choices.features.wirelessCharging) {
  breakdown.features += 15 * 2; // 2 charging pads for split keyboard
}
```

### 4. Add Compatibility Check

```typescript
// Wireless charging requires wireless build
if (choices.features.wirelessCharging && !choices.features.wireless) {
  warnings.push({
    severity: 'error',
    message: 'Wireless charging requires a wireless keyboard build.',
    affectedChoices: ['features'],
  });
}
```

### 5. Create UI for Feature Selection

You could add a separate "Features" page or add toggles to the builder. Example:

```tsx
// In a new FeatureSelector component
<div>
  <label>
    <input
      type="checkbox"
      checked={choices.features.wirelessCharging}
      onChange={(e) => updateFeature('wirelessCharging', e.target.checked)}
    />
    Wireless Charging
  </label>
</div>
```

## Adding a New Page/Route

Let's add a "Build Gallery" page.

### 1. Create Route File

Create `src/routes/gallery.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/gallery')({
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Build Gallery
        </h1>
        {/* Gallery content */}
      </div>
    </div>
  );
}
```

### 2. Add to Navigation

In `src/components/Header.tsx`:

```tsx
<Link
  to="/gallery"
  onClick={() => setIsOpen(false)}
  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
  activeProps={{
    className: 'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
  }}
>
  <ImageIcon size={20} />
  <span className="font-medium">Gallery</span>
</Link>
```

### 3. Add Link on Landing Page (Optional)

```tsx
<Link to="/gallery" className="...">
  View Build Gallery
</Link>
```

## Adding a New Utility Function

Let's add a pin calculator.

### 1. Create Utility

Create `src/utils/pinCalculator.ts`:

```typescript
import { UserChoices } from '../contexts/UserChoicesContext';

export interface PinRequirements {
  matrix: number;      // Rows + columns
  features: number;    // Additional features
  total: number;       // Total required
  available: number;   // Available on controller
  remaining: number;   // Remaining pins
  warnings: string[];
}

export function calculatePinRequirements(choices: UserChoices): PinRequirements {
  let matrix = 0;
  let features = 0;
  const warnings: string[] = [];

  // Calculate matrix pins (rough estimate)
  const keyCount = choices.layout.keyCount / 2; // per half
  const rows = Math.ceil(Math.sqrt(keyCount));
  const cols = Math.ceil(keyCount / rows);
  matrix = rows + cols;

  // Feature pins
  if (choices.features.rgb) features += 1;
  if (choices.features.oled) features += 2;
  if (choices.features.encoder) features += 3;
  if (choices.features.trackball) features += 6;

  const total = matrix + features;

  // Available pins based on controller
  let available = 0;
  if (choices.controller === 'pro-micro' || choices.controller === 'elite-c') {
    available = 12;
  } else if (choices.controller === 'rp2040') {
    available = 20;
  } else if (choices.controller === 'nice-nano') {
    available = 13;
  }

  const remaining = available - total;

  if (remaining < 0) {
    warnings.push(`You need ${Math.abs(remaining)} more pins. Consider a controller with more pins.`);
  } else if (remaining < 2) {
    warnings.push('Very tight on pins. No room for additional features.');
  }

  return { matrix, features, total, available, remaining, warnings };
}
```

### 2. Create Hook

Create `src/hooks/usePinCalculator.ts`:

```typescript
import { useMemo } from 'react';
import { useUserChoices } from '../contexts/UserChoicesContext';
import { calculatePinRequirements } from '../utils/pinCalculator';

export function usePinCalculator() {
  const { choices } = useUserChoices();

  return useMemo(() => calculatePinRequirements(choices), [choices]);
}
```

### 3. Use in Component

```tsx
import { usePinCalculator } from '../hooks/usePinCalculator';

function PinCounter() {
  const pins = usePinCalculator();

  return (
    <div>
      <h3>Pin Usage</h3>
      <p>Using {pins.total} of {pins.available} pins</p>
      <p>{pins.remaining} pins remaining</p>
      {pins.warnings.map((warning, i) => (
        <div key={i} className="text-yellow-600">{warning}</div>
      ))}
    </div>
  );
}
```

## Testing Your Changes

After adding new features:

1. **Check TypeScript Compilation**
   ```bash
   npm run build
   ```

2. **Test in Development**
   ```bash
   npm run dev
   ```

3. **Verify:**
   - New data appears correctly
   - State updates properly
   - Cost calculations are correct
   - No console errors
   - Compatibility warnings work
   - localStorage persists changes

## Best Practices

1. **Always update TypeScript types** when changing data structures
2. **Keep data files in sync** - if you add a controller, add it to all relevant places
3. **Test compatibility rules** - ensure warnings appear when expected
4. **Use existing utilities** - don't duplicate `formatCurrency`, `checkCompatibility`, etc.
5. **Follow styling conventions** - use Tailwind classes consistently
6. **Add documentation** - update these docs when adding major features
7. **Consider mobile** - test responsive design with new components
