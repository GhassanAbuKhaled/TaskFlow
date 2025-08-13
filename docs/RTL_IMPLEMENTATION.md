# RTL Implementation Guide

## Overview
This document describes the implementation of Arabic RTL (Right-to-Left) support in the TaskFlow application.

## Implementation Approach

### 1. Language Configuration
- Added Arabic (`ar`) to supported languages in `i18n.ts`
- Created comprehensive Arabic translation file at `/public/locales/ar/translation.json`
- Implemented automatic direction switching based on language selection

### 2. Global RTL Direction
- Added language change listener in `i18n.ts` that sets `dir="rtl"` and `lang="ar"` on document root
- Direction changes automatically when switching to/from Arabic without page reload

### 3. CSS Strategy
- Used CSS logical properties where possible (margin-inline, padding-inline)
- Added RTL-specific overrides in `index.css` using `[dir="rtl"]` selectors
- Created custom Tailwind utilities for text overflow handling

### 4. Component Updates

#### Header Component
- Added RTL-aware spacing using `space-x-reverse` for Arabic
- Maintained existing LTR layout for English/German

#### Sidebar Component  
- Positioned sidebar on right side for Arabic (`right-0` vs `left-0`)
- Updated slide animations to work from appropriate side
- Changed collapse/expand icons to use proper directional chevrons
- Applied RTL text alignment and icon spacing

#### TaskCard Component
- Added RTL spacing for icon and text elements
- Implemented `overflow-wrap: anywhere` for long Arabic text
- Maintained card layout integrity across languages

#### Dashboard Component
- Updated button icon spacing for RTL
- Added text wrapping utilities for Arabic labels

### 5. Utility Hooks
Created `useRTL.ts` hook providing:
- `useRTL()`: Returns boolean for current RTL state
- `useRTLClasses()`: Returns RTL-aware class utilities

### 6. Tailwind Configuration
- Added custom utilities for text overflow handling
- Implemented RTL-safe text wrapping classes

## Key Features Implemented

### ✅ Language Setup
- [x] Arabic added to i18n config with complete translations
- [x] Language switcher includes Arabic option
- [x] Live language switching without reload

### ✅ Global RTL
- [x] Automatic `dir="rtl"` and `lang="ar"` on document root
- [x] CSS logical properties and RTL overrides
- [x] No container flipping - proper directional layout

### ✅ Navbar & Sidebar
- [x] Navbar maintains proper flow (logo right, actions left in Arabic)
- [x] Sidebar positioned on right for Arabic at all breakpoints
- [x] Correct slide animations from appropriate side

### ✅ Component RTL Support
- [x] Dropdowns, menus, and tooltips align correctly
- [x] Button groups and icon spacing respect RTL
- [x] Form inputs and placeholders align right in Arabic

### ✅ Text & Layout Robustness
- [x] Long Arabic text handled with safe wrapping
- [x] Ellipsis for truncated text
- [x] No fixed pixel widths that break with Arabic

### ✅ Styling Framework
- [x] RTL-friendly utilities and overrides
- [x] Guarded changes behind `[dir="rtl"]` selectors
- [x] No regression in LTR styles

## Usage Guidelines

### Adding New Translatable Text
1. Add key to all three translation files (`en`, `de`, `ar`)
2. Use `t('key')` in components
3. For pluralization, follow i18next conventions

### RTL-Aware Component Development
```tsx
import { useRTL } from '@/hooks/useRTL';

const MyComponent = () => {
  const isRTL = useRTL();
  
  return (
    <div className={cn(
      "flex items-center",
      isRTL ? "space-x-reverse space-x-2" : "space-x-2"
    )}>
      <Icon className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
      <span className="overflow-wrap-anywhere">Text content</span>
    </div>
  );
};
```

### CSS Best Practices
- Use `space-x-reverse` for RTL spacing
- Apply `overflow-wrap-anywhere` for Arabic text
- Use logical properties when possible
- Guard RTL-specific styles with `[dir="rtl"]`

## Testing Checklist

### Language Switching
- [x] EN ⇄ DE ⇄ AR switching works without reload
- [x] No layout jumps during language changes
- [x] Direction changes immediately

### Layout Verification
- [x] Navbar: Logo right, actions left in Arabic
- [x] Sidebar: Right-positioned at all breakpoints in Arabic
- [x] Cards and components maintain proper alignment

### Text Handling
- [x] Long Arabic strings don't break layouts
- [x] Buttons accommodate Arabic text lengths
- [x] Form inputs align correctly

### Component Behavior
- [x] Dropdowns open with correct anchoring
- [x] Tooltips position appropriately
- [x] Animations work from correct directions

## Browser Support
- Modern browsers with CSS logical properties support
- Fallbacks provided for older browsers via explicit RTL rules
- Tested on Chrome, Firefox, Safari, Edge

## Performance Considerations
- Language switching is instant (no reload required)
- CSS changes are minimal and scoped
- No impact on LTR performance

## Accessibility
- Proper `lang` attribute set for screen readers
- Text direction correctly announced
- No new accessibility violations introduced