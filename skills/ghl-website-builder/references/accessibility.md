# Accessibility (required on every site)

Every site uses the shared **AODA-ADA core**. Never write your own accessibility widget.

- Core location: `C:\Project\all-site-code\AODA-ADA` (repo `michaeldinhca/all-site-code`, folder `AODA-ADA`, private).
- **Before starting a site, read `AODA-ADA/README.md` and `AODA-ADA/CHECKLIST.md`.** They are the source of truth for the core's config, styling contract and the WCAG checklist; this file only covers how they fit into this skill. If they disagree with this file on how the core works, they win.
- **Never edit anything in `AODA-ADA/` from a site project.** If the core needs a change, stop and report it to the user.

## 1. The site itself must pass the checklist

Target **WCAG 2.1 AA** (`CHECKLIST.md`). The toolbar does **not** make a site compliant, so the build has to: one `<h1>`, headings in order, landmarks with `<main id="main">`, alt text, visible labels on form fields, 4.5:1 text contrast, visible focus, full keyboard use, no zoom blocking, pause controls for motion.

**Copy rule:** never write "AODA compliant", "ADA compliant" or similar because of the toolbar, anywhere on the site. Overlay vendors have been fined for exactly that claim. Only state what is true; the statement page template says what can be said.

How the checklist lands on this skill's 4-layer build:

- **Landmarks.** The global header markup uses `<header>` with `<nav aria-label="Main">`; the global footer uses `<footer>`. Every page body already wraps its content in `<main id="main">` (exactly one per page). The core adds a "Skip to main content" link when the page has none.
- **Sticky header vs focus.** A fixed header can hide the focused element (WCAG 2.4.11). The header script sets `document.documentElement.style.scrollPaddingTop` to the header's height (update it on resize). This is the one allowed write to `<html>` styling, done from JS so the scoping rule for CSS still holds.
- **Links in body text are underlined.** The CSS shield removes link underlines globally; restore them for links inside running text (`.{PREFIX} p a, .{PREFIX} li a { text-decoration: underline }` or a content class), keeping nav and buttons as designed.
- **px stays.** The checklist prefers `rem`, but this skill uses `px` because GHL can change the root font size. That still passes text resize (1.4.4): browser zoom scales px, and the core's default `textScale: 'js'` scales px text. Never set `textScale: 'rem'` on GHL sites.
- **Zoom.** Never `user-scalable=no` or `maximum-scale=1` in any viewport meta.
- **Motion.** Anything that moves for more than 5 seconds (background video, sliders, tickers, WebGL, looping animation) has a visible pause control. JS motion pauses when `<html>` has `aoda-motion-off` or `prefers-reduced-motion` is set, and listens for `aoda:change` (README section 4). CSS animations are stopped by the core.
- **Forms.** GHL form embeds are iframes the core can't reach (README section 9). In the GHL form builder: field labels visible (not placeholder-only), required fields marked in text, then check them with the keyboard. The embed `<iframe>` gets a `title` (e.g. `title="Contact form"`).

## 2. Loading the core

Site-wide, in `global/01-site-head-code.html` (GHL Website Settings > Tracking Code > Header), **without `defer`**, config first:

```html
<script>window.AODA_ADA_CONFIG = {
  statementUrl: '/accessibility',
  feedbackEmail: '{ACCESSIBILITY_EMAIL}',
  side: 'left',
  tokens: {
    '--aoda-accent': '{brand primary}',
    '--aoda-accent-strong': '{darker shade}',
    '--aoda-on-accent': '{text on accent}',
    '--aoda-accent-soft': '{light tint}',
    '--aoda-font': "'{UI font}', '{UI font} Fallback', sans-serif"
  }
};</script>
<script src="{hosted aoda-ada.min.js URL}"></script>
```

- **No hosted URL yet:** paste the full contents of `AODA-ADA/dist/aoda-ada.min.js` inside a `<script>` tag instead. It is about 72 KB, above this skill's 60 KB guideline for one code box, so give it its own `<script>` block at the end of the head code and, after saving in GHL, confirm the field kept all of it (the saved text still ends with the file's last characters). If GHL truncates it, stop and tell the user; a hosted URL is then required.
- **Side and position.** GHL's chat bubble owns bottom-right, so the launcher goes **left** (`side: 'left'`, bottom). The back-to-top button, also bottom-left, stacks **above** the launcher (bottom offset about 84px: 16 + 56 launcher + 12 gap). If a mobile sticky CTA bar exists, lift the launcher above it with level-2 CSS, e.g. `@media (max-width: 767px) { #aoda-ada .aoda-launcher { bottom: 88px } }`. If a cookie widget also sits bottom-left, pick `vpos: 'middle'` instead and say so.
- The GHL builder canvas doesn't run scripts; check the toolbar in GHL Preview or the site's `index.html` preview.

## 3. Styling the toolbar

Use the lowest level that works (README section 5):

1. **Tokens only** (above). Take the values from the site's design tokens.
2. **Extra CSS**, in the head code, every selector starting with `#aoda-ada` and using only the classes in README section 5 "DOM contract" (square launcher, floating card panel, flat header...).
3. **`skin: false` with a full replacement**, only if the design truly needs it.

Always keep: 4.5:1 text contrast (`--aoda-on-accent` on `--aoda-accent`, text on surface), 3:1 for borders and accent, a visible focus ring, controls at least 24x24px.

Optional site controls that drive the core: a header button `<button type="button" data-aoda-open>Accessibility</button>` (then set `launcher: false`), or `data-aoda-set="textSize:+1"` A+/A- buttons.

## 4. The accessibility statement page

Every site ships `pages/accessibility.html` at `/accessibility`, built from `AODA-ADA/templates/accessibility-statement.html` as a normal page body in the site's own style (same rules as any page: scoped CSS, one H1, full-width script). The template is a full HTML document; take its content, not its `<head>` or its script tags (the core already loads site-wide).

- Fill every `{{PLACEHOLDER}}`. **For a confirmed real client, ask the user for the real accessibility email, phone and mailing address; never invent them.** In a mockup, use the invented business name and the fixed mock email, phone and address from `references/mockup-legal.md` (also for `feedbackEmail` in the config); they get replaced at live handover. Keep the feedback and accessible-formats sections (AODA requires them). Delete optional sections that don't apply rather than leaving placeholders.
- Link it in **every footer** (it lives in `global/03-global-footer.html`, so one link covers every page).
- `statementUrl` and `feedbackEmail` in the config match it.

## 5. Before handing over

1. Open every page with `?aoda-audit` and fix every error. In the site preview that's `index.html?page=<slug>&aoda-audit`. Drafts render in an iframe that doesn't see the URL, so for Phase 2 drafts temporarily add `audit: true` to the draft's config instead, and remove it after.
2. Tab through each whole page with the keyboard only: skip link, nav, mobile menu (Escape closes, focus returns), every link and button, the form, the toolbar.
3. Report anything left over (axe or Lighthouse findings, form iframe issues, contrast on video frames) instead of declaring the site compliant.
