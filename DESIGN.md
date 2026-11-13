---
name: Cards of Answers
description: A paper stage for one private draw. Plum auditorium, vermilion proscenium, cream apron, violet pleats, gold footlights.
colors:
  vermilion: "#e23b12"
  vermilion-ink: "#8e1e09"
  pleat: "#6436a0"
  pleat-light: "#6d3eae"
  pleat-shadow: "#512884"
  violet-deep: "#4a2278"
  violet-fold: "#7342b4"
  gold: "#f0b429"
  plum: "#241428"
  plum-deep: "#160e1c"
  cavity: "#120914"
  paper: "#f4ecdf"
  ink: "#1c1210"
typography:
  display:
    fontFamily: "Anybody, sans-serif"
    fontSize: "clamp(1.85rem, 4.8vw, 3.35rem)"
    fontWeight: 780
    lineHeight: 0.96
    letterSpacing: "-0.035em"
    fontVariation: "wdth 94"
  headline:
    fontFamily: "Petrona, Georgia, serif"
    fontSize: "clamp(1.45rem, 2.5vw, 2.7rem)"
    fontWeight: 560
    lineHeight: 1.16
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Anybody, sans-serif"
    fontSize: "clamp(1.35rem, 2.5vw, 2.15rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontVariation: "wdth 92"
  body:
    fontFamily: "Petrona, Georgia, serif"
    fontSize: "1.05rem"
    fontWeight: 500
    lineHeight: 1.35
  label:
    fontFamily: "Anybody, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 720
    letterSpacing: "-0.01em"
    fontVariation: "wdth 98"
  control:
    fontFamily: "Anybody, sans-serif"
    fontSize: "0.98rem"
    fontWeight: 680
    letterSpacing: "-0.01em"
    fontVariation: "wdth 98"
rounded:
  card: "12px"
  reading: "16px"
  hold: "18px"
  picture: "10px"
  pill: "999px"
  lamp: "50%"
  arch: "120px 120px 20px 20px / 64px 64px 20px 20px"
  stage: "80px 80px 8px 8px / 36px 36px 8px 8px"
spacing:
  xs: "8px"
  sm: "10px"
  md: "12px"
  lg: "16px"
  xl: "18px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
    height: "44px"
  button-quiet:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
    height: "44px"
  button-today:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
    height: "44px"
  card:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.card}"
    width: "140px"
    height: "196px"
  reading:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.reading}"
    padding: "clamp(16px, 3vw, 40px)"
  apron:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    rounded: "{rounded.card}"
    padding: "16px 18px 12px"
  lamp:
    backgroundColor: transparent
    rounded: "{rounded.lamp}"
    size: "14px"
  lamp-on:
    backgroundColor: "{colors.gold}"
    rounded: "{rounded.lamp}"
    size: "14px"
  theater:
    backgroundColor: "{colors.plum-deep}"
    textColor: "{colors.paper}"
    typography: "{typography.title}"
    rounded: "{rounded.arch}"
    width: "min(1120px, 100%)"
  kept-card:
    backgroundColor: "{colors.plum}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    width: "1080px"
    height: "1440px"
---

# Design System: Cards of Answers

## Overview

**Creative North Star: "The Paper Stage"**

Cards of Answers is one paper toy theater on an otherwise empty field. A vermilion proscenium frames a plum interior, a violet curtain of pleats covers the opening, a cream apron holds the stage directions, and seven gold lamps mark a breath. The wordmark, the deck, and the apron are one object. The person brings a question they never type, presses the closed curtain, and releases when the lamps are lit. The curtain leaves, twenty-four illustrated cards spring into a slow orbit, and the chosen card becomes a cream sheet with its picture and one sentence.

The voice is split on purpose and then left alone. Anybody, a self-hosted variable sans, calls the arch, the stage directions, the category, and the controls, set a little condensed. Petrona, a self-hosted variable serif, speaks the answer and the instruction to hold. The illustrations are the existing flat category webps. The stage frames them. It does not repaint them. Density is one object, one answer, and a quiet status line.

Motion is one sequence, not a kit of entrances. The lamps fill across the hold, the curtain travels off, the cards spring and then orbit, and the sheet arrives once, from a short fall, a slight scale, and a blur. Reduced motion keeps the same cards and the same answer, drops the travel and the orbit, and lays the open deck out as a still grid. This world refuses the dark tarot page, the shuffle button, and a sentence shown without its picture.

**Key Characteristics:**

- One theater, centered, filling the viewport
- Plum field, vermilion frame, violet pleats, cream paper, gold lamps
- Anybody for the call, Petrona for the line
- Press-and-hold, then a pick, then the picture and the sentence together
- Soft cast shadows, an inset cavity, and a fine noise on the field
- A still grid when motion is reduced

## Colors

