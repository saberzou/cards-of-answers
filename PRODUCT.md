# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML, CSS, and JavaScript. No build step. Deployed to GitHub Pages from `main` by `.github/workflows/deploy.yml`. The published artifact must contain only the site, not lesson notes, desktop metadata, or unused full-size PNG originals.

Confirmed by the owner’s brief. Interview was not run live: this record is taken from that brief and the repository, and inferred lines are marked.

## Users

A person alone with a private question, on a phone or a laptop, who wants one drawn answer rather than a search result or a conversation. They may return on another day. (Scene confirmed by the existing product and the brief “Hold your question.”)

## Product Purpose

Cards of Answers is a private draw. You bring a question, the deck offers one illustrated card, and that card carries one of 240 short answers. Success is a draw that feels chosen, a card you can read clearly, and a way to keep or send that exact answer.

## Positioning

Twenty-four illustrated categories, ten answers each. The draw is a held breath, then a spread you pick from, then a flip. A neighboring quote app cannot truthfully claim the illustrated deck or this gesture.

## Operating Context

One screen. No account, no saved questions, no feed. The question stays in the person’s head. Optional once-a-day card is local to the device and the date. Shared links point at one specific answer.

## Capabilities and Constraints

- Keep all 240 English answers and all 24 category illustrations. Presentation may change. Content may not be deleted.
- Illustrations may be re-cropped, re-framed, and optimized. They are the primary asset.
- Press-and-hold of about one breath replaces the Shuffle button. Release opens the spread. The person picks a card. It flips. The revealed card shows its illustration and its answer.
- A canvas-rendered PNG of the answer can be downloaded and shared.
- A URL can open a specific answer.
- Optional quiet once-a-day card, deterministic for the local date.
- Keyboard and screen-reader access, pinch-zoom allowed, `prefers-reduced-motion` honored.
- No analytics and no third-party trackers. No three.js. The snow effect does not need a 3D library.
- Static files only, so the site can stay on GitHub Pages.
- Owner: Saber. Live site: https://saberzou.github.io/cards-of-answers/
- The owner asked for the redesign to be merged and deployed.

## Brand Commitments

Name: Cards of Answers. Voice of the answers is already written: short, direct, second person. Do not rewrite the 240 answers. The illustrations’ flat orange, violet, cream, and black shapes are the recognizable mark.

## Evidence on Hand

- 24 card illustrations in `images/card-<category>.webp` (and unused PNG originals beside them).
- 240 answers embedded in `index.html`, 10 per category.
- Categories: Courage, Wisdom, Love, Mystery, Patience, Truth, Change, Action, Solitude, Fate, Hope, Doubt, Growth, Time, Joy, Focus, Release, Risk, Rest, Connection, Clarity, Acceptance, Ambition, Gratitude.
- No testimonials, no analytics, no account system. Do not invent any.

## Product Principles

- The question stays private. The interface never asks the person to type it.
- One answer at a time. The deck is a ritual, not a catalog to browse for the “best” line.
- The illustration and the sentence belong on the same card.
- The draw must be operable without a pointer: keyboard, reduced motion, and a screen reader all reach the same answer.
- Nothing leaves the device except what the person chooses to share.

## Accessibility & Inclusion

The current page disables zoom, hides cards from assistive tech, and ignores reduced motion. The replacement must allow zoom, name every card and the revealed answer, and offer a non-orbiting path when motion is reduced.
