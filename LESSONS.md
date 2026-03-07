# Cards of Answers — Lessons Learned

## Phase 1: Marquee Card Animation (Mar 6 evening)

### CSS offset-path is powerful but fragile
- Replaced manual JS `getPointAtLength` + `atan2` with CSS `offset-path` + `offset-distance` + `offset-rotate: auto` — much smoother.
- **Gotcha:** Setting `offset-path` every frame causes jitter. Set it once, only update `offset-distance` per frame.
- **Gotcha:** Even updating `offset-distance` via JS rAF janks on some devices. Solution: **Web Animations API** — compositor-driven, zero JS per frame.

### SVG path smoothing matters
- Line segment paths (`L` commands) cause visible angle jumps at vertices — cards snap between directions.
- Fix: convert Catmull-Rom splines to cubic bezier curves for smooth tangent interpolation.

### Temporal Dead Zone (TDZ) bites in complex init
- `let config = getConfig()` before `let currentPath = 'curly'` → crash because `getConfig()` references `currentPath`.
- Lesson: in files with interdependent state, defer initialization. Use `let config = null` and populate in an init function.

### Card count per path should vary
- Different paths have different visible portions. A wave with a hidden return section needs 50% more cards than a loop to avoid looking sparse.
- `switchPath()` must rebuild cards when count changes.

### Theme iteration is fast, decisions are slow
- Went through 5+ full re-themes in one session: navy+magenta → lime → cream+charcoal → dark+cream (final).
- Lesson: don't overthink palettes. Ship one, see how it feels, iterate. The final "bird palette" (#141414 bg, #f0ebe0 cream, #e8641e orange) emerged from rapid cycling.

### Path experimentation log
- **Curly:** Started as asymmetric figure-8, evolved to proper horizontal lemniscate ♾️.
- **Wave:** Evolved from closed loop → open infinite path with offscreen entry/exit. Gentler amplitude (8% vs 15%) reads better.
- **Loop:** Tried circle, lollipop, Codrops-style self-crossing, 3 parallel rows, ultimately settled on Codrops reference path.
- Lesson: reference implementations (Codrops) save hours vs. inventing from scratch.

### Card rotation approaches (tried 3, settled on offset-rotate)
1. **Tangent-based:** Sample path at ±offset, compute atan2. Noisy at vertices.
2. **Center-based:** Angle from card to path center. Looks wrong on non-circular paths.
3. **CSS offset-rotate: auto:** Native, smooth, zero-cost. Clear winner.

### Hover interaction: slow the whole track, not just one card
- Desktop hover: slow *all* animations to 15% playbackRate via Web Animations API.
- Initially tried slowing individual cards — looked broken when one card freezes and others pass it.

### Card front/back symbol architecture
- Front symbol and back symbol are independent elements. Front symbol sits above category text in its own `.card-front-symbol`.
- `z-index: 2` on `.card-front` prevents the back symbol from bleeding through during flip.
- Tried several layouts (overlapping, upper area percentage) before settling on dedicated front element.

### Dynamic z-index for crossing paths
- For self-crossing paths (loop, curly), z-index based on screen Y position creates natural overlap.
- Removed once we switched to ellipse (no crossings).

### Card back design: alternate colors add depth
- ♠♣ cards get orange backs, ♥♦ get cream — breaks up the ring visually.

## Phase 2: 3D Deck & Orbit (Mar 7 early morning)

### Orbit > Fan > Static spread
- Fan spread felt dead. Orbiting elliptical ring feels alive and ritualistic.
- Slow rotation (0.12 rad/s) gives a meditative quality.

### Even angular spacing wins
- Tried sinusoidal bunching (cluster at front/back) — user rejected both attempts.
- Pure uniform `i * 2π / N` distribution looks best. Trust the math.

### Full perspective scale range (0.75–1.0) is worth it
- Tried flattening the range for "more even" look — user explicitly preferred deeper perspective.
- The depth realism is worth the size variation.

### Mobile ellipse should bleed past viewport
- `rx = width * 0.62` on mobile — cards enter/exit from edges. Creates infinite feel.
- Don't try to fit everything on screen; let it breathe.

