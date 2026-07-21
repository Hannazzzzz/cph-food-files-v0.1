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
- **Hover color:** #FF1493 (electric pink)
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
- **Link hover:** #FF1493 (electric pink)
- **Active/selected state:** #FF1493 (electric pink)

### Background
- **Page background:** #F5F5DC (beige/cream)
- **Card/container background:** #FFFFFF (white) or #F5F5DC (beige/cream)

---

## Usage Notes

- Use Space Mono for **all text** on the site (logo, headings, body, buttons, labels)
- Keep letter spacing tight for readability in monospace
- Avoid using italic style—monospace italics are hard to read
- Use bold (700) sparingly—only for headings and emphasis
- Maintain consistent line height (1.6) for body text
- Links should always be underlined for clarity
- Interactive elements (buttons, filters) use electric pink (#FF1493) for active/selected states

---

## Accessibility

- Minimum font size: 12px
- Body text minimum: 14px for comfortable reading
- High contrast: black text on beige background (WCAG AA compliant)
- Links: blue provides sufficient contrast against beige
- Never use light grey text on light backgrounds