A plum house, a vermilion frame, a violet curtain, cream paper, and gold lamps. The field is declared dark (`color-scheme: dark`); the apron and the reading sheet are light paper set on top of it. The form accent is vermilion. Text selection is vermilion ink on cream.

### Primary

- **Vermilion** (#e23b12): The proscenium border, the browser form accent, and the stroke around the kept card.
- **Vermilion ink** (#8e1e09): The selection behind selected text. Selected text itself is cream.

### Secondary

- **Pleat** (#6436a0): The default curtain fold.
- **Pleat light** (#6d3eae): Folds 1, 4, and 7.
- **Pleat shadow** (#512884): Folds 3 and 6.
- **Violet deep** (#4a2278): The category name under the answer, and the focus ring on apron controls.
- **Violet fold** (#7342b4): The scrollbar thumb. The track is plum deep. The reduced-motion stage scroller uses cream on plum deep.

### Tertiary

- **Footlight gold** (#f0b429): A lit lamp, and the default focus ring. Gold is not a text color.

### Neutral

- **Plum** (#241428): The auditorium behind the theater, and the browser theme color.
- **Plum deep** (#160e1c): The theater interior, the wordmark’s ground, and the scrollbar track.
- **Cavity** (#120914): The stage opening behind the curtain and the cards.
- **Cream paper** (#f4ecdf): The apron, the reading sheet, the face behind each card picture, and the kept card’s inner sheet.
- **Ink** (#1c1210): Text on paper, filled controls, the quiet-button hairline, and the ring on every lamp.

### Named Rules

**The Frame Rule.** Vermilion paints the proscenium, the kept-card stroke, text selection, and the form accent. It does not fill buttons, and it does not carry the answer.

**The Pleat Rule.** The curtain is three violet cloths, repeating light, pleat, shadow across seven folds a side. Category type and the apron focus ring use violet deep. The scrollbar uses violet fold. These violets do not stand in for vermilion or gold.

## Typography

**Display / call:** Anybody (sans-serif fallback), self-hosted variable, weight axis 100–900, width axis 50%–150%.
**Answer / instruction:** Petrona (Georgia fallback), self-hosted variable, weight axis 100–900.
**Label / control:** Anybody again. There is no mono face.

**Character:** Anybody is the caller, slightly condensed, tight, and upright. Petrona is the speaker, a book serif at a medium weight, with a shorter line. Both files live in `site/fonts` and load with `font-display: swap`. The page sets `font-synthesis: none`.

### Hierarchy

- **Display** (Anybody 780, width 94%, `clamp(1.85rem, 4.8vw, 3.35rem)`, line-height 0.96, tracking -0.035em): The stage direction on the apron. “Hold your question.”, “Release.”, “Choose one.” Balanced wrap. Ink on cream.
- **Headline** (Petrona 560, `clamp(1.45rem, 2.5vw, 2.7rem)`, line-height 1.16, tracking -0.02em): The answer, once it has moved onto the cream sheet. Balanced wrap, and the text can be selected. Below 720px it is `clamp(1.28rem, 6.4vw, 1.7rem)`.
- **Title** (Anybody 800, width 92%, `clamp(1.35rem, 2.5vw, 2.15rem)`, line-height 1, tracking -0.03em): The wordmark in the arch. Cream on plum deep.
- **Body** (Petrona 500, 1.05rem, line-height 1.35): The hold instruction and the spread hint, measured to 36rem. The date note (“For {date}”) is the same face at 1rem with tabular figures, under the category, and only on today’s card. Status is the same face at 0.98rem and clears after 3.2s.
- **Label** (Anybody 720, width 98%, 1.05rem, tracking -0.01em): The category name, violet deep, under the answer. Not above it.
- **Control** (Anybody 680, width 98%, 0.98rem, tracking -0.01em): Apron controls, including Today’s card.

### Named Rules

**The Two Voices Rule.** Anybody carries the arch, the stage directions, the category, and the controls. Petrona speaks the answer, the hold instruction, the date note, and status. The voices do not swap.

**The Condensed Arch Rule.** Anybody is condensed: width 92% on the wordmark, 94% on the stage direction, 98% on the category and the controls. It is not set wide.

## Layout

The page is one centered theater on the plum field. It is `min(1120px, 100%)` wide and `min(960px, 100dvh minus the safe area minus 20px)` tall, and it will not shrink below `min(640px, that same viewport budget)`. The field pads by the safe area or by 10px, whichever is larger. Inside, the column is the wordmark, the stage (it flexes and may shrink), and the apron (it stays). The stage is inset 12px on the sides. The apron sits in 10px 12px 12px.

Below 720px the theater takes the remaining viewport height, the vermilion border drops to 8px, the stage inset drops to 8px, and the apron margin becomes 8px with padding 12px 12px 8px. The reading sheet is inset 10px from the stage (8px when narrow) and splits 42% picture / 58% copy, with the copy padded `clamp(16px, 3vw, 40px)` and a 12px stack. Below 720px the sheet stacks, picture first, and the picture keeps a floor of 148px. Copy padding becomes 12px 14px 14px with a 6px stack.

The closed deck is a fan of three covers (Love in front, Courage left, Hope right); the other cards wait behind that fan. The open deck orbits an ellipse. Under 560px of stage width the ellipse tightens and the front card stops at scale 1. When motion is reduced, spread mode replaces the orbit with a 4-column grid, 8px gaps, 10px padding, scrolling inside the stage; below 720px that grid is 3 columns.

The repeated space steps are 8px, 10px, 12px, 16px, and 18px on the apron’s sides. Controls wrap and stay at least 44px tall.

### Named Rules

**The One Object Rule.** The wordmark, the stage, and the apron are one theater, centered on the plum field. A new surface joins that object. It does not sit beside it as a second panel.

**The Still Deck Rule.** When reduced motion is on, the orbit becomes a four-column grid, three columns below 720px. The curtain and the reading sheet do not travel. The same cards and the same answer stay reachable.

## Elevation & Depth

Depth is a stack of tones plus a soft cast. The field is plum, with a fractal-noise grain tiled at 180px and painted at 4.5% opacity. The theater is plum deep. The stage opening is the cavity, pushed back with an inset shadow. The curtain hangs in that opening. Cream paper lies on top, as the apron and as the reading sheet, and it stays flat once it has arrived. The theater, each card, and the reading sheet cast a soft plum-black shadow. Lit lamps add a small warm cast. There is no glass and no hard offset shadow.

### Shadow Vocabulary

- **Theater** (`0 18px 36px rgba(12, 6, 10, 0.4)`, plus `inset 0 0 0 2px rgba(28, 18, 16, 0.45)`): The proscenium’s cast, and a hairline of ink inside the vermilion frame.
- **Stage cavity** (`inset 0 16px 36px rgba(0, 0, 0, 0.35)`): The opening sits behind the arch.
- **Card** (`0 14px 26px rgba(8, 4, 10, 0.42)`): Each illustrated card on the stage.
- **Reading** (`0 18px 40px rgba(8, 4, 10, 0.45)`): The cream sheet after a card is chosen.
- **Lamp, unlit** (`inset 0 0 0 1.5px` ink): A ring on the cream apron.
- **Lamp, lit** (the same ink ring, plus `0 7px 8px rgba(176, 110, 16, 0.35)`): Gold fill and a warm footlight cast.
- **Quiet control** (`inset 0 0 0 1.5px` ink): The hairline on Back to the deck and Ask again.

### Named Rules

**The Three Depths Rule.** The field is plum, the theater interior is plum deep, and the stage opening is the cavity. Cream paper sits on that stack. Do not add another dark.

**The Soft Cast Rule.** The theater, the cards, and the reading sheet cast a soft shadow with offset and blur. A hard, unblurred offset shadow is not part of this stage.

**The Flat Paper Rule.** The apron and the reading sheet are flat cream. They do not lift, and they do not use a glass blur. The sheet’s one entrance is the only blur, and it clears.

## Shapes

The page is cut as an arch. The proscenium radius is `120px 120px 20px 20px / 64px 64px 20px 20px`, inside a 12px vermilion border. Below 720px the border is 8px and the radius is `72px 72px 16px 16px / 36px 36px 16px 16px`. The stage opening repeats the arch smaller: `80px 80px 8px 8px / 36px 36px 8px 8px`, and `48px 48px 8px 8px / 24px 24px 8px 8px` when narrow.

Cards are portrait, 140×196 on the wide stage and 96×134 below 720px, with 12px corners (the picture files are 5:7 and cover the face). The apron matches the card’s 12px. The press target is an invisible rounded rectangle at 18px. The reading sheet is 16px, 14px when it stacks, and the picture inside it is 10px. Controls are pills. Lamps are 14px circles, 10px apart (8px when narrow). The kept PNG does not take the arch. Its corners are square.

### Named Rules

**The Arch Rule.** The proscenium and the stage opening are elliptical arches, tall across the top and short along the bottom. Cards, the reading sheet, and the apron use small even corners. Controls are pills. Lamps are circles. The shared image stays a sharp rectangle.

## Components

### Buttons

Filled, quiet, and text. All three use Anybody at the control size, a pill radius, and a 44px minimum height with padding 10px 16px. They sit centered on the apron, wrapping, with 8px between them. There is no separate hover fill. Disabled filled controls drop to 55% opacity and show a progress cursor.

- **Shape:** Pill (999px).
- **Primary:** Ink fill, cream type. Keep this card, and Copy link.
- **Quiet:** Transparent, ink type, 1.5px ink ring. Back to the deck, and Ask again.
- **Today:** Transparent, ink type, underline 1.5px thick, offset 0.22em. Same pill hit area. It leaves once a card is open.
- **Focus:** 2px violet deep, offset 3px, on every apron control.

### Cards / Containers

The closed stage shows three covers in a fan. Each card is a button, 140×196 (96×134 below 720px), picture cropped to cover, 12px corners, cream behind the picture, and the card shadow. Focus is a 2px cream ring, offset 4px, on a 14px radius. In the orbit, a fine pointer slows the turn to 0.22×, and keyboard focus slows it to 0.4×. Choosing a card opens the reading sheet. The picture and the sentence belong together.

The reading sheet is cream, ink type, 16px corners, the reading shadow, inset from the stage. It arrives in 0.55s with `cubic-bezier(0.16, 0.84, 0.24, 1)`, from 16px down, scale 0.98, and 8px of blur. The picture column is 42%, the image contained with 10px corners and inset 16px 10px 16px 16px. The copy column stacks the answer, then the category in violet deep, then the date note when the card is today’s. Below 720px the sheet is a column, radius 14px, picture on top.

The apron is the cream band under the stage: 12px corners, padding 16px 18px 12px, centered. It holds the stage direction, the instruction, the lamps, the controls, the status line, and Today’s card, in that order. Lamps and controls hide and return with the mode. The apron does not scroll away from the theater.

### Footlights

Seven 14px circles in a row, gap 10px, a 14px margin above the row. Unlit, they are transparent with a 1.5px ink ring. Lit, they fill with gold and take the warm cast. They rest unlit. Across the 3.4s hold they light from the left, one each seventh. At the end of the breath they are all lit, the stack has lifted, and the stage direction reads Release.

### Proscenium

The theater is the page. Plum deep ground, 12px vermilion border, the arch radius, the theater shadow, and the ink hairline inside the frame. The wordmark is centered in the arch. The stage is the cavity, with its own smaller arch and inset shadow, and it clips the curtain and the cards. Each curtain half is seven pleats. Opening and reading move the halves 104% outward in 0.85s with `cubic-bezier(0.77, 0, 0.18, 1)`. Reduced motion cuts that transition, so the curtain changes place without traveling. Forced colors redraw the frame as CanvasText, the lit lamp as Highlight, and the paper surfaces as Canvas.

### Kept card

The share image is a 1080×1440 canvas, not a second screen. Plum ground, a vermilion stroke 28px wide inset by 36px, then a cream sheet inset by 64px. The category picture is contained in a box from (110, 120) at 860×760. The sentence is Petrona 560 at 54px, ink, centered, lines 68px apart. Under it, the category is Anybody 750 at 32px in violet deep. The footer is Anybody 700 at 28px for the name, and Petrona 500 at 22px for the address. Corners are square. Those export weights stay on the export. The page ramp is unchanged.

### Named Rules

**The Breath Rule.** The hold lasts 3.4 seconds and lights seven lamps. At full, the closed stack lifts 10px and scales to 1.04, the stage direction becomes Release, and an 18ms vibration marks the detent. Releasing early restores the stack and leaves the curtain closed. A pick uses a 10ms tick.

**The Sentence Arrives Rule.** The chosen illustration and its sentence arrive together on the cream sheet, in one motion. The picture is not dropped to leave a quotation.

**The Focus Rule.** Focus is a 2px ring, never a glow. Gold at a 3px offset is the default. A card uses cream at 4px. The press target uses gold at 6px. Apron controls use violet deep at 3px.

## Do's and Don'ts

### Do:

- **Do** keep the theater as one object: plum field, vermilion arch, violet pleats, cream apron, gold lamps.
- **Do** set Anybody for the arch, the stage directions, the category, and the controls, and Petrona for the answer and the hold instruction.
- **Do** self-host Anybody and Petrona from `site/fonts`, with sans-serif and Georgia only as fallbacks.
- **Do** show the category illustration with the sentence, on the reading sheet and on the kept PNG, and leave the illustration’s own inks alone.
- **Do** theme selection (vermilion ink behind cream type), focus (gold, cream on a card, violet deep on the apron), and the scrollbar (violet fold on plum deep) from this palette.
- **Do** give reduced motion a still grid instead of the orbit, and keep the curtain and the reading sheet from animating.

### Don't:

- **Don't** add a shuffle control. The draw is a press-and-hold of one breath, then a pick.
- **Don't** show the answer without its illustration.
- **Don't** set the answer in Anybody, or the stage directions in Petrona.
- **Don't** fill buttons or body text with vermilion, and don't set type in gold.
- **Don't** use a hard offset shadow, or a second card chrome around the reading sheet.
- **Don't** put a kicker above the stage direction or the answer. The heading is the line. The category sits under the sentence as the card’s name.
