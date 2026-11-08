# CPH Food Files – Complete UI Style Guide

## Design Direction

**Concept:** Playful OS Terminal  
**Inspiration:** 1990s desktop operating systems, STRP Biennial (technical grids), VPRO Jeugd (vibrant palette)  
**Core principles:**
- Scandinavian minimalism with "spikey" personality
- Monospace typography throughout
- Thin-bordered grids and hard edges (no rounded corners)
- High-contrast fluorescent accents on a bright white background
- Technical, dense layouts that feel like sophisticated software

---

## Color Palette

### Primary Colors

**Electric Pink**
- Hex: `#FF1493`
- RGB: `(255, 20, 147)`
- Usage: FOOD filter button (white text) and the base of the FOOD tag colour family (violet to pink)

**Deep Orange**
- Hex: `#FF4500`
- RGB: `(255, 69, 0)`
- Usage: Hover and active accent (replaced pink for this so it does not clash with FOOD), link hover, popup borders

**Black**
- Hex: `#000000`
- RGB: `(0, 0, 0)`
- Usage: Text, borders, card outlines, dividers (1px)

**White**
- Hex: `#FFFFFF`
- RGB: `(255, 255, 255)`
- Usage: Page background, cards, popovers

**Light Grey**
- Hex: `#F2F2F2`
- RGB: `(242, 242, 242)`
- Usage: Table row hover, map placeholder background

### Accent Colors

**Gold**
- Hex: `#FFD700`
- RGB: `(255, 215, 0)`
- Usage: All map pins and clusters

**Dark Purple**
- Hex: `#2E1A6B`
- RGB: `(46, 26, 107)`
- Usage: MOOD filter button (white text)

**Orange**
- Hex: `#FF8A00`
- RGB: `(255, 138, 0)`
- Usage: HOOD filter button (black text)

**Sky Blue**
- Hex: `#00B3E1`
- RGB: `(0, 179, 225)`
- Usage: Signup "Send" button

**Blue**
- Hex: `#1E90FF`
- RGB: `(30, 144, 255)`
- Usage: Default link color

**Dark Grey**
- Hex: `#666666`
- RGB: `(102, 102, 102)`
- Usage: Secondary text, labels

**White**
- Hex: `#FFFFFF`
- RGB: `(255, 255, 255)`
- Usage: Card backgrounds, popup text on dark backgrounds

### Tag Colours

Every filter tag has its own colour, inside a family per category. The values live in `src/lib/tagColours.ts`.

| Category | Family | Examples |
|----------|--------|----------|
| FOOD | Violet to pink | coffee `#8047DD`, new nordic `#FF1493`, danish `#FF366B`, for thought `#B0B0B0` (grey) |
| MOOD | Cyan to blue to indigo | restaurant `#00C7C7`, cafe `#0078B8`, shop `#3C35CB`, hotel `#96A7FF` |
| HOOD | Orange to yellow | sydhavn `#F55600`, amager `#FE9E0E`, østerbro `#FFBE2B`, frederiksberg `#FFF8B6` |

