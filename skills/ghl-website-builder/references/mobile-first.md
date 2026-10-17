# Mobile first (required on every page)

Most visitors to a small-business site arrive on a phone, and Google indexes the mobile version of a page. So every page is designed, written and built for a phone first, then enhanced for larger screens. Desktop is the extension, not the original.

## Design and plan

- **Phase 1** plans the mobile layout first: the order sections stack in on a phone, and what the first screen (about 390 x 700px) shows: who it is for, what is offered, and the main call to action. Mention any section that changes shape on desktop.
- **Phase 2** mockups are reviewed at phone width first. Say so when handing a draft over, and design the hero so it works at 390px before it works at 1440px.
- Never design a desktop layout and squeeze it down. If something only works with a mouse or a wide screen (hover-only reveals, wide tables, multi-column comparisons, horizontal timelines), give it a real mobile form: stacked cards, a vertical list, tap-to-open.

## Build rules

- **CSS is written mobile first:** base styles are the phone layout, and larger screens are added with `min-width` media queries (e.g. `@media (min-width: 768px)`, `@media (min-width: 1100px)`). Avoid `max-width` queries that undo a desktop layout, except for small, deliberate phone-only fixes.
- **Layout:** single column by default; grids and side-by-side layouts start at a breakpoint. Use flexible widths (`%`, `fr`, `minmax()`, `clamp()` with px values), never fixed pixel widths on containers. No horizontal scroll at 320px, 375px or 390px.
- **Type:** body text at least 16px on mobile (also prevents iOS zooming into form fields). Headlines sized for a phone first with `clamp()`, so a long headline never overflows or breaks mid-word. Line length about 35 to 75 characters.
- **Tap targets:** buttons, links in lists, nav items and form controls at least 44 x 44px, with at least 8px between neighbours. The main call to action is easy to reach with a thumb; consider a mobile sticky CTA bar for the main action (it already has a defined spot in the footer layer).
- **Navigation:** a mobile menu button (already defined in `platform-know-how.md`), short labels, phone number as a `tel:` link and email as a `mailto:` link wherever contact details appear.
- **Media:** images sized for the screen with `width:100%; height:auto` (or `aspect-ratio` plus `object-fit`), so the page doesn't jump while loading. Heavy hero video and WebGL scenes get a lighter mobile form: a poster image or a reduced scene, never a multi-megabyte download on cellular data. Don't autoplay video with sound; mobile browsers block it anyway.
- **Motion:** keep animations cheap on phones (transform and opacity only, no scroll-jacking), and respect `prefers-reduced-motion` as usual.
- **Viewport:** `width=device-width, initial-scale=1`. Never block zoom (`maximum-scale=1`, `user-scalable=no`), see `references/accessibility.md`.
- **Fixed elements:** on a phone the header, sticky CTA bar, accessibility launcher, back-to-top and GHL chat bubble all compete for a small screen. Keep the fixed header short (82px or less), and check that none of them cover each other or the main CTA.

## Checking

Before handing over any phase, check every page at **390px first**, then 375px and 320px, then 800px and 1440px:

- no horizontal scroll, nothing cut off or overlapping;
- the first screen at 390px shows the offer and the main call to action;
- text readable without zooming, tap targets comfortable;
- the mobile menu, form and sticky elements work by touch;
- media light enough for a phone (no giant hero files).

The preview's static pages (`build_preview.py`) can be opened directly in a phone-size browser window or device emulation for this.
