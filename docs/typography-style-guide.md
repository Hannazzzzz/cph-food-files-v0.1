# CPH Food Files – Typography Style Guide

## Font Family

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

---

## Type Scale

### Logo/Site Title
- **Font size:** 32px (2rem)
- **Weight:** 700 (bold)
- **Color:** #000000 (black)
- **Letter spacing:** 2px
- **Text transform:** None

### Headings (H1)
- **Font size:** 24px (1.5rem)
- **Weight:** 700 (bold)
- **Color:** #000000 (black)
- **Letter spacing:** 1px

### Headings (H2)
- **Font size:** 18px (1.125rem)
- **Weight:** 700 (bold)
- **Color:** #000000 (black)
- **Letter spacing:** 0.5px

### Headings (H3)
- **Font size:** 16px (1rem)
- **Weight:** 700 (bold)
- **Color:** #000000 (black)

### Body Text
- **Font size:** 14px (0.875rem)
- **Weight:** 400 (regular)
- **Color:** #000000 (black)
- **Line height:** 1.6

### Small Text / Meta Information
- **Font size:** 13px (0.8125rem)
- **Weight:** 400 (regular)
- **Color:** #000000 (black)
- **Line height:** 1.5

### Tiny Text / Labels
- **Font size:** 12px (0.75rem)
- **Weight:** 400 (regular)
- **Color:** #666666 (dark grey)

---

## Special Elements

### Links
- **Default color:** #1E90FF (blue)
- **Hover color:** #FF4500 (deep orange)
- **Text decoration:** underline
- **Font weight:** inherit

### Tags / Filter Buttons
- **Font size:** 13px
- **Weight:** 400 (regular)
- **Letter spacing:** 0.5px
- **Text transform:** lowercase

### Section Labels
- **Font size:** 14px
- **Weight:** 400 (regular)
- **Text transform:** uppercase
- **Letter spacing:** 1px

---

## Color Usage

### Text Colors
- **Primary text:** #000000 (black)
- **Secondary text:** #666666 (dark grey)
- **Link default:** #1E90FF (blue)
- **Link hover:** #FF4500 (deep orange)
- **Active/selected state:** white background with a 1px black outline (filters), deep orange (#FF4500) for hover accents

### Background
- **Page background:** #FFFFFF (white)
- **Card/container background:** #FFFFFF (white) or #F2F2F2 (light grey)

---

## Usage Notes

- Use Space Mono for **all text** on the site (logo, headings, body, buttons, labels)
- Keep letter spacing tight for readability in monospace
- Avoid using italic style—monospace italics are hard to read
- Use bold (700) sparingly—only for headings and emphasis
- Maintain consistent line height (1.6) for body text
- Links should always be underlined for clarity
- Filter buttons use their category colour (FOOD pink, MOOD dark purple, HOOD orange); hover and active accents use deep orange (#FF4500)

---

## Accessibility

- Minimum font size: 12px
- Body text minimum: 14px for comfortable reading
- High contrast: black text on white background (WCAG AA compliant)
- Links: blue provides sufficient contrast against white
- Never use light grey text on light backgrounds