- Tags are shown as chips with a 1px black outline, lowercase text, and the same colours in the table and in the filter dropdowns. Selected dropdown items get a thicker black outline.
- Chip text is black or white, whichever has the higher contrast on the chip colour.
- A tag without an assigned colour falls back to its category colour (FOOD pink, MOOD dark purple, HOOD orange). Add the new tag to `src/lib/tagColours.ts` and pick a colour that stays clearly different from its neighbours in the family.
- Keep MOOD clearly apart from the FOOD violets. Avoid murky brown and olive tones in all families.

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
- Hover color: #FF4500 (deep orange)
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
- Interactive elements use deep orange (#FF4500) for hover and active accents

---

## Component Styling

### Filter Buttons

**Default State:**
- Background: the category colour: FOOD #FF1493 (white text), MOOD #2E1A6B (white text), HOOD #FF8A00 (black text)
- Border: 1px solid #000000 (black), the same outline as the tag chips
- Padding: 8px 16px
- Font size: 13px
- Border radius: 0 (hard edges)
- Text transform: lowercase
- Letter spacing: 0.5px

**Hover / Focus State:**
- Background: #FFFFFF (white)
- Border: 1px solid #000000 (black)
- Text color: #000000 (black)

**Active/Selected State (a filter is applied):**
- Background: #FFFFFF (white)
- Border: 1px solid #000000 (black)
- Text color: #000000 (black)

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
- Background: #F2F2F2 (light grey, visible while tiles load)
- Tiles are shown in greyscale with slightly raised contrast, so the gold pins stand out

**Markers:**
- Default color: #FFD700 (gold), including clusters
- Selected and hovered: black outline and slightly larger
- Shape: Simple circle

**Popups:**
- Background: #000000 (black) or dark grey (#333333)
- Text color: #FFFFFF (white)
- Border: 2-3px solid #FF4500 (deep orange)
- Border radius: 0 (hard edges)
- Drop shadow: 4px 4px 0px rgba(0,0,0,0.3) for "stacked window" effect
- Padding: 12px 16px
- Font: Space Mono, 13px

**Popup Close Button:**
- Color: #FFFFFF (white)
- Hover: #FF4500 (deep orange)

### Restaurant Cards/List Items

**Card Container:**
- Background: #FFFFFF (white)
- Border: 1px solid #000000 (black)
- Border radius: 0 (hard edges)
- Padding: 16px
- Margin bottom: 12px

**Hover State:**
- Border: 2px solid #FF4500 (deep orange)

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
- Background: #FFFFFF (white)
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

**Tag cells:**
- Food, mood and neighbourhood values are tag chips in their own colours (see Tag Colours)

**Hover State:**
- Background: #F2F2F2 (light grey)

### Dividers

**Horizontal Rules:**
- Border: 1px solid #000000 (black)
- Margin: 20px 0

### Containers/Sections

**Main Container:**
- Background: #FFFFFF (white)
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
- High contrast: black text on white background (WCAG AA compliant)
- Links: blue (#1E90FF) on white
- White text on FOOD pink is about 3.6:1, below the 4.5:1 AA target for small text. Kept by design choice; chip text elsewhere switches between black and white for best contrast
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
  --color-grey-light: #F2F2F2;
  --color-gold: #FFD700;
  --color-purple: #2E1A6B;
  --color-hood-orange: #FF8A00;
  --color-sky: #00B3E1;
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

## Design Principles & Scalability Considerations

### Density versus Legibility

**Current approach:** The technical, dense layouts with minimal whitespace create a distinctive, sophisticated feel that aligns with the "playful OS terminal" concept.

**Scaling considerations:**
- **Whitespace review:** When the site scales to hundreds of restaurants, places, or tags, revisit spacing to prevent overwhelming users
- **Test threshold:** Monitor user feedback and analytics at key milestones (50 places, 100 places, 200+ places)
- **Breathing room:** Consider adding subtle spacing increments (e.g., 4px → 6px gaps) in high-density areas without losing the technical aesthetic
- **Hard edges:** The "no rounded corners ever" rule creates strong brand identity, but test with real users over time for visual fatigue
- **Balance point:** Dense is good; claustrophobic is not. The goal is "sophisticated software," not "overwhelming spreadsheet"

### Brand Playfulness versus Usability

**Personality:** The "spikey" personality through sharp edges, fluorescent accents, and monospace typography creates memorable brand differentiation.

**Non-negotiable usability rules:**
- **Functionality first:** When there's tension between aesthetics and usability, functionality always wins
- **Navigation clarity:** Navigation elements must be immediately recognizable—avoid overly subtle or cryptic patterns
- **Clickable affordances:** Interactive elements (buttons, links, filters) must have clear visual affordances:
  - Sufficient contrast between states (default/hover/active)
  - Minimum touch target size: 44×44px for mobile
  - Clear hover states that appear within 100ms
- **Readability:** Monospace can reduce reading speed—compensate with:
  - Adequate line height (1.6 for body text)
  - Sufficient font size (14px minimum for body)
  - High contrast ratios (black on white meets WCAG AA)
- **Information hierarchy:** Use weight, size, and spacing to guide users—not just color

### Responsive Design & Mobile Considerations

**Desktop-first concern:** The "grid everywhere" approach works beautifully on large screens but can struggle on mobile devices.

**Mobile-critical principles:**
- **One-handed operation:** Core flows (filtering, browsing, map usage) must work comfortably one-handed on phones
- **Simplified mobile layouts:**
  - Collapse multi-column grids to single column on screens <768px
  - Stack filter buttons in fewer rows (2-3 max visible, with scroll or collapse)
  - Reduce map height on mobile to preserve list visibility (50/50 or 40/60 split)
- **Touch-friendly spacing:**
  - Increase filter button padding on mobile: 12px 20px (vs 8px 16px on desktop)
  - Add more vertical gap between interactive elements: 12px minimum
  - Ensure tap targets don't overlap or sit too close (<8px gap)
- **Performance:**
  - Lazy-load map tiles on mobile
  - Consider pagination or infinite scroll for 50+ results on small screens
  - Minimize DOM complexity in mobile grids
- **Core mobile flows:**
  1. Quick filter selection (dietary, neighborhood, cuisine)
  2. Browse list with key info visible (name, tags, neighborhood)
  3. View on map
  4. Get details (full card or detail page)

**Breakpoints:**
- Mobile: <768px
- Tablet: 768px–1024px
- Desktop: >1024px

### Tag & Filter Scalability

**Current state:** Filter buttons use flexbox with wrap, supporting multiple rows. Future considerations mention "tag system extensibility."

**Scalability design requirements:**

**Visual overflow handling:**
- **Horizontal wrapping:** Already supported—ensure it remains clean with 5+ rows of tags
- **Category grouping:** As filter categories grow, group them visually:
  ```
  Cuisine: [tag] [tag] [tag]...
  Dietary: [tag] [tag]...
  Neighborhood: [tag] [tag] [tag] [tag]...
  ```
- **Collapse/expand sections:** For 10+ categories, allow users to collapse groups they don't need
- **Grid stability:** Long tag names or many active filters shouldn't break the grid—test with:
  - Very long tag names (15+ characters)
  - 20+ active filters simultaneously
  - Rapid selection/deselection

**Future filtering features:**
- **Multi-select behavior:** Already implied by current design—maintain this
- **Tag relationships:** Some filters are mutually exclusive (e.g., "vegetarian" + "steakhouse")—design for conflicts:
  - Show count of matching results per tag
  - Disable/grey out incompatible tags when selection results in zero matches
  - Or allow selection but show "0 results" message
- **Search/autocomplete:** When tags exceed 50-75 total, add a search box to filter the filters
- **Saved filter sets:** Power users may want to save combinations ("Vegetarian ramen in Nørrebro")
- **URL state:** Filters should be URL-encodable for sharing ("?cuisine=ramen&diet=vegan&hood=norrebro")

**Performance:**
- Test filter performance with:
  - 500+ restaurants
  - 50+ total filter tags
  - 10+ simultaneous active filters
- Optimize filtering algorithm—should feel instant (<100ms)

**Visual stress testing:**
- Add 10 more cuisine types—does the grid still look intentional?
- Add 5 new dietary filters—do rows become overwhelming?
- What happens with 8 active filters—do they dominate the UI?

---

## Future Considerations

- Loading states and animations (keep minimal and functional)
- Error states (use playful but clear messaging)
- Print styles (if needed)
- Dark mode variant (optional—may enhance the "terminal" aesthetic)
- Advanced filtering (price range, rating, distance from location)

---

**Last updated:** November 8, 2026
