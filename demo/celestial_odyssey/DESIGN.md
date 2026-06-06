---
name: Celestial Odyssey
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#37393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#bac9cc'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#849396'
  outline-variant: '#3b494c'
  surface-tint: '#00daf3'
  primary: '#c3f5ff'
  on-primary: '#00363d'
  primary-container: '#00e5ff'
  on-primary-container: '#00626e'
  inverse-primary: '#006875'
  secondary: '#ebb2ff'
  on-secondary: '#520071'
  secondary-container: '#721199'
  on-secondary-container: '#e299ff'
  tertiary: '#efebf3'
  on-tertiary: '#303035'
  tertiary-container: '#d2cfd6'
  on-tertiary-container: '#59585e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9cf0ff'
  primary-fixed-dim: '#00daf3'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004f58'
  secondary-fixed: '#f8d8ff'
  secondary-fixed-dim: '#ebb2ff'
  on-secondary-fixed: '#320047'
  on-secondary-fixed-variant: '#721199'
  tertiary-fixed: '#e4e1e9'
  tertiary-fixed-dim: '#c8c5cd'
  on-tertiary-fixed: '#1b1b20'
  on-tertiary-fixed-variant: '#47464c'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  stats-number:
    fontFamily: Sora
    fontSize: 20px
    fontWeight: '300'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 24px
  stack-sm: 12px
  stack-md: 20px
  stack-lg: 40px
  gutter: 16px
---

## Brand & Style

This design system captures the awe and vastness of interstellar travel. The brand personality is **Visionary, Infinite, and Introspective**, designed to make the act of journaling feel like a mission log from the edge of the universe. The target audience includes dreamers, tech-enthusiasts, and individuals seeking a profound, meditative space for self-reflection.

The aesthetic leans heavily into **Glassmorphism** and **Futuristic Minimalism**. Surfaces should feel like advanced holographic interfaces floating against the void. We use deep background blurs (30px-40px) to simulate the diffusion of light through nebulae. Every interaction should evoke a sense of high-tech precision and cosmic serenity.

## Colors

The palette is rooted in the **Deep Space Dark Mode**. The core background (`#0D0D12`) is not a pure black, but a "rich black" with a subtle navy undertone to maintain depth.

- **Electric Blue (#00E5FF):** Used for primary actions, progress indicators, and "active" states. It represents the glow of an ion engine.
- **Cosmic Purple (#7B1FA2):** Used for secondary accents, category tags, and decorative gradients. It represents distant nebulae.
- **Glass Stroke:** A semi-transparent white (`rgba(255, 255, 255, 0.12)`) is used for the hair-line borders of cards.
- **Glow FX:** Accents should utilize an outer glow (drop-shadow) using the primary color with low opacity (20-30%) to simulate light emission.

## Typography

The typography strategy blends high-tech utility with modern elegance. **Sora** provides a geometric, futuristic feel for headings. **Inter** ensures maximum legibility for long-form journal entries. **Space Mono** is used sparingly for metadata (dates, coordinates, "Mission Logs") to reinforce the technical, "instrument panel" aesthetic.

For all "Display" and "Label-caps" styles, use slight letter-spacing adjustments to enhance the "interface" feel. Headlines should occasionally use a linear gradient from white to a soft silver to mimic metallic reflection.

## Layout & Spacing

This design system utilizes a **Fluid Grid** with generous safe areas to allow background "Starfields" to breathe. 

- **Margins:** A consistent 24px horizontal margin on mobile devices ensures content doesn't feel cramped against the screen edges.
- **Orbital Layouts:** For specific dashboard views, use a "No Grid" approach where elements are positioned along elliptical paths (orbital paths) to create a sense of movement.
- **Vertical Rhythm:** Use a 4px baseline grid, but group components with "Stack" variables (20px or 40px) to maintain a spacious, premium feel.

## Elevation & Depth

Hierarchy is established through **Luminance and Transparency** rather than traditional shadows.

1.  **Level 0 (The Void):** The background layer containing the starfield or planet textures.
2.  **Level 1 (Glass Sheets):** Semi-transparent cards (`rgba(255, 255, 255, 0.04)`) with a 40px backdrop-blur. These feature a 1px solid border.
3.  **Level 2 (Active Focus):** Cards or modals that sit higher. These have a slightly higher opacity (`0.08`) and a subtle `00E5FF` outer glow.
4.  **Level 3 (Interactive Elements):** Buttons and toggles that appear to emit light, casting a soft colored bloom onto the layers beneath them.

## Shapes

The shape language is defined by **Precision Curves**. We avoid the extreme "squishy" look of pill shapes for containers to keep the design feeling technical and architectural. 

- **Standard Cards:** 16px (rounded-lg) corner radius.
- **Interactive Triggers:** 12px corner radius for buttons.
- **Data Visuals:** Circles and elliptical paths are used for progress tracking, representing planetary orbits.

## Components

### Buttons
- **Primary:** Gradient fill (Electric Blue to Cyan), white text, 8px outer glow.
- **Ghost:** 1px border (`#00E5FF`), no fill, used for secondary "Log" actions.

### Cards (The "Glass" Container)
Cards must have a `backdrop-filter: blur(24px)` and a thin `1px` border at `12%` white opacity. Inside, use a top-down linear gradient (White at 5% to Transparent).

### Inputs
Input fields are "Underlined" styles or "Ghost" boxes. The cursor and focus state should always be the Electric Blue glow.

### Chips / Tags
Small, pill-shaped elements with a `Space Mono` font. Used for "Mood" (e.g., "STARDUST", "NEBULA", "VOID").

### Orbital Progress
Instead of linear progress bars, use circular strokes that represent "Distance Traveled" or "Entry Consistency."

### Navigation
A floating bottom dock with glassmorphism, using iconography that features thin, 1.5pt strokes and glowing active states.