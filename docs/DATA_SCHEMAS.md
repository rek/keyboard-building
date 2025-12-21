# Data Schemas

This document describes the structure of all JSON data files used in the application.

## components.json

Located: `src/data/components.json`

### Structure

```typescript
{
  "controllers": Record<string, Controller>,
  "switches": Record<string, Switch>,
  "features": Record<string, Feature>,
  "connectivity": Record<string, Connectivity>,
  "firmware": Record<string, Firmware>
}
```

### Controller Schema

```typescript
interface Controller {
  id: string;
  name: string;
  price: number;
  image: string;                    // Path to image (e.g., "/images/components/pro-micro.jpg")
  specs: {
    mcu: string;                    // Microcontroller model (e.g., "ATmega32U4")
    pins: number;                   // Number of usable pins
    wireless: boolean;
    usbType: string;                // e.g., "micro-usb", "usb-c"
    battery?: string;               // Only for wireless controllers
  };
  complexity: number;               // 1-5 scale
  pros: string[];                   // Array of advantages
  cons: string[];                   // Array of disadvantages
  compatibleWith: string[];         // Array of compatible firmware IDs
  incompatibleWith: string[];       // Array of incompatible firmware IDs
  vendors: Array<{
    name: string;
    url: string;
    price: number;
    note?: string;
  }>;
}
```

### Switch Schema

```typescript
interface Switch {
  id: string;
  name: string;
  price: number;
  priceUnit: string;                // e.g., "per switch"
  image: string;
  specs: {
    profile: string;                // "standard" or "low-profile"
    height: string;                 // e.g., "18.5mm"
    mounting: string;               // "PCB or plate", "PCB only"
  };
  complexity: number;               // 1-5 scale
  pros: string[];
  cons: string[];
  compatibleWith?: string[];        // Array of compatible features
}
```

### Feature Schema

```typescript
interface Feature {
  id: string;
  name: string;
  price: number;
  priceUnit: string;                // e.g., "per socket", "per LED", "per display"
  image: string;
  complexity: number;               // 1-5 scale
  description: string;              // Detailed explanation
  pros: string[];
  cons: string[];
  requiredTools: string[];          // Array of tools needed
  pinRequirement?: number;          // Number of pins needed
  compatibleWith?: string[];
}
```

### Connectivity Schema

```typescript
interface Connectivity {
  id: string;
  name: string;
  price: number;
  image: string;
  complexity: number;
  description: string;
  pros: string[];
  cons: string[];
  compatibleWith?: string[];        // Compatible firmware
  incompatibleWith?: string[];      // Incompatible firmware
  requiredComponents?: string[];    // E.g., ["nice-nano", "battery", "power-switch"]
}
```

### Firmware Schema

```typescript
interface Firmware {
  id: string;
  name: string;
  complexity: number;
  image: string;
  description: string;
  pros: string[];
  cons: string[];
  compatibleWith: string[];         // Compatible controller IDs
  incompatibleWith: string[];       // Incompatible controller IDs
}
```

## decision-trees.json

Located: `src/data/decision-trees.json`

### Structure

```typescript
{
  steps: DecisionStep[]
}
```

### DecisionStep Schema

```typescript
interface DecisionStep {
  id: string;                       // Maps to UserChoices property
  title: string;                    // Display title
  description: string;              // Explanation text
  order: number;                    // Display order (1-based)
  options: DecisionOption[];
}

interface DecisionOption {
  id: string;                       // Value stored in state
  name: string;                     // Display name
  shortDesc: string;                // Brief description
  image: string;                    // Path to image
  costDelta: number;                // Additional cost (USD)
  complexityDelta: number;          // Complexity score 1-5
  timeHours: number;                // Additional build time
  skillLevel: string;               // "Beginner", "Intermediate", "Advanced"
  requiredTools: string[];          // Array of tools needed
  downstreamEffects: string[];      // Array of consequences
}
```

### Decision ID Mapping

Decision IDs map to UserChoices properties:
- `buildMethod` → `UserChoices.buildMethod`
- `layout` → `UserChoices.layout.formFactor`
- `controller` → `UserChoices.controller`
- `switches` → `UserChoices.switchType`
- `connectivity` → `UserChoices.connectivity`
- `firmware` → `UserChoices.firmware`

## cost-database.json

Located: `src/data/cost-database.json`

### Structure

```typescript
interface CostDatabase {
  controllers: Record<string, ControllerPricing>;
  switches: Record<string, SwitchPricing>;
  keycaps: Record<string, number>;
  pcb: Record<string, number>;
  case: Record<string, number>;
  features: Record<string, number>;
  connectivity: Record<string, number>;
  hardware: Record<string, number>;
  shipping: Record<string, number>;
  buildMethodExtras: Record<string, Record<string, number>>;
  tools: Record<string, number>;
}

interface ControllerPricing {
  base: number;
  clone?: number;
  genuine?: number;
}

interface SwitchPricing {
  budget?: number;
  midrange?: number;
  premium?: number;
  standard?: number;
}
```

