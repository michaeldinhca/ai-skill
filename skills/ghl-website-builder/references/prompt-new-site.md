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
SUB_PAGES:
FOOTER_CONTENT:
HOME_SECTIONS:
FORM_URL*:
ACCESSIBILITY_EMAIL:
ACCESSIBILITY_PHONE:
MAILING_ADDRESS:
FORM_EMBED:
MOTION:
EXISTING_MOCKUP:
REAL_IDENTITY_CONFIRMED:
```

Fields marked `*` are required. If any are missing, stop and ask only for those before generating anything. Everything else can fall back to its default below.

**Field meanings and defaults**

- `REAL_IDENTITY_CONFIRMED` blank = **this is a mockup**, which is the normal case: follow `references/mockup-legal.md` (invented name and wordmark, the fixed mock address, phone and email, free stock media only, nothing taken from the business's own site). Set it only after the user has explicitly confirmed, item by item, that the business's real name, logo, contact details, photos or projects may be used; list exactly what was confirmed. A real name or logo appearing in the other fields is not a confirmation.
- `CLIENT_NAME`: the real business, so you know who the mockup is for. In a mockup it is never shown; propose an invented name in Phase 1 and use that everywhere a visitor sees a name.
- `PREFIX`: short lowercase class prefix for this client (e.g. `acme`). Used as `{PREFIX}` everywhere, including inside code.
- `BUSINESS_SUMMARY`: what they do, for whom, where.
- `MAIN_CTA`: the primary action, e.g. "Book a free estimate".
- `PROOF`: approved testimonials, metrics, certifications. Blank = use no proof claims. Never invent one.
- `TONE` blank = direct, practical, plain English. `AVOID` and `ANONYMITY` blank = no extra restrictions.
- `COLOURS` blank = propose a palette (dark, light, accent, muted, borders), but only after asking about / receiving brand assets per the visual-reference rule in the top-level SKILL.md. `FONTS`: if given, these are the fonts; you may suggest an alternative once with a reason, but keep the given fonts unless the user explicitly approves a switch. Blank = pick from `references/font-library.md` per its rules (fit to mood, tone and business; skip recently used pairings; offer two options in Phase 1).
- `LOGO_URL` blank = text wordmark. In a mockup a given logo is reference only (colours, feel); the mockup still uses a wordmark of the invented name unless real use is confirmed. `HERO_MEDIA_URL` blank = insert `{IMAGE_URL_hero}` and list it.
- `NAV_PAGES`: label=URL pairs. A URL that is its own page (`/about`) rather than a homepage section (`/#about`) puts that page in this build: it gets planned, mocked and split alongside the homepage, so the nav never points anywhere empty. Blank = homepage sections only: Services (`/#services`), About (`/#about`), Contact (`/#contact`).
- `SUB_PAGES`: pages to build that aren't in the nav, e.g. one page per service linked from the homepage cards. Each is part of this build, like a nav page. Blank = none beyond `NAV_PAGES`.
- `FOOTER_CONTENT`: address, phone, email, hours, link groups. Blank = placeholders. In a mockup the address, phone and email are always the fixed mock values, whatever is given here.
- `HOME_SECTIONS` blank = hero, problems, services, proof, process, FAQ, contact.
- `ACCESSIBILITY_EMAIL`, `ACCESSIBILITY_PHONE`, `MAILING_ADDRESS`: in a mockup these are the fixed mock email, phone and address, with nothing to ask. For a confirmed real client they are required: the real contact details for accessibility feedback, used in the toolbar config (`feedbackEmail`) and the `/accessibility` statement page. AODA requires a working feedback channel, so the email is required. Phone and address may come from `FOOTER_CONTENT` if it has them; otherwise ask. Never invent any of them.
- `FORM_URL`: the client's GHL form URL (e.g. `https://app.crmbright.com/widget/form/jXoVcMs6h4cDt7zRexF7`). Used to read the embed host and the 20-character form ID, and to test the form skin against the live form before delivering it. See `platform-know-how.md`'s form ID and white-label host rule.
- `FORM_EMBED` blank = build the standard iframe + `form_embed.js` embed yourself from `FORM_URL`'s host and form ID. Provide this only if the client's account produces a non-standard embed snippet that should be preserved as-is.
- `MOTION` blank = STANDARD (reveal on scroll, hover states). Options: MINIMAL, STANDARD, RICH (with one signature animation).
- `EXISTING_MOCKUP`: file name or URL. If given, its look is the target. Read/fetch it before designing, and treat it as if it were already the Phase 2 output below (confirm it still fits with the user, then go straight to Phase 3. No need to build a new mockup from scratch).
- `DOMAIN`: if given and no mockup/brand assets are attached, fetch it and look at the client's current site before proposing colors/fonts/layout (see SKILL.md's visual-reference rule).

