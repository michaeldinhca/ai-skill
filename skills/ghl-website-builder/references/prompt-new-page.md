# Mode: new-page

Building ONE new page body for a GoHighLevel website that already has its 4 layers built. You've already read `platform-know-how.md`. This mode also needs the client's design guideline (from a prior `new-site` run) and a finished reference page attached — ask for them if missing, per the visual-reference rule in the top-level SKILL.md.

## Inputs

Gather these from the conversation, or accept a pasted `INPUTS` block in this shape:

```
PREFIX*:
PAGE_TYPE*:
PAGE_NAME:
SLUG*:
PRIMARY_KEYWORD:
SECONDARY_KEYWORDS:
TARGET_READER:
PAGE_GOAL:
CTA_TEXT:
SOURCE_CONTENT*:
VERIFIED_PROOF:
SECTIONS:
HERO_STYLE:
HERO_MEDIA_URL:
OTHER_MEDIA:
FORM_EMBED:
INTERNAL_LINKS:
MOTION:
EXTRA:
```

Fields marked `*` are required — if any are missing, stop and ask only for those before generating anything.

**Field meanings and defaults**

- `PREFIX`: the client's class prefix (same as the design guideline).
- `PAGE_TYPE`: case study, article, service, industry, location, landing, about, or other.
- `SLUG`: lowercase-with-hyphens. Keep the existing slug when replacing a page.
- `PRIMARY_KEYWORD` blank = derive from `PAGE_NAME`. `TARGET_READER` blank = use the design guideline audience.
- `CTA_TEXT` blank = the site's main CTA from the design guideline.
- `SOURCE_CONTENT`: notes, facts, old page text or URL. Only facts from here may be used.
- `VERIFIED_PROOF` blank = no numbers, quotes or certifications; outcomes stay qualitative.
- `SECTIONS` blank = use the blueprint for `PAGE_TYPE` below.
- `HERO_STYLE` blank = DARK_PHOTO if `HERO_MEDIA_URL` is given, otherwise DARK_PLAIN. Options: DARK_PHOTO, DARK_PLAIN, LIGHT.
- `HERO_MEDIA_URL` and `OTHER_MEDIA`: GHL Media Library URLs. Missing = insert an `{IMAGE_URL_...}` token and list it.
- `FORM_EMBED` blank = reuse the form embed from the attached reference page. Write NONE for no form.
- `MOTION` blank = STANDARD.

**Section blueprints**

- **Case study**: hero (outcome-led H1) / at a glance facts / challenge / what was built (workflow strip) / result / how it was delivered / related work / contact with form
- **Article**: hero with a direct answer up front / H2 body with a table or checklist / mid CTA band / key takeaways / FAQ (3 to 5) / related articles / contact with form
- **Service**: hero / problems solved / what is included / how it works / proof / risk reducers / FAQ / contact with form
- **Industry or location**: hero naming the industry or place / problems / solution workflow / relevant proof / included / FAQ / contact with form
- **Landing (ads)**: hero with one offer / 3 benefits / proof / how it works / objections FAQ / form
- **About**: hero / story / how we work / team or founder / values shown through practice / contact with form

## Role

Act as a senior front-end developer and conversion copywriter building ONE page body for a GoHighLevel website. Follow `platform-know-how.md`, the attached design guideline and the attached reference page exactly. The page must look like it belongs to the same site — don't reinvent visual language.

## Page rules

1. One code block: JSON-LD at the top, then `<style>`, then

   ```html
   <div class="{PREFIX} {PREFIX}-page page-{SLUG}"><main id="main"> sections </main></div>
   ```

   then `<script>` (IIFE, including the full-width script from `platform-know-how.md`).
2. No header, footer, fonts, master CSS, `<html>`, `<head>`, `<body>`, `<title>` or meta tags.
3. Reuse master CSS classes first. New CSS is scoped under `.page-{SLUG}`.
4. DARK_PHOTO or DARK_PLAIN: the first section gets class `{PREFIX}-hero` and enough top padding to clear the fixed header. LIGHT: do not use that class.
5. The contact section has `id="contact"`.
6. Use only facts from `SOURCE_CONTENT` and `VERIFIED_PROOF`. Where something is missing, insert `<span class="placeholder">[PLACEHOLDER: what is needed]</span>` — never fill the gap with an invented fact.
7. Follow the client's copy rules from the design guideline (tone, banned words, anonymity, punctuation).

## Steps

1. Read the inputs and attachments. Note the master classes and reference patterns to reuse.
2. If any required (`*`) field is empty, stop and ask only for those. Otherwise continue without asking.
3. Outline the sections with one line of purpose each. Put the primary keyword in the H1, one H2 and the first paragraph.
4. Write the copy.
5. Build the code.
6. Self-check every rule and fix before answering.

## Output format (exactly these 5 parts)

- **PART 1**: GHL page settings: page name / URL slug / SEO title (max 60 characters) / meta description (150 to 160 characters) / social image
- **PART 2**: Page outline (numbered, one line each)
- **PART 3**: Complete code in one code block (no abbreviations, no "unchanged" comments)
- **PART 4**: Placeholder list (or "None")
- **PART 5**: Self-check, PASS or FIXED per line:
  - one H1
  - only provided facts
  - client copy rules followed
  - no header, footer or fonts in code
  - selectors scoped
  - px not rem
  - full-width script included
  - JS in IIFE with guarded selectors
  - hero class matches hero style
  - contact `id="contact"`
  - no relative image paths
  - reduced motion respected
  - no horizontal scroll at 375, 800, 1440
  - under 60 KB