### Keys

**Controllers**: Match controller IDs from components.json
- `pro-micro`, `elite-c`, `nice-nano`, `rp2040`

**Switches**: Match switch IDs from components.json
- `mx`, `choc-v1`, `choc-v2`

**Keycaps**:
- `mx-budget`, `mx-midrange`, `mx-premium`
- `choc-v1`, `choc-v2`

**PCB**:
- `jlcpcb-5pcs`, `jlcpcb-10pcs`, `pcbway-5pcs`, `kit-predesigned`

**Case**:
- `3d-print-diy`, `3d-print-service`, `acrylic-laser-cut`, `aluminum-cnc`

**Features**:
- `hotswap-socket`, `rgb-led`, `oled-display`, `encoder`, `trackball-pmw3360`

**Connectivity**:
- `trrs-cable`, `trrs-jack`, `battery-lipo`, `power-switch`

**Hardware**:
- `diodes-100pcs`, `wire-30awg`, `screws-standoffs`, `usb-cable`

**Shipping**:
- `domestic`, `aliexpress`, `international-pcb`, `international-parts`

**buildMethodExtras**: Predefined cost bundles
- `handwired`: { wire, diodes, hardware }
- `custom-pcb`: { pcb, diodes, hardware }
- `pcb-kit`: { kit, case }
- `complete-kit`: { keyboard }

## category-info.json

Located: `src/data/category-info.json`

Contains educational content explaining each component category in the Component Encyclopedia.

### Structure

```typescript
{
  "controllers": CategoryInfo,
  "switches": CategoryInfo,
  "features": CategoryInfo,
  "connectivity": CategoryInfo,
  "firmware": CategoryInfo
}
```

### CategoryInfo Schema

```typescript
interface CategoryInfo {
  title: string;              // Display title (e.g., "Controllers")
  tagline: string;            // Short descriptive tagline
  description: string;        // Paragraph explaining what this category is
  whyItMatters: string[];     // Array of bullet points explaining importance
  keyTradeoffs: Array<{
    factor: string;           // Name of the tradeoff (e.g., "Price vs Features")
    description: string;      // Detailed explanation of the tradeoff
  }>;
  quickTips: string[];        // Array of actionable tips for users
}
```

### Example Entry

```json
{
  "controllers": {
    "title": "Controllers",
    "tagline": "The brain of your keyboard",
    "description": "The microcontroller is the most important component...",
    "whyItMatters": [
      "Determines which firmware you can use",
      "Sets the limit on how many keys and features you can support"
    ],
    "keyTradeoffs": [
      {
        "factor": "Price vs Features",
        "description": "Cheaper controllers work great for basic builds..."
      }
    ],
    "quickTips": [
      "For first builds, Pro Micro or Elite-C are safe choices",
      "Planning wireless? Start with nice!nano"
    ]
  }
}
```

### Usage

This data is displayed in the `ComponentGrid` component to provide educational context when browsing components.

## UserChoices Schema

Located: `src/contexts/UserChoicesContext.tsx`

```typescript
interface UserChoices {
  buildMethod: string | null;       // 'handwired' | 'custom-pcb' | 'pcb-kit' | 'complete-kit'
  layout: {
    formFactor: string | null;      // 'ergonomic-3d' | 'flat-splay' | 'standard-split'
    keyCount: number;               // Default: 60
  };
  controller: string | null;        // 'pro-micro' | 'elite-c' | 'nice-nano' | 'rp2040'
  switchType: string | null;        // 'mx' | 'choc-v1' | 'choc-v2'
  features: {
    hotswap: boolean;
    rgb: boolean;
    oled: boolean;
    encoder: boolean;
    trackball: boolean;
    wireless: boolean;
  };
  connectivity: string | null;      // 'trrs' | 'wireless'
  firmware: string | null;          // 'qmk' | 'vial' | 'zmk'
  keycaps: string | null;
}
```

### Stored in localStorage

Key: `"kb-choices"`
Format: JSON stringified UserChoices object

## Adding New Data

### To Add a New Controller

1. Add entry to `components.json` under `controllers`
2. Add pricing to `cost-database.json` under `controllers`
3. Add entry to decision tree option in `decision-trees.json` (controller step)
4. Update compatibility checks in `compatibilityChecker.ts` if needed

### To Add a New Decision Step

1. Add step to `decision-trees.json` with unique ID and options
2. Add corresponding property to `UserChoices` interface
3. Update `DecisionTree.tsx` to map the new decision ID to state
4. Update `getCurrentValue()` function in `DecisionTree.tsx`
5. Add cost calculation logic in `costCalculator.ts` if applicable
6. Add compatibility rules in `compatibilityChecker.ts` if needed

### To Add a New Feature

1. Add entry to `components.json` under `features`
2. Add pricing to `cost-database.json` under `features`
3. Add boolean field to `UserChoices.features`
4. Update cost calculation in `costCalculator.ts`
5. Add pin requirement calculation if needed
6. Update compatibility checker if it conflicts with anything