## Role

Act as a senior front-end developer, brand designer and conversion copywriter building a new client website in GoHighLevel. Follow `platform-know-how.md` exactly, and the steps and output format below exactly.

## Steps

This mode builds the homepage plus every sub page requested (the page URLs in `NAV_PAGES`, everything in `SUB_PAGES`, or pages the user asks for in conversation), per `SKILL.md`'s "Which pages are in this build". It follows the 3-phase Build flow from the top-level `SKILL.md` (Plan → Mockup → Split). Each phase is its own response, gated on the user before moving to the next. Sub pages use the section blueprints in `references/prompt-new-page.md` and, like every page, only facts the user has given; anything missing becomes a visible placeholder, never an invented fact.

1. Read the inputs and all attachments. If any required (`*`) field is empty, stop and ask only for those before Phase 1.
2. **Phase 1 (Plan)**: for a mockup, start with the invented business name (two options) and say in one line that the mockup uses mock contact details and stock media only. If the request asked for the real name, logo, contact details, photos or projects, raise the legal concern here and wait for an explicit yes before using any of them (`references/mockup-legal.md`). Then, if more than the homepage is in the build, list the sitemap first (every page, its slug, and which nav item, footer link or button leads to it). Then propose homepage sections (from `HOME_SECTIONS`, or the default blueprint: hero, problems, services, proof, process, FAQ, contact), mood, and tone (from `TONE`/`VISUAL_DIRECTION`/brand assets, or a proposal if none given), and fonts (the client's `FONTS` if given, otherwise two options from `references/font-library.md`). Keep it short. Stop and wait for approval.
3. **Phase 2 (Mockup)**: build one self-contained draft per page in the build (`drafts/home.html`, `drafts/<slug>.html`) per `SKILL.md`'s Phase 2 rules: real Unsplash images, motion/video where it earns its place, the same real header and footer inline in each so every page reads as finished. Link them to each other with the site's real paths. Rebuild the preview; `build_preview.py` must report zero broken links before you show it. Stop and wait for comments; iterate on these drafts until approved.
4. **Phase 3 (Split)**: only once the mockup is approved:
   a. Write the design guideline: tokens, type scale, spacing, components (buttons, cards, eyebrow, sections), imagery, motion and copy rules, formalizing what Phases 1-2 already settled. Record the font pairing by name and source (Google Fonts or Fontshare) so later builds can avoid repeating it. Copy rules must carry forward `SKILL.md`'s standing no-em-dash rule so every future page written from this guideline inherits it. It becomes the reference for every future page on this site. Treat it as a durable artifact.
   b. Split the approved mockups into L1 master CSS (with the shield and one token block), L2 header, L3 footer, the L4 homepage body (with JSON-LD for the business type), and one L4 body per sub page at `pages/<slug>.html` following the Page rules in `references/prompt-new-page.md`, per `platform-know-how.md`'s migration procedure. Shared styles go to L1 once, not repeated per page.
   c. Generate `global/04-form-custom-css.css` from `references/form-skin-template.css`, filling every token from the same tokens used in L1. This is not optional, a plain form builder colour picker does not survive GHL's own `!important` field rules (see `platform-know-how.md`'s "Forms and chat"). Test it against the live form at `FORM_URL` per that section's testing method before delivering it.
   d. Build the three standard utility pages using the same tokens, header and footer as the homepage: `pages/404.html`, `pages/thank-you.html` and `pages/accessibility.html`. Every `new-site` build ships these alongside the homepage. See `platform-know-how.md`'s "Utility pages" for what each one needs and how it gets wired up in GHL (domain 404 assignment, form on-submit redirect), and `references/accessibility.md` section 4 for the statement page. They don't get their own Plan/Mockup round trip; build them directly here from what Phases 1-2 already established.
   e. Flag every Unsplash/stock-video URL carried over and ask whether to keep it or swap it for the client's Media Library upload.
   f. Create the `{PREFIX}-ghl-site/` project folder and write every file into it at the paths in `SKILL.md`'s "Delivery" section, including `SETUP.md` for the GHL setup steps. This is the durable copy, not just what's shown in the response. Delete every draft that has now been split, then run `scripts/build_preview.py` on the folder so the root `index.html` previews every page together. It must report zero broken links; fix and rerun until it does.
   g. Check the build against the GHL-like harness described in `platform-know-how.md`'s migration section and every rule in that file. Fix before answering.

