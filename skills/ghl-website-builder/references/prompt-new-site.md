# Mode: new-site

Building a brand-new client website in GoHighLevel. You've already read `platform-know-how.md`.

## Inputs

Gather these from the conversation, or accept them verbatim if the user pastes a fenced `INPUTS` block in this shape (either way works):

```
CLIENT_NAME*:
PREFIX*:
DOMAIN:
BUSINESS_SUMMARY*:
SERVICE_AREA:
TARGET_CUSTOMER:
MAIN_CTA*:
DIFFERENTIATORS:
PROOF:
TONE:
AVOID:
ANONYMITY:
COLOURS:
FONTS:
VISUAL_DIRECTION:
LOGO_URL:
HERO_MEDIA_URL:
NAV_PAGES:
FOOTER_CONTENT:
HOME_SECTIONS:
FORM_URL*:
FORM_EMBED:
MOTION:
EXISTING_MOCKUP:
```

Fields marked `*` are required. If any are missing, stop and ask only for those before generating anything. Everything else can fall back to its default below.

**Field meanings and defaults**

- `PREFIX`: short lowercase class prefix for this client (e.g. `acme`). Used as `{PREFIX}` everywhere, including inside code.
- `BUSINESS_SUMMARY`: what they do, for whom, where.
- `MAIN_CTA`: the primary action, e.g. "Book a free estimate".
- `PROOF`: approved testimonials, metrics, certifications. Blank = use no proof claims. Never invent one.
- `TONE` blank = direct, practical, plain English. `AVOID` and `ANONYMITY` blank = no extra restrictions.
- `COLOURS` blank = propose a palette (dark, light, accent, muted, borders), but only after asking about / receiving brand assets per the visual-reference rule in the top-level SKILL.md. `FONTS`: if given, these are the fonts; you may suggest an alternative once with a reason, but keep the given fonts unless the user explicitly approves a switch. Blank = pick from `references/font-library.md` per its rules (fit to mood, tone and business; skip recently used pairings; offer two options in Phase 1).
- `LOGO_URL` blank = text wordmark. `HERO_MEDIA_URL` blank = insert `{IMAGE_URL_hero}` and list it.
- `NAV_PAGES`: label=URL pairs. Blank = Services, About, Contact (`/#contact`).
- `FOOTER_CONTENT`: address, phone, email, hours, link groups. Blank = placeholders.
- `HOME_SECTIONS` blank = hero, problems, services, proof, process, FAQ, contact.
- `FORM_URL`: the client's GHL form URL (e.g. `https://app.crmbright.com/widget/form/jXoVcMs6h4cDt7zRexF7`). Used to read the embed host and the 20-character form ID, and to test the form skin against the live form before delivering it. See `platform-know-how.md`'s form ID and white-label host rule.
- `FORM_EMBED` blank = build the standard iframe + `form_embed.js` embed yourself from `FORM_URL`'s host and form ID. Provide this only if the client's account produces a non-standard embed snippet that should be preserved as-is.
- `MOTION` blank = STANDARD (reveal on scroll, hover states). Options: MINIMAL, STANDARD, RICH (with one signature animation).
- `EXISTING_MOCKUP`: file name or URL. If given, its look is the target. Read/fetch it before designing, and treat it as if it were already the Phase 2 output below (confirm it still fits with the user, then go straight to Phase 3. No need to build a new mockup from scratch).
- `DOMAIN`: if given and no mockup/brand assets are attached, fetch it and look at the client's current site before proposing colors/fonts/layout (see SKILL.md's visual-reference rule).

## Role

Act as a senior front-end developer, brand designer and conversion copywriter building a new client website in GoHighLevel. Follow `platform-know-how.md` exactly, and the steps and output format below exactly.

## Steps

This mode is homepage-only, and follows the 3-phase Build flow from the top-level `SKILL.md` (Plan → Mockup → Split). Each phase is its own response, gated on the user before moving to the next.

