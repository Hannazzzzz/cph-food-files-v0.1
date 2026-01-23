# CPH Food Files – Complete UI Style Guide

## Design Direction

**Concept:** Playful OS Terminal  
**Inspiration:** 1990s desktop operating systems, STRP Biennial (technical grids), VPRO Jeugd (vibrant palette)  
**Core principles:**
- Scandinavian minimalism with "spikey" personality
- Monospace typography throughout
- Thin-bordered grids and hard edges (no rounded corners)
- High-contrast fluorescent accents on neutral backgrounds
- Technical, dense layouts that feel like sophisticated software

---

## Color Palette

### Primary Colors

**Electric Pink**
- Hex: `#FF1493`
- RGB: `(255, 20, 147)`
- Usage: Active states, selected filters, interactive highlights, map markers

**Deep Orange**
- Hex: `#FF4500`
- RGB: `(255, 69, 0)`
- Usage: Hover states, secondary interactive elements

**Black**
- Hex: `#000000`
- RGB: `(0, 0, 0)`
- Usage: Text, borders, card outlines, dividers (1px)

**Beige/Cream**
- Hex: `#F5F5DC`
- RGB: `(245, 245, 220)`
- Usage: Page background, "workstation grey" base

### Accent Colors

**Gold**
- Hex: `#FFD700`
- RGB: `(255, 215, 0)`

**Purple**
- Hex: `#8B4789`
- RGB: `(139, 71, 137)`

**Cyan**
- Hex: `#00CED1`
- RGB: `(0, 206, 209)`

**Blue**
- Hex: `#1E90FF`
- RGB: `(30, 144, 255)`
- Usage: Default link color

**Brown**
- Hex: `#8B7355`
- RGB: `(139, 115, 85)`

**Dark Grey**
- Hex: `#666666`
- RGB: `(102, 102, 102)`
- Usage: Secondary text, labels

**White**
- Hex: `#FFFFFF`
- RGB: `(255, 255, 255)`
- Usage: Card backgrounds, popup text on dark backgrounds

---

## Typography

### Font Family

**Primary font:** Space Mono (monospace)
- Source: Google Fonts
- Weights: 400 (regular), 700 (bold)
- Fallback: `'Space Mono', 'Courier New', monospace`

**Import code:**
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

**CSS:**
```css
font-family: 'Space Mono', 'Courier New', monospace;
```

### Type Scale

**Logo/Site Title**
- Font size: 32px (2rem)
- Weight: 700 (bold)
- Color: #000000 (black)
- Letter spacing: 2px
- Text transform: None

**Headings (H1)**
- Font size: 24px (1.5rem)
- Weight: 700 (bold)
- Color: #000000 (black)
- Letter spacing: 1px

**Headings (H2)**
- Font size: 18px (1.125rem)
- Weight: 700 (bold)
- Color: #000000 (black)
- Letter spacing: 0.5px

**Headings (H3)**
- Font size: 16px (1rem)
- Weight: 700 (bold)
- Color: #000000 (black)

**Body Text**
- Font size: 14px (0.875rem)
- Weight: 400 (regular)
- Color: #000000 (black)
- Line height: 1.6

**Small Text / Meta Information**
- Font size: 13px (0.8125rem)
- Weight: 400 (regular)
- Color: #000000 (black)
- Line height: 1.5

**Tiny Text / Labels**
- Font size: 12px (0.75rem)
- Weight: 400 (regular)
- Color: #666666 (dark grey)

### Special Typography Elements

**Links**
- Default color: #1E90FF (blue)
- Hover color: #FF1493 (electric pink)
- Text decoration: none
- Font weight: inherit

**Tags / Filter Buttons**
- Font size: 13px
- Weight: 400 (regular)
- Letter spacing: 0.5px
- Text transform: lowercase

**Section Labels**
- Font size: 14px
- Weight: 400 (regular)
- Text transform: uppercase
- Letter spacing: 1px

### Typography Usage Notes