## Output format

**Phase 1** and **Phase 2** each deliver just their own thing (the short plan; the linked draft mockups and rebuilt preview) as described above. No GHL files yet.

**Phase 3** delivers exactly these parts, in this order, written into `{PREFIX}-ghl-site/` per `SKILL.md`'s "Delivery" section (and still shown in the response, so it can be reviewed there too):

- **PART 1**: Design guideline (`{PREFIX}-DESIGN-GUIDELINES.md`)
- **PART 2**: `global/01-site-head-code.html` (fonts + master CSS, one code block)
- **PART 3**: `global/02-global-header.html` (one code block)
- **PART 4**: `global/03-global-footer.html` (one code block)
- **PART 5**: `pages/home.html` (one code block; GHL page settings in a comment at the top: page name, slug `/`, SEO title max 60 characters, meta description 150 to 160 characters), then one `pages/<slug>.html` per sub page in the build, each with its own page settings comment
- **PART 6**: `pages/404.html` (one code block; GHL page settings comment; note it isn't linked in nav and gets assigned as the domain's 404 page, not published to a nav-reachable slug)
- **PART 7**: `pages/thank-you.html` (one code block; GHL page settings comment; note it isn't linked in nav and is reached only via the form's on-submit redirect)
- **PART 8**: `pages/accessibility.html` (one code block; GHL page settings comment, slug `/accessibility`; every `{{PLACEHOLDER}}` filled with real details from the user)
- **PART 9**: `global/04-form-custom-css.css` (one code block, tokens filled in, no literal `{TOKEN}` left)
- **PART 10**: `SETUP.md` (GHL setup steps: where each file goes, the AODA-ADA core in the head code (hosted URL, or inline and checked that GHL saved it whole), the domain's 404 page assignment, the form's on-submit redirect to the thank you page's URL, form builder settings: labels visible, required marked in text, style values matching the tokens, chat widget colours)
- **PART 11**: Placeholder and media list (every token or `[PLACEHOLDER]` left and what is needed, plus the Unsplash/video URL keep-or-swap decision from step 4e)
- **PART 12**: Self-check, PASS or FIXED per line:
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
  - 404, thank you and accessibility pages built with the same tokens, header and footer as home, and not linked in nav; accessibility statement linked in the footer with real contact details
  - AODA-ADA core loaded site-wide in the head code without `defer`, config before it, `statementUrl` and `feedbackEmail` set, launcher left with back-to-top stacked above it, styled at the lowest level that works with 4.5:1 / 3:1 contrast and visible focus
  - `CHECKLIST.md` passed: landmarks (`<header>`, `<nav aria-label>`, one `<main id="main">`, `<footer>`), ordered headings, alt text, visible focus, keyboard-only use including the mobile menu, no zoom blocking, pause controls for motion over 5 seconds, JS motion honours `aoda-motion-off` and `aoda:change`, form iframe has a `title`
  - `?aoda-audit` shows zero errors on every page, a full keyboard tab-through done, and anything left over reported
  - no "AODA compliant" or "ADA compliant" claims in any copy
  - mockup legal: invented name and wordmark (no real logo), mock address, phone and email everywhere including JSON-LD, the footer and the accessibility page, stock media only, nothing copied or hot-linked from the business's site, no real testimonials, staff, clients or licence numbers; any real asset used is one the user explicitly confirmed, and that confirmation is recorded in the design guideline and `SETUP.md`
  - live handover only: every mock value replaced with real details from the user, and `build_preview.py` no longer reports mock data
  - `SETUP.md` documents the domain's 404 assignment and the form's on-submit redirect target
  - all files written into `{PREFIX}-ghl-site/` at the paths above
  - `index.html` and `site.json` regenerated by `build_preview.py` after the last change, and every page opens in it without console errors
  - every requested sub page built; `build_preview.py` reports zero broken links (no link to a missing page or anchor, no `href="#"`, no relative paths) and no sub page that nothing links to
  - no em dashes or en dashes anywhere a visitor reads
  - font loading: preconnect lines for the font servers used, only the weights the CSS actually uses, a metric-matched fallback face per font (from `font-fallbacks.css` or `font_fallback.py`) with the fallback in each font stack
  - fonts: client-given fonts used unchanged (or a switch the user explicitly approved), otherwise a `font-library.md` pairing that isn't on the overused list and isn't a repeat of a recent build; pairing recorded in the design guideline
  - one H1 per page
  - title and meta not in code
  - reduced motion respected
  - no horizontal scroll at 375, 800, 1440
  - each block under 60 KB
