# Design System Specification: Forge Logic Light

## 1. Overview & Creative North Star

The Creative North Star for this design system is **"Forge Logic Light."** It is a high-contrast, modern interface that uses pure red (#FF0000) as the primary action and brand color, supported by a neutral palette of blacks, grays, and whites. The system emphasizes clarity, precision, and a bold visual hierarchy. A dotted grid background reinforces the snap-to-grid functionality and creates a structured, technical foundation.

## 2. Colors & Surface Logic

### Primary Palette

| Role | Hex | Usage |
|------|-----|-------|
| **Primary** | `#FF0000` | Primary CTAs, active states, key actions, accent bars |
| **Secondary** | `#000000` | Headlines, high-contrast text, inverted surfaces |
| **Tertiary** | `#424242` | Charcoal gray for secondary UI, icon buttons |
| **Neutral** | `#FFFFFF` | Base surfaces, cards, light backgrounds |

### Gradient Scales

Each primary color extends into a 10-step gradient scale for depth and variation:

- **Primary scale:** Deep maroon → vibrant red → light pinkish-white
- **Secondary scale:** Black → grays → light off-white
- **Tertiary scale:** Dark charcoal → mid grays → light gray
- **Neutral scale:** Black → white transition

### Surface Hierarchy

- **Base Layer:** Light gray background with dotted grid pattern
- **Cards & Panels:** Pure white (`#FFFFFF`) with rounded corners
- **Interactive Hover:** Subtle gray (`#f3f3f3`) for hover states
- **Inset/Form Wells:** Light gray (`#e8e8e8`) for inputs and wells

## 3. Typography

The system uses a clean, sans-serif typeface across three levels:

| Level | Usage | Weight | Color |
|-------|-------|--------|-------|
| **Headline** | Section titles, big moments | Bold | Black (`#000000`) |
| **Body** | Main content, descriptions | Regular | Dark warm gray |
| **Label** | Metadata, technical specs, placeholders | Regular | Dark warm gray |

- **Line height:** Generous (1.5–1.6) for readability
- **Letter spacing:** Slightly tight on headlines (-0.02em) for a technical feel

## 4. Components

### Buttons

| Variant | Background | Text | Border | Use Case |
|---------|------------|------|-------|----------|
| **Primary** | Red (`#FF0000`) | White | None | Main CTAs, AI Generate, Present |
| **Secondary** | Light gray | Dark text | None | Secondary actions |
| **Inverted** | Dark charcoal (`#424242`) | White | None | Alternate emphasis |
| **Outlined** | White | Dark text | 1px red | Tertiary, low-emphasis actions |

- **Corner radius:** Moderate, consistent (e.g. `0.5rem` / 8px)
- **Padding:** Comfortable tap targets for touch and pointer

### Input Fields

- **Background:** Light gray (`#f5f5f5`)
- **Border:** Thin red (`#FF0000`) on focus; subtle gray default
- **Placeholder:** "Search" or contextual hint text
- **Icons:** Magnifying glass or relevant icon inline

### Navigation / Tab Bar

- **Container:** Rounded horizontal bar, light gray or white
- **Active item:** Red square icon with white symbol (e.g. home)
- **Inactive items:** Dark gray icons
- **Layout:** Icon-only or icon + label

### Icon Buttons

- **Primary action:** Red background, white icon (e.g. magic wand, trash)
- **Secondary action:** Dark gray background, white icon (e.g. shapes, price tag)
- **Shape:** Square with consistent padding and corner radius

### Label Button (Icon + Text)

- **Style:** Red background, white icon + white label text
- **Example:** Pencil icon + "Label"

### Progress / Decorative Bars

- **Primary bar:** Red horizontal strip (2–4px height)
- **Secondary bars:** Dark gray, varying lengths for visual rhythm

## 5. Layout & Grid

### Dotted Grid Background

- **Pattern:** Fine white dots on dark background for contrast, or dark dots on light background for canvas
- **Purpose:** Aligns with snap-to-grid; reinforces structured, technical aesthetic
- **Usage:** Canvas area, freeform editor background

### Corner Radius

- **Cards, buttons, inputs:** Moderately rounded (`0.5rem`–`0.75rem`)
- **Modals, dropdowns:** Larger radius (`0.75rem`–`1rem`)

## 6. Elevation & Depth

- **Shadows:** Reserved for floating elements (modals, dropdowns, tooltips)
- **Value:** `0px 4px 12px rgba(0, 0, 0, 0.08)` — light, ambient
- **Layering:** Use background color shifts rather than heavy borders for sectioning

## 7. Do's and Don'ts

### Do

- **Do** use red for primary actions and success/active states
- **Do** maintain high contrast between text and backgrounds
- **Do** use the dotted grid where snap-to-grid is relevant
- **Do** keep corner radii consistent across components
- **Do** use dark gray for secondary iconography and tertiary actions

### Don't

- **Don't** overuse red; reserve it for key actions
- **Don't** use low-contrast grays for critical text
- **Don't** mix inconsistent corner radii
- **Don't** add heavy borders; prefer background shifts and subtle outlines
