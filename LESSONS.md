# Cards of Answers — Lessons Learned

## CSS Stacking & Overlays

### Stacking contexts are invisible traps
- `position: fixed` + `z-index` on a parent creates a stacking context that **traps all children** — no matter how high their z-index, they can never appear above siblings of the parent.
- Fix: reparent the element to `<body>` to escape the stacking context.
- Lesson: when an overlay needs to sit between siblings and their children, the architecture matters more than z-index numbers.

### `backdrop-filter: blur()` blurs everything behind it — including reparented siblings
- Even if an element is above the overlay in z-order, `backdrop-filter` captures the composite of everything below it at render time.
- If you need an element to appear **crisp** above a blur overlay, you can't use `backdrop-filter`. Use an opaque/semi-transparent `background` instead and hide what you don't want visible.

### Overlay opacity matters for perceived quality
- Semi-transparent overlays that let orbit cards bleed through look messy — like a cutout.
- Solution: either go fully opaque, or hide the underlying elements (`visibility: hidden`) and let only the ambient background (snow particles) show through for atmosphere.

## Animation & Rendering

### `transform: scale()` makes text fuzzy
- CSS `scale()` rasterizes the element at its original pixel size, then stretches the bitmap. Text becomes blurry at 2x+.
- Fix: animate with `scale()` for smooth motion, then swap to CSS `zoom` after animation completes. `zoom` triggers native re-rasterization at the target size.
- Alternative: resize the element's actual `width`/`height`, but this requires all inner content (fonts, padding) to use relative units.

### Reparenting breaks animation continuity
- Moving an element to a new parent (`appendChild`) resets its visual position. The element jumps.
- Fix: capture `getBoundingClientRect()` before reparenting, immediately set `transition: none` + the captured position after reparenting, then animate to the target on the next `requestAnimationFrame`.
- This is the FLIP technique (First, Last, Invert, Play).

### Residual styles persist after reparenting
- Orbit cards carry `filter` (drop-shadow) and `opacity` from their orbit state. When picked and reparented, these persist and make the card look dimmed.
- Fix: explicitly clear inherited styles (`filter: none`, `opacity: 1`) when picking. Use `!important` in CSS class as a safety net.
- On put-back, reset all modified styles (`width`, `height`, `filter`, `left`, `top`, `zoom`, `position`).

## Design & Interaction

### The overlay pattern that works
1. Semi-transparent overlay (`rgba` bg, 0.8 opacity) — lets ambient effects (snow) show through
2. Hide the interactive layer (`visibility: hidden` on card stage) — no bleed-through
3. Picked card reparented to `<body>` with z-index above overlay
4. Click overlay to dismiss — intuitive modal pattern

### Small details that elevate the experience
- **Random tilt** (-6° to +6°) on each pick makes every draw feel unique
- **Responsive scaling** (`min(80vw / cardW, 70vh / cardH)`) ensures the card fills the screen properly on any device
- **Font choice matters** — Goudy Bookletter 1911 gives the cards a timeless, oracle-like quality that DM Serif couldn't match

### Mobile-specific lessons
- Cards that look fine on desktop (150×210px) feel tiny on mobile when scaled naively
- Don't use a fixed scale multiplier (`width * 0.35`). Use viewport-relative sizing: fill 80% width, 70% height, pick the smaller.
- Ellipse `rx` should bleed past viewport edges on mobile for immersion

## Process

### Always verify visually before shipping
- **Rule (from Saber):** Screenshot and check the result yourself before telling the user it's done.
- Blind pushes wasted multiple rounds. Browser testing catches issues in one cycle.
- CSS stacking bugs are invisible in code review — only screenshots reveal them.

### Iterative > big-bang
- Each fix was surgical: one concern per commit. This made debugging straightforward.
- When the overlay didn't work, we went through: z-index bump → remove stacking context → reparent element → swap backdrop-filter → adjust opacity → hide orbit → each step informed by the last.

### The stack of this project
- Single `index.html`, no build step, GitHub Pages deploy
- Three.js only for the PixelSnow shader background — everything else is vanilla CSS/JS
- State machine: `deck | shuffling | fanned | picking | returning`
- 24 answer cards, 8 decorative symbols, elliptical orbit with depth-based perspective