- Use Space Mono for all text on the site
- Keep letter spacing tight for readability in monospace
- Avoid using italic style—monospace italics are hard to read
- Use bold (700) sparingly—only for headings and emphasis
- Maintain consistent line height (1.6) for body text
- Interactive elements use electric pink (#FF1493) for active/selected states

---

## Component Styling

### Filter Buttons

**Default State:**
- Background: #FFFFFF (white)
- Border: 1px solid #000000 (black)
- Text color: #000000 (black)
- Padding: 8px 16px
- Font size: 13px
- Border radius: 0 (hard edges)
- Text transform: lowercase
- Letter spacing: 0.5px

**Hover State:**
- Background: #FFFFFF (white)
- Border: 2px solid #FF4500 (deep orange)
- Text color: #000000 (black)

**Active/Selected State:**
- Background: #FF1493 (electric pink) or #FF4500 (deep orange)
- Border: 2px solid #FF1493 (electric pink) or #FF4500 (deep orange)
- Text color: #FFFFFF (white)

**Layout:**
- Use flexbox with wrap enabled
- Horizontal gap: 8px
- Vertical gap: 8px
- Support multiple rows as needed

**Clear All Button:**
- Same styling as default state
- Optional: subtle visual differentiation (e.g., uppercase text)

### Map Styling

**Tile Provider:**
- Stamen Toner or Stamen Toner Lite (for high-contrast black roads/water)
- Alternative: CartoDB Positron (currently used, minimal and clean)

**Tile URLs:**
```
Stamen Toner: https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.png
Stamen Toner Lite: https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}.png
CartoDB Positron: https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png
```

**Map Container:**
- Border: 1px solid #000000 (black)
- Background: #F5F5DC (beige/cream)

**Markers:**
- Default color: #FF1493 (electric pink)
- Hover color: #FF4500 (deep orange)
- Shape: Simple pin or circle
- Icon: Custom SVG or font icon if needed

**Popups:**
- Background: #000000 (black) or dark grey (#333333)
- Text color: #FFFFFF (white)
- Border: 2-3px solid #FF1493 (electric pink) or #FF4500 (deep orange)
- Border radius: 0 (hard edges)
- Drop shadow: 4px 4px 0px rgba(0,0,0,0.3) for "stacked window" effect
- Padding: 12px 16px
- Font: Space Mono, 13px

**Popup Close Button:**
- Color: #FFFFFF (white)
- Hover: #FF1493 (electric pink)

### Restaurant Cards/List Items

**Card Container:**
- Background: #FFFFFF (white)
- Border: 1px solid #000000 (black)
- Border radius: 0 (hard edges)
- Padding: 16px
- Margin bottom: 12px

**Hover State:**
- Border: 2px solid #FF1493 (electric pink) or #FF4500 (deep orange)

**Card Content:**
- Restaurant name: 16px, bold (700), black
- Neighborhood: 13px, regular (400), black
- Tags: 12px, regular (400), dark grey, separated by " · "
- Price: 13px, regular (400), black

### Tables

**Table Container:**
- Border: 1px solid #000000 (black)
- Background: #FFFFFF (white)

**Table Headers:**
- Background: #F5F5DC (beige/cream)
- Border bottom: 1px solid #000000 (black)
- Font size: 13px
- Font weight: 700 (bold)
- Padding: 12px
- Text transform: uppercase
- Letter spacing: 1px

**Table Rows:**
- Border bottom: 1px solid #000000 (black)
- Padding: 12px
- Font size: 13px

**Hover State:**
- Background: #F5F5DC (beige/cream)

### Dividers

**Horizontal Rules:**
- Border: 1px solid #000000 (black)
- Margin: 20px 0

### Containers/Sections

**Main Container:**
- Background: #F5F5DC (beige/cream)
- Max width: 1200px
- Padding: 40px 20px

**Content Sections:**
- Background: #FFFFFF (white) or transparent
- Border: 1px solid #000000 (black) (optional, for emphasis)
- Padding: 20px
- Margin bottom: 20px

---

## Layout Principles

### Grid System

- Use "over-engineered" grids where every piece of information is encased in thin-bordered boxes
- Favor density and technical precision over whitespace
- All borders: 1px solid #000000 (black)
- No rounded corners anywhere

### Navigation

- Stacked index tabs or layered windows
- Hard edges with 90-degree angles
- Sharp-edged shadows for depth (e.g., `box-shadow: 4px 4px 0px rgba(0,0,0,0.2)`)

### Spacing

- Use consistent spacing units: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px
- Tight spacing for technical feel, but maintain readability

---

## Accessibility

- Minimum font size: 12px
- Body text minimum: 14px for comfortable reading
- High contrast: black text on beige background (WCAG AA compliant)
- Links: blue (#1E90FF) provides sufficient contrast against beige
- Interactive elements have clear hover/active states
- Never use light grey text on light backgrounds

---

## Technical Implementation Notes

### CSS Variables (Optional)

```css
:root {
  --color-pink: #FF1493;
  --color-orange: #FF4500;
  --color-black: #000000;
  --color-beige: #F5F5DC;
  --color-white: #FFFFFF;
  --color-blue: #1E90FF;
  --color-grey: #666666;
  
  --font-mono: 'Space Mono', 'Courier New', monospace;
  
  --border-thin: 1px solid var(--color-black);
  --border-thick: 2px solid var(--color-black);
}
```

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive (test on iOS and Android)
- Monospace fonts render consistently across platforms

---

## Future Considerations

- Tag system extensibility (easily add new filter categories)
- Pagination design for large lists
- Loading states and animations (keep minimal and functional)
- Error states (use playful but clear messaging)
- Print styles (if needed)

---

**Last updated:** January 21, 2026
