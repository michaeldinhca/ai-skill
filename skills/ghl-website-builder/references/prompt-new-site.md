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
FORM_EMBED*:
MOTION:
EXISTING_MOCKUP:
```

Fields marked `*` are required — if any are missing, stop and ask only for those before generating anything. Everything else can fall back to its default below.

**Field meanings and defaults**

- `PREFIX`: short lowercase class prefix for this client (e.g. `acme`). Used as `{PREFIX}` everywhere, including inside code.
- `BUSINESS_SUMMARY`: what they do, for whom, where.
- `MAIN_CTA`: the primary action, e.g. "Book a free estimate".
- `PROOF`: approved testimonials, metrics, certifications. Blank = use no proof claims — never invent one.
- `TONE` blank = direct, practical, plain English. `AVOID` and `ANONYMITY` blank = no extra restrictions.
- `COLOURS` blank = propose a palette (dark, light, accent, muted, borders), but only after asking about / receiving brand assets per the visual-reference rule in the top-level SKILL.md. `FONTS` blank = propose a Google Fonts pairing.
- `LOGO_URL` blank = text wordmark. `HERO_MEDIA_URL` blank = insert `{IMAGE_URL_hero}` and list it.
- `NAV_PAGES`: label=URL pairs. Blank = Services, About, Contact (`/#contact`).
- `FOOTER_CONTENT`: address, phone, email, hours, link groups. Blank = placeholders.
- `HOME_SECTIONS` blank = hero, problems, services, proof, process, FAQ, contact.
- `FORM_EMBED`: the GHL iframe embed code.
- `MOTION` blank = STANDARD (reveal on scroll, hover states). Options: MINIMAL, STANDARD, RICH (with one signature animation).
- `EXISTING_MOCKUP`: file name or URL. If given, its look is the target — read/fetch it before designing.
- `DOMAIN`: if given and no mockup/brand assets are attached, fetch it and look at the client's current site before proposing colors/fonts/layout (see SKILL.md's visual-reference rule).

## Role

Act as a senior front-end developer, brand designer and conversion copywriter building a new client website in GoHighLevel. Follow `platform-know-how.md` exactly, and the steps and output format below exactly.

## Steps

1. Read the inputs and all attachments.
2. If any required (`*`) field is empty, stop and ask only for those. Otherwise continue without asking.
3. Write a short design guideline for this client: tokens, type scale, spacing, components (buttons, cards, eyebrow, sections), imagery, motion and copy rules. It becomes the reference for every future page — treat it as a durable artifact, not throwaway output.
4. Build L1 master CSS (with the shield and one token block), L2 header and L3 footer.
5. Build the homepage body (L4), including JSON-LD for the business type.
6. Check the build against the GHL-like harness described in `platform-know-how.md`'s migration section and every rule in that file. Fix before answering.

## Output format (exactly these parts, in this order)

- **PART 1**: Design guideline (markdown, to save as `{PREFIX}-DESIGN-GUIDELINES.md`)
- **PART 2**: `01-site-head-code.html` (fonts + master CSS, one code block)
- **PART 3**: `02-global-header.html` (one code block)
- **PART 4**: `03-global-footer.html` (one code block)
- **PART 5**: `04-homepage-body.html` (one code block; GHL page settings in a comment at the top: page name, slug `/`, SEO title max 60 characters, meta description 150 to 160 characters)
- **PART 6**: GHL setup steps (where each file goes, form builder style values matching the tokens, chat widget colours)
- **PART 7**: Placeholder list (every token or `[PLACEHOLDER]` left, and what is needed)
- **PART 8**: Self-check, PASS or FIXED per line:
  - shield present
  - all selectors scoped under `.{PREFIX}`
  - px not rem
  - tokens in one block
  - full-width script in header, footer, body
  - header transparent over hero, solid elsewhere
  - spacer logic
  - `/#id` link rewrite
  - mobile menu accessible
  - back-to-top bottom-left
  - JS in IIFEs with guarded selectors
  - no relative image paths
  - GHL form iframe + embed script
  - one H1
  - title and meta not in code
  - reduced motion respected
  - no horizontal scroll at 375, 800, 1440
  - each block under 60 KB
