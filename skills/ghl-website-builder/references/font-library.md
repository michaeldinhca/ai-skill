# Font library

A curated set of free, commercial-use font pairings for client sites. Read this in Phase 1 of `new-site` whenever fonts are being chosen. Every family below was checked to resolve from its source on 2026-09-28.

## Rule 1: the client's fonts come first

If the `FONTS` input names fonts, or the client's brand guideline, logo files or existing site already use specific fonts, **use those fonts.** Do not swap them for something from this library on your own.

You may suggest an alternative once, in the Phase 1 plan, when there's a concrete reason, e.g. the given font has no bold weight, reads poorly at body size, or isn't free for web use. Say what you'd suggest and why in one line, then keep using the client's font unless the user explicitly says to switch. Silence or "looks good" is not a yes to the swap.

## Rule 2: when no fonts are given, pick from this library

1. Read the mood, tone and business type from Phase 1.
2. Shortlist the pairings below whose tags fit.
3. **Check what's been used recently.** Look for other `*-ghl-site/` project folders beside the current one and read the fonts recorded in their `*-DESIGN-GUIDELINES.md`. Skip any pairing whose display font appears in the three most recent builds, unless nothing else fits the brief. This keeps sites from looking alike without needing a separate log. If no sibling folders are visible, skip this step.
4. Propose **two options** in the Phase 1 plan, one line each: a safer fit and a bolder one. Include the display and body names and a few words on why each suits this client.
5. Record the chosen pairing in the design guideline in Phase 3 so the next build can see it.

## Rule 3: guardrails

- At most two families (display + body), plus an optional mono accent for labels or eyebrows. One family used at two weights is also fine.
- Load only the weights actually used (typically 400, 500 and 600 or 700).
- Always keep a fallback chain in the CSS, e.g. `'Fraunces', Georgia, serif` or `'Satoshi', system-ui, sans-serif`.
- Confirm each font actually renders in the Phase 2 mockup before moving on.
- Check body text readability at 16px on mobile. Display fonts with extreme character (Syne, Unbounded, Big Shoulders Display, Anton) belong in headlines only, never body copy.

## Overused: fallbacks, not defaults

Montserrat, Inter, Poppins, Roboto, Open Sans, Lato, Raleway, Oswald, Playfair Display.

These are fine fonts, but they're the default of every template and page builder, so a site set in them reads as generic. Use one only when the client's brand already specifies it, or as the CSS fallback in a font stack. Inter stays the last-resort fallback in the form skin because it's safe everywhere.

## Loading

- **Google Fonts**: `https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600&family=Instrument+Sans:wght@400;500;600&display=swap` (spaces become `+`, one `family=` per font).
- **Fontshare (FS)**: `https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&f[]=clash-display@600&display=swap` (lowercase, hyphenated slugs).
- Load fonts once, in `global/01-site-head-code.html`. The form skin needs its own `@import` because the form is an iframe; if that import fails inside the form, the fallback chain takes over and the form still works.

## Pairings

Tags: **mood** / **fits** (business types). (FS) = Fontshare, everything else is Google Fonts.

### Serif display

| Display | Body | Accent | Mood | Fits |
|---|---|---|---|---|
| Fraunces | Instrument Sans | | warm, editorial, crafted | consultants, architects, boutique services, coaches |
| Instrument Serif | Satoshi (FS) | | elegant, calm, magazine | interior design, real estate, beauty, premium services |
| Newsreader | Hanken Grotesk | | trustworthy, measured, readable | finance, legal, accounting, advisory |
| Gloock | Outfit | | soft, confident, inviting | restaurants, cafes, hospitality |
| Young Serif | Figtree | | friendly, rounded, approachable | wellness, family services, bakeries, clinics |
| Bodoni Moda | DM Sans | | high contrast, luxury, fashion | fashion, jewellery, salons, events |
| Cormorant | Manrope | | refined, romantic, airy | weddings, spas, florists, photography |
| Zodiak (FS) | General Sans (FS) | | contemporary editorial | agencies, publishers, personal brands |
| Gambetta (FS) | Switzer (FS) | | classic but fresh | law, education, nonprofits |
| Libre Caslon Text | Schibsted Grotesk | | heritage, established | family businesses, trades with long history, heritage brands |
| Boska (FS) | Satoshi (FS) | | expressive, sharp, fashion-forward | creative portfolios, fashion editorial |

### Sans display

| Display | Body | Accent | Mood | Fits |
|---|---|---|---|---|
| Clash Display (FS) | General Sans (FS) | | bold, sharp, modern | tech, startups, marketing agencies |
| Bricolage Grotesque | Figtree | | playful, lively, human | SaaS, services, community brands |
| Cabinet Grotesk (FS) | Switzer (FS) | | clean, Swiss, precise | design studios, architecture, product companies |
| Syne | Manrope | | quirky, wide, creative | creative agencies, artists, event brands |
| Unbounded | Sora | | loud, rounded, futuristic | startups, events, gaming, youth brands |
| Space Grotesk | DM Sans | JetBrains Mono | technical, slightly retro | developer tools, IT services, engineering firms |
| Geist | Geist | Geist Mono | precise, minimal, engineered | software, consultants in tech, ERP/IT services |
| Red Hat Display | Onest | | friendly corporate | B2B services, healthcare admin, insurance |
| Epilogue | Plus Jakarta Sans | | modern, even, versatile | general small business, professional services |
| Urbanist | Familjen Grotesk | | geometric, light, modern | property management, cleaning, home services |
| Chillax (FS) | Satoshi (FS) | | relaxed, soft, contemporary | lifestyle, wellness, retail |
| Supreme (FS) | Hanken Grotesk | | neutral, confident, workmanlike | logistics, B2B, manufacturing |

### Condensed and heavy display (headlines only)

| Display | Body | Accent | Mood | Fits |
|---|---|---|---|---|
| Big Shoulders Display | Archivo | | industrial, strong, no-nonsense | construction, contractors, trades, restoration |
| Anton | Archivo | | loud, poster-like, urgent | gyms, sports, promotions, landing pages |

## Adding to this library

Add a pairing only after it has been used on a real build and looked right, and only fonts that are free for commercial web use. Keep the tag vocabulary consistent with the rows above so matching stays simple.
