# Static Background Image for AnimatedGrid

This directory contains the static fallback image for mobile devices and users with reduced motion preferences.

## 🎯 Quick Start

### Option 1: Use Our Generator (Recommended)
1. Open `generate-static-bg.html` in your browser
2. Click "Generate Grid" 
3. Click "Download WebP"
4. Rename to `bg-grid-static.webp`

### Option 2: Convert SVG
1. Use `bg-grid-static.svg` 
2. Convert to WebP using tools like:
   - [Squoosh.app](https://squoosh.app)
   - ImageMagick: `convert bg-grid-static.svg bg-grid-static.webp`
   - Online converters

## 📁 Required Files
- ✅ `bg-grid-static.webp` - Main fallback (WebP format)
- 🔄 `bg-grid-static.png` - Optional PNG fallback for older browsers

## ⚙️ Optimal Specs
- **Format:** WebP (with PNG fallback)
- **Dimensions:** 1920x1080 or larger  
- **File size:** < 100KB
- **Pattern:** Subtle grid matching your theme
- **Colors:** Match your AnimatedGrid theme

## 🎨 Theme Matching
For custom themes, edit the colors in `generate-static-bg.html`:
```javascript
gridColor: 'rgba(209,209,209,0.1)'     // Grid line color
glowColor: 'rgba(0,200,150,0.08)'      // Center glow
backgroundColor: '#000000'              // Background
```

## 🚀 Usage
The AnimatedGrid component automatically uses this image:
- 📱 Mobile devices (< 640px width)
- ♿ Users with `prefers-reduced-motion`
- 🚫 When `disableAnimation={true}`

## 🔗 Integration
```tsx
<AnimatedGrid 
  staticBgImg="/bg-grid-static.webp"  // Custom path
/>
```
