# Component Image Sources

This document tracks where to find images for keyboard components and provides guidelines for adding them to the project.

## Image Guidelines

### Requirements
- **Format**: WebP (preferred) or PNG/JPEG
- **Size**: 800x600px (4:3 aspect ratio)
- **Quality**: High resolution, clear product photos
- **License**: Open source, Creative Commons, or manufacturer-provided
- **Background**: White or transparent preferred

### File Naming Convention
```
/public/images/components/{category}/{component-id}.webp
```

Examples:
- `/public/images/components/controllers/pro-micro.webp`
- `/public/images/components/switches/mx-switch.webp`

## Image Sources

### Controllers

#### Pro Micro
- **Source**: SparkFun Product Photos
- **URL**: https://www.sparkfun.com/products/12640
- **License**: CC BY-SA 4.0 (SparkFun allows use with attribution)
- **Alternative**: Use product photo from AliExpress (public domain)

#### Elite-C
- **Source**: keeb.io product page
- **URL**: https://keeb.io/products/elite-c-low-profile-version-usb-c-pro-micro-replacement-atmega32u4
- **Alternative**: Create SVG diagram

#### RP2040 (KB2040, etc.)
- **Source**: Adafruit product photos
- **URL**: https://www.adafruit.com/product/5302
- **License**: Adafruit allows product photos with attribution

#### nice!nano
- **Source**: nice Keyboards official site
- **URL**: https://nicekeyboards.com/nice-nano/
- **License**: Check with nice Keyboards

### Switches

#### Cherry MX
- **Source**: Unsplash/Pexels keyboard photos
- **URL**: https://unsplash.com/s/photos/cherry-mx-switch
- **License**: Free to use (Unsplash license)
- **Alternative**: Crop from keyboard photo

#### Kailh Choc V1/V2
- **Source**: Kailh official images
- **URL**: http://www.kailhswitch.com/
- **Alternative**: AliExpress product photos

### Features

#### OLED Display
- **Source**: Adafruit SSD1306 OLED
- **URL**: https://www.adafruit.com/product/326
- **License**: Adafruit product photos allowed with attribution

#### Rotary Encoder
- **Source**: SparkFun
- **URL**: https://www.sparkfun.com/products/9117

#### PMW3360 Sensor (Trackball)
- **Source**: AliExpress product photos
- **Alternative**: Create diagram showing sensor placement

## Placeholder Images

For components without real photos, use these placeholder strategies:

### SVG Diagrams
Create simple SVG diagrams showing:
- Controller pin layout
- Switch cross-section
- Feature module diagram

### Gradient Placeholders
Current implementation uses colored gradients:
```tsx
<div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100">
  <span className="text-gray-400">Component Image</span>
</div>
```

### Placeholder Services
- **placeholder.com**: `https://via.placeholder.com/800x600/3B82F6/FFFFFF?text=Pro+Micro`
- **UI Avatars**: For simple icon-like images

## Quick Start: Adding Images

1. **Download image** from manufacturer or open source
2. **Resize** to 800x600px (maintain aspect ratio, add padding if needed)
3. **Convert to WebP** (optional but recommended):
   ```bash
   cwebp input.jpg -q 80 -o output.webp
   ```
4. **Save** to `/public/images/components/{category}/{id}.webp`
5. **Update** components.json:
   ```json
   {
     "id": "pro-micro",
     "image": "/images/components/controllers/pro-micro.webp"
   }
   ```

## Bulk Image Sources

### Option 1: DIY Photography
- Take photos of your own components
- White background, good lighting
- Consistent angle (45° or top-down)

### Option 2: Scrape Vendor Sites
Script to download from vendors (with permission):
```bash
# See /scripts/download-component-images.sh
```

### Option 3: Community Contributions
- QMK Discord community
- r/MechanicalKeyboards
- Open source keyboard projects on GitHub

## Legal Considerations

### Fair Use
- Product photos for educational purposes
- Transformation (cropping, background removal)
- Non-commercial use

### Attribution Required
When using manufacturer images, add attribution in:
- `/docs/ATTRIBUTIONS.md`
- Image metadata
- About page footer

### Ask for Permission
For professional photos:
1. Email manufacturer/vendor
2. Explain educational use
3. Offer attribution/link back

## Example Attribution

```markdown
## Image Credits

### Controllers
- **Pro Micro**: Product photo courtesy of SparkFun Electronics (CC BY-SA 4.0)
- **Elite-C**: Image from keeb.io with permission
- **RP2040**: Adafruit product photo (used with attribution)

### Switches
- **Cherry MX**: Photo by [Photographer] on Unsplash
```

## Creating Your Own SVG Icons

For simple components, create SVG diagrams:

```svg
<!-- /public/images/components/controllers/pro-micro.svg -->
<svg width="800" height="600" viewBox="0 0 800 600">
  <!-- Draw simplified controller -->
  <rect x="250" y="150" width="300" height="300" fill="#2C5F2D" rx="10"/>
  <text x="400" y="320" text-anchor="middle" fill="white" font-size="24">
    Pro Micro
  </text>
  <!-- Add pin labels, USB connector, etc. -->
</svg>
```

## Automated Tools

### Image Optimization
```bash
# Install tools
npm install -g sharp-cli imagemin-cli

# Batch convert to WebP
for file in public/images/components/**/*.{jpg,png}; do
  sharp -i "$file" -o "${file%.*}.webp" -f webp -q 80
done
```

### Background Removal
- **remove.bg**: Free API for background removal
- **GIMP**: Manual background removal
- **Photopea**: Online Photoshop alternative

## Next Steps

1. ✅ Set up image directories
2. ⬜ Download/create controller images
3. ⬜ Download/create switch images
4. ⬜ Create feature component images
5. ⬜ Set up attribution file
6. ⬜ Update components.json with image paths