## Phase 3: Pick Card Overlay (Mar 7 morning)

### Stacking contexts are invisible traps
- `position: fixed` + `z-index` on a parent creates a stacking context that **traps all children** — they can never appear above siblings of the parent, regardless of their own z-index.
- Fix: reparent the element to `<body>` to escape the stacking context.
- This cost 3+ rounds of debugging. **Always check parent stacking contexts when z-index doesn't work.**

### `backdrop-filter: blur()` is a trap for modals
- Even if an element is above the overlay in z-order, `backdrop-filter` captures the composite of everything below at render time.
- You literally cannot have a crisp element above a `backdrop-filter` overlay if they share visual space.
- Fix: use opaque/semi-transparent `background` instead and `visibility: hidden` the underlying interactive layer.

### The overlay pattern that actually works
1. Semi-transparent overlay (`rgba`, ~0.8 opacity) — lets ambient effects (snow) show through
2. `visibility: hidden` on the interactive layer (card stage) — no bleed-through
3. Picked card reparented to `<body>` above overlay z-index
4. Click overlay or Esc to dismiss

### Glow/box-shadow creates fake "cutout" look
- `box-shadow: 0 0 60px rgba(...)` on the card illuminates the semi-transparent overlay around it, making it look like the overlay has a hole.
- On solid dark backgrounds it looks fine. On semi-transparent overlays, it's ugly. Removed it.

### FLIP technique for reparenting animations
- `appendChild` to a new parent resets visual position — card jumps.
- Fix: capture `getBoundingClientRect()` before reparenting, set `transition: none` + captured position immediately after, then `requestAnimationFrame` to animate to target.
- This is standard FLIP (First, Last, Invert, Play).

### Residual styles persist across reparenting
- Orbit cards carry `filter` (drop-shadow) and computed styles from the animation loop.
- When picked and reparented, these persist → card looks dimmed even though it's above the overlay.
- Fix: explicitly clear (`filter: none`, `opacity: 1`) and use `!important` in CSS class as safety net.
- On put-back: reset ALL modified styles (`width`, `height`, `filter`, `left`, `top`, `zoom`, `position`).

### `transform: scale()` makes text fuzzy
- CSS `scale()` rasterizes at original pixel size, then stretches the bitmap.
- Fix: animate with `scale()` for smooth motion, then swap to CSS `zoom` after animation completes (650ms). `zoom` triggers native re-rasterization.
- Alternative: resize actual `width`/`height`, but requires all inner content to use relative units.

### Responsive card scaling formula
- Bad: `width * 0.35` — gives tiny cards on mobile.
- Good: `Math.min(80vw / cardW, 70vh / cardH, 2.5)` — fills the viewport properly on any device.

### Small details that elevate the experience
- **Random tilt** (-6° to +6°) on each pick — every draw feels different.
- **Font:** Goudy Bookletter 1911 gives a timeless, oracle quality.
- **No italic on quotes** — serif + italic is redundant; upright reads more authoritative.
- **No card numbers** — removes clutter, focuses attention on the message.

## Process Lessons

### Always verify visually before shipping
- **Saber's rule:** Screenshot and check the result before telling him it's done.
- Blind pushes cost 3+ rounds on the overlay alone. One screenshot would have caught the stacking context issue immediately.
- CSS stacking bugs are invisible in code review.

### Iterative > big-bang
- Surgical commits, one concern each. Made debugging straightforward.
- Overlay fix path: z-index bump → remove stacking context → reparent → swap backdrop-filter → adjust opacity → hide orbit. Each step informed by the last.

### When something doesn't work after 2 tries, step back and rethink
- Three z-index attempts couldn't fix the overlay because the mental model was wrong (z-index war vs. stacking context escape).
- The reparenting solution was architecturally different, not just a bigger number.

### GitHub Pages cache adds friction
- Changes may not appear immediately. Use `?v=N` query params to bust cache during development.
- Computed styles can show stale CSS even after git push if deploy hasn't completed.