1. Read the inputs and all attachments. If any required (`*`) field is empty, stop and ask only for those before Phase 1.
2. **Phase 1 (Plan)**: propose homepage sections (from `HOME_SECTIONS`, or the default blueprint: hero, problems, services, proof, process, FAQ, contact), mood, and tone (from `TONE`/`VISUAL_DIRECTION`/brand assets, or a proposal if none given), and fonts (the client's `FONTS` if given, otherwise two options from `references/font-library.md`). Keep it short. Stop and wait for approval.
3. **Phase 2 (Mockup)**: build the single self-contained HTML file per `SKILL.md`'s Phase 2 rules: real Unsplash images, motion/video where it earns its place, a real header and footer inline so it reads as a finished page. Stop and wait for comments; iterate on this one file until approved.
4. **Phase 3 (Split)**: only once the mockup is approved:
   a. Write the design guideline: tokens, type scale, spacing, components (buttons, cards, eyebrow, sections), imagery, motion and copy rules, formalizing what Phases 1-2 already settled. Record the font pairing by name and source (Google Fonts or Fontshare) so later builds can avoid repeating it. Copy rules must carry forward `SKILL.md`'s standing no-em-dash rule so every future page written from this guideline inherits it. It becomes the reference for every future page on this site. Treat it as a durable artifact.
   b. Split the approved mockup into L1 master CSS (with the shield and one token block), L2 header, L3 footer, and L4 homepage body (with JSON-LD for the business type), per `platform-know-how.md`'s migration procedure.
   c. Generate `global/04-form-custom-css.css` from `references/form-skin-template.css`, filling every token from the same tokens used in L1. This is not optional, a plain form builder colour picker does not survive GHL's own `!important` field rules (see `platform-know-how.md`'s "Forms and chat"). Test it against the live form at `FORM_URL` per that section's testing method before delivering it.
   d. Build the two standard utility pages using the same tokens, header and footer as the homepage: `pages/404.html` and `pages/thank-you.html`. Every `new-site` build ships these alongside the homepage. See `platform-know-how.md`'s "Utility pages" for what each one needs and how it gets wired up in GHL (domain 404 assignment, form on-submit redirect). They don't get their own Plan/Mockup round trip; build them directly here from what Phases 1-2 already established.
   e. Flag every Unsplash/stock-video URL carried over and ask whether to keep it or swap it for the client's Media Library upload.
   f. Create the `{PREFIX}-ghl-site/` project folder and write every file into it at the paths in `SKILL.md`'s "Delivery" section, including `SETUP.md` for the GHL setup steps. This is the durable copy, not just what's shown in the response.
   g. Check the build against the GHL-like harness described in `platform-know-how.md`'s migration section and every rule in that file. Fix before answering.

## Output format

**Phase 1** and **Phase 2** each deliver just their own thing (the short plan; the single mockup file) as described above. No GHL files yet.

**Phase 3** delivers exactly these parts, in this order, written into `{PREFIX}-ghl-site/` per `SKILL.md`'s "Delivery" section (and still shown in the response, so it can be reviewed there too):

- **PART 1**: Design guideline (`{PREFIX}-DESIGN-GUIDELINES.md`)
- **PART 2**: `global/01-site-head-code.html` (fonts + master CSS, one code block)
- **PART 3**: `global/02-global-header.html` (one code block)
- **PART 4**: `global/03-global-footer.html` (one code block)
- **PART 5**: `pages/home.html` (one code block; GHL page settings in a comment at the top: page name, slug `/`, SEO title max 60 characters, meta description 150 to 160 characters)
- **PART 6**: `pages/404.html` (one code block; GHL page settings comment; note it isn't linked in nav and gets assigned as the domain's 404 page, not published to a nav-reachable slug)
- **PART 7**: `pages/thank-you.html` (one code block; GHL page settings comment; note it isn't linked in nav and is reached only via the form's on-submit redirect)
- **PART 8**: `global/04-form-custom-css.css` (one code block, tokens filled in, no literal `{TOKEN}` left)
- **PART 9**: `SETUP.md` (GHL setup steps: where each file goes, the domain's 404 page assignment, the form's on-submit redirect to the thank you page's URL, form builder style values matching the tokens, chat widget colours)
- **PART 10**: Placeholder and media list (every token or `[PLACEHOLDER]` left and what is needed, plus the Unsplash/video URL keep-or-swap decision from step 4e)
- **PART 11**: Self-check, PASS or FIXED per line:
  - shield present
  - all selectors scoped under `.{PREFIX}`
  - px not rem
  - tokens in one block
  - full-width script in header, footer, every page body
  - header transparent over hero, solid elsewhere
  - spacer logic
  - `/#id` link rewrite
  - mobile menu accessible
  - back-to-top bottom-left
  - JS in IIFEs with guarded selectors
  - no relative image paths
  - GHL form iframe + embed script, host matches `FORM_URL`
  - form skin generated from `form-skin-template.css`, no literal `{TOKEN}` left, tested against the live form (field, hover, focus, checkbox, submit label)
  - 404 and thank you pages built with the same tokens, header and footer as home, and not linked in nav
  - `SETUP.md` documents the domain's 404 assignment and the form's on-submit redirect target
  - all files written into `{PREFIX}-ghl-site/` at the paths above
  - no em dashes or en dashes anywhere a visitor reads
  - fonts: client-given fonts used unchanged (or a switch the user explicitly approved), otherwise a `font-library.md` pairing that isn't on the overused list and isn't a repeat of a recent build; pairing recorded in the design guideline
  - one H1 per page
  - title and meta not in code
  - reduced motion respected
  - no horizontal scroll at 375, 800, 1440
  - each block under 60 KB
