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
- Always use a metric-matched fallback in the font stack, e.g. `'Fraunces', 'Fraunces Fallback', serif` (see "Loading" below).
- Confirm each font actually renders in the Phase 2 mockup before moving on.
- Check body text readability at 16px on mobile. Display fonts with extreme character (Syne, Unbounded, Big Shoulders Display, Anton) belong in headlines only, never body copy.

## Overused: fallbacks, not defaults

Montserrat, Inter, Poppins, Roboto, Open Sans, Lato, Raleway, Oswald, Playfair Display.

These are fine fonts, but they're the default of every template and page builder, so a site set in them reads as generic. Use one only when the client's brand already specifies it, or as the CSS fallback in a font stack. Inter stays the last-resort fallback in the form skin because it's safe everywhere.

## Loading

Fonts load once, in `global/01-site-head-code.html`, in this order:

1. **Preconnect** to the font servers first, so the connection is open before the CSS is even read:

   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   ```

   For Fontshare use `https://api.fontshare.com` and `https://cdn.fontshare.com` (the second with `crossorigin`). Only preconnect to the servers the site actually uses.
2. **The font CSS**, with only the weights the site uses and `display=swap`:
   - **Google Fonts**: `https://fonts.googleapis.com/css2?family=Fraunces:wght@600&family=Instrument+Sans:wght@400;500&display=swap` (spaces become `+`, one `family=` per font).
   - **Fontshare (FS)**: `https://api.fontshare.com/v2/css?f[]=satoshi@400,500&f[]=clash-display@600&display=swap` (lowercase, hyphenated slugs).
   Every extra weight is another file to download on a visitor's first visit, so check the CSS actually uses each weight you load.
3. **Metric-matched fallbacks**: copy the rule for each chosen font from `references/font-fallbacks.css` into the head code's `<style>`, and use the stack from its comment, e.g. `font-family: 'Fraunces', 'Fraunces Fallback', serif;`. While the web font is still loading, the system font then takes up the same space, so the page doesn't jump when the real font swaps in. For a font that isn't in that file (a client's own font, or a new library addition), generate the rule with `python scripts/font_fallback.py "Name:weight:sans|serif|mono"` (needs `pip install fonttools brotli`; it also takes a Fontshare `fs:slug` or a local font file). If it can't be run, fall back to a plain stack and say so.

Don't self-host font files in GHL's Media Library and don't `preload` specific font file URLs: the font servers already let browsers cache the files (Google for a year, Fontshare for a week), GHL's media host isn't confirmed to send the cross-origin headers fonts need, and Google's file URLs change when a font is updated.

The form skin needs its own `@import` of the same font CSS because the form is an iframe; if that import fails inside the form, the fallback chain takes over and the form still works.

## Changing fonts on a live site

Browsers cache fonts by exact URL, so switching to a different font or weight downloads the new one automatically; nobody needs to clear their cache. What does need doing, every time:

- Update the font CSS URL, the font tokens, the preconnect lines if the font server changed, and the fallback rules in `global/01-site-head-code.html`, then re-paste it in GHL and republish.
- Update `{FONT_IMPORT_URL}`, `{BODY_FONT}` and `{LABEL_FONT}` in `global/04-form-custom-css.css` and **re-paste it into every form's Custom CSS**. This is the step that gets missed; the form otherwise keeps the old font.
- Update the pairing recorded in the design guideline, so the no-repeat check stays accurate.
- Rebuild the preview. If you don't see the new font on your own machine right away, it's GHL's publish delay or your browser holding the page; a hard refresh (Ctrl+F5) confirms it.

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
