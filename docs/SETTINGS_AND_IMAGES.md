# Settings & Images Implementation Guide

## What Was Implemented

### 1. App Settings / Learning Mode

Added a comprehensive settings system that allows hiding pricing and vendor information for educational use.

#### Features:
- **Learning Mode Toggle**: Quick toggle that hides all pricing and vendor information
- **Individual Controls**: Fine-grained control over:
  - Show Pricing (cost estimates, breakdowns, currency)
  - Show Vendors (order links, vendor information)
- **Persistent Settings**: Saved to localStorage as `kb-app-settings`
- **Conditional Currency Selector**: Currency options only appear when pricing is enabled

#### Location in UI:
Navigate to the sidebar menu → Settings section (below main navigation)

#### How It Works:
- **Learning Mode ON**: Hides all pricing and vendor information (educational focus)
- **Learning Mode OFF**: Shows individual toggles for pricing and vendors
- Settings auto-save to localStorage and persist across sessions

#### Components Affected:
- `CostEstimator.tsx`: Hides total cost and breakdown when pricing disabled
- `DecisionTree.tsx`: Hides cost delta in option cards
- `ConsequencePreview.tsx`: Hides cost impact in preview modal
- `ComponentCard.tsx`: Hides price when pricing disabled
- `Header.tsx`: Shows/hides currency selector based on pricing setting

### 2. Image System

Created infrastructure for component images with SVG placeholders and documentation for sourcing real photos.

#### What's Ready:
- Directory structure: `/public/images/components/{category}/`
- SVG placeholder images for:
  - Pro Micro controller
  - Cherry MX switch
  - Kailh Choc v1 switch
- Updated `components.json` to use new image paths
- Components now properly render images (ComponentCard, DecisionTree)

#### Image Documentation:
See `/docs/IMAGE_SOURCES.md` for:
- Where to find component images (manufacturer sites, open source)
- Licensing guidelines
- File naming conventions
- How to create SVG diagrams
- Bulk image downloading strategies
- Attribution requirements

## File Changes

### New Files Created:
1. `src/contexts/AppSettingsContext.tsx` - Settings management
2. `docs/IMAGE_SOURCES.md` - Image sourcing guide
3. `docs/SETTINGS_AND_IMAGES.md` - This file
4. `public/images/components/controllers/pro-micro.svg`
5. `public/images/components/switches/mx-switch.svg`
6. `public/images/components/switches/choc-v1.svg`
7. Directory structure for images

### Modified Files:
1. `src/routes/__root.tsx` - Added AppSettingsProvider
2. `src/components/Header.tsx` - Added settings UI and toggles
3. `src/components/keyboard/CostEstimator.tsx` - Conditional pricing display
4. `src/components/keyboard/DecisionTree.tsx` - Conditional pricing, image rendering
5. `src/components/keyboard/ConsequencePreview.tsx` - Conditional pricing
6. `src/components/keyboard/ComponentCard.tsx` - Conditional pricing, image rendering
7. `src/data/components.json` - Updated image paths

## Testing the Features

### Test Learning Mode:
1. Open the app in browser
2. Open navigation sidebar
3. Scroll to "Settings" section
4. Toggle "Learning Mode" on
5. ✅ All pricing should disappear
6. ✅ Currency selector should disappear
7. Navigate to builder page
8. ✅ Decision options should not show cost deltas
9. ✅ Cost Estimator sidebar should show "Build Summary" instead of costs

### Test Individual Toggles:
1. Turn Learning Mode OFF
2. ✅ Two checkboxes should appear: "Show Pricing" and "Show Vendors"
3. Uncheck "Show Pricing"
4. ✅ Same behavior as Learning Mode (prices hidden)
5. Check "Show Pricing" again
6. ✅ Prices should reappear
7. ✅ Currency selector should reappear

### Test Images:
1. Navigate to Components page (`/components`)
2. ✅ Pro Micro should show SVG diagram
3. ✅ MX Switch should show SVG diagram
4. ✅ Choc v1 should show SVG diagram
5. Other components should show placeholder background

## Next Steps

### For Images:
1. **Create more SVG placeholders** for remaining components:
   ```bash
   # Controllers: elite-c, rp2040, nice-nano
   # Switches: choc-v2
   # Features: hotswap, rgb, oled, encoder, trackball
   # Connectivity: trrs, wireless
   # Firmware: qmk, vial, kmk, zmk
   ```

2. **Download real photos** from manufacturers:
   - See `IMAGE_SOURCES.md` for specific sources
   - SparkFun, Adafruit allow product photos with attribution
   - AliExpress has public domain images
   - Unsplash/Pexels for generic keyboard component photos

3. **Batch process images**:
   ```bash
   # Resize to 800x600
   # Convert to WebP for smaller file size
   # Add to public/images/components/{category}/
   ```

4. **Update decision-trees.json** to add image paths to decision options

### For Settings:
1. **Add more granular controls** (if needed):
   - Hide build time estimates
   - Hide complexity scores
   - Hide compatibility warnings
   - Educational tooltips mode

2. **Add presets**:
   - Beginner Mode (show everything, lots of hints)
   - Learning Mode (hide pricing/vendors, show educational info)
   - Advanced Mode (minimal UI, fast workflow)

3. **Export settings** with build plans:
   - Include user's settings in JSON export
   - Allow importing settings

## Usage Examples

### For Educational Workshops:
```typescript
// Default to Learning Mode for workshops
const settings = {
  learningMode: true,  // Hides all commercial aspects
  showPricing: false,
  showVendors: false
};
```

### For Build Planning:
```typescript
// Show everything for actual build planning
const settings = {
  learningMode: false,
  showPricing: true,   // Show costs
  showVendors: true    // Show where to buy
};
```

## Technical Details

### Settings Storage:
```typescript
// localStorage key
'kb-app-settings'

// Default values
{
  showPricing: true,
  showVendors: true,
  learningMode: false
}
```

### Context API:
```typescript
import { useAppSettings } from '../contexts/AppSettingsContext';

const { settings, updateSetting, setLearningMode } = useAppSettings();

// Check if pricing should be shown
if (settings.showPricing) {
  // Show price
}

// Toggle learning mode
setLearningMode(true);

// Update individual setting
updateSetting('showVendors', false);
```

### Image Paths:
```json
{
  "controllers": {
    "pro-micro": {
      "image": "/images/components/controllers/pro-micro.svg"
    }
  }
}
```

## Troubleshooting

### Settings not persisting:
- Check localStorage in browser DevTools
- Key: `kb-app-settings`
- Clear cache and reload

### Images not showing:
- Check path in `components.json`
- Verify file exists in `public/images/components/`
- Check browser console for 404 errors
- SVG files should be accessible at `/images/components/{category}/{name}.svg`

### Learning Mode toggle not working:
- Check AppSettingsProvider is wrapping the app in `__root.tsx`
- Verify all components import and use `useAppSettings()` hook
- Check console for errors

## Attribution

If using manufacturer images, add to `/docs/ATTRIBUTIONS.md`:

```markdown
## Component Images

### Controllers
- **Pro Micro**: SVG diagram created for educational purposes
- **Elite-C**: Photo courtesy of keeb.io

### Switches
- **Cherry MX**: SVG diagram created for educational purposes
- **Kailh Choc**: SVG diagram created for educational purposes
```
