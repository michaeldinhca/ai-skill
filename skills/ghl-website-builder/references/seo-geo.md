# SEO and GEO (required on every page, mockups included)

Mockups are published so that Google and AI assistants can find and read them. That only works if every page is complete, descriptive HTML with the right tags. "GEO" here means generative engine optimisation: being readable and quotable by AI crawlers and answer engines, which mostly do **not** run JavaScript.

`scripts/build_preview.py` writes the tags; your job is to write the content it needs and to structure pages so there is something worth indexing.

## What you write for every page

Put this comment at the very top of every `pages/<slug>.html`. The builder reads it for the preview, and the same values go into GHL's page settings at install:

```html
<!-- GHL PAGE SETTINGS
  Page name: Services
  Slug: /services
  SEO title (52): Drain Cleaning and Pipe Repair | Northline Plumbing
  Meta description (154): One or two plain sentences that say what this page offers, for whom and where, and give a reason to click. Written for a person, not stuffed with keywords.
  Social image: https://images.unsplash.com/photo-...?w=1200&q=80
-->
```

- **SEO title**: 60 characters or fewer, unique per page, main topic first, site name last.
- **Meta description**: 150 to 160 characters, unique per page, a real sentence.
- **Social image**: an absolute `https://` URL, landscape, at least 1200px wide. Blank falls back to the first image on the page.
- Each value sits on its own line; the number in brackets is the character count and is optional.

A Phase 2 draft is a full document, so it carries the same information in its own `<head>`: `<html lang>`, `<title>`, `<meta name="description">` and `<meta property="og:image">`. Don't add robots, canonical, other Open Graph or Twitter tags to a draft; the builder generates those and removes any it finds.

## What the builder adds to every page

`<title>`, meta description, robots, canonical, `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:locale`, `og:image` (+ alt), `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, and JSON-LD for `WebSite`, `WebPage` and (off the homepage) `BreadcrumbList`. It also writes `sitemap.xml` and rewrites site links to the static page files so crawlers can follow them. It fails the build when an indexable page has no written title, no written description, or not exactly one `<h1>`.

## Content rules that make a page indexable and quotable

- **The content is in the HTML.** Headings, copy, lists, FAQs, prices and contact details are real markup, never injected by JavaScript and never baked into images. Animation may reveal content; it must not create it.
- One `<h1>` that says what the page is about, then `<h2>`/`<h3>` in order. Headings describe the section ("Drain cleaning for older homes"), not just label it ("Services").
- **Answer first.** Open each page and each main section with one or two sentences that directly answer the question a visitor would ask, then elaborate. Answer engines quote that opening.
- A short FAQ with real questions people ask, answered in two to four plain sentences each, as visible text. Add `FAQPage` JSON-LD for it in the page body, matching the visible questions exactly.
- Specifics over adjectives: what is included, steps, ranges, areas served, in words. In a mockup these must be clearly generic or plainly plausible, never facts lifted from the real business.
- Every image has useful `alt` text; link text makes sense alone ("See drain cleaning prices", not "Click here"); every page is linked from another page.
- No keyword stuffing, no hidden text, no doorway pages, no copied text from the business's existing site or from another mockup. Each mockup's copy is written fresh.

## Structured data in a mockup

- Fine: `FAQPage`, `Service`, `HowTo`-style content schema that describes what is visibly on the page.
- **Not in a mockup:** `LocalBusiness` (or any business subtype), `Organization` contact points, `AggregateRating`, `Review`. Publishing business schema with the mock address and phone, or ratings nobody gave, is fake structured data, which search engines treat as spam and which could mislead people. The builder warns when it finds business schema next to mock contact details.
- At live handover, with real details from the user, add `LocalBusiness` JSON-LD for the real business back into the homepage body.

## Indexing: on for mock identities, off for real ones

- A mockup using the mock identity from `references/mockup-legal.md` is indexed (`index, follow`). The 404 and thank you pages are always `noindex`.
- **Any site that shows a real business's name, logo or contact details is built with `--noindex`**, unless the user explicitly says to index it. A public, indexed mockup under a real business's name competes with that business in search results, which is exactly the legal exposure the mockup rules exist to avoid. The same applies to any site the user says must not be publicly associated with them.
- `--noindex` and `--index` are remembered in `site.json`.

## Public URL

Canonical links, `og:url` and the sitemap need the folder's real public address. Pass it once with `--base-url` (it is remembered in `site.json`); the default guess is `https://mockup.ngynsolutions.com/<folder-name>/`. If the published slug differs from the folder name, the canonical URLs are wrong until `--base-url` is set, so confirm the slug with the user when it isn't obvious.

A sitemap inside a folder is only discovered if something points to it. Tell the user the sitemap's URL so it can be submitted in Google Search Console or listed by the mockup host.

## On the live GHL site

GHL writes its own `<title>`, description and social tags from each page's settings, so those values are entered there at install (never duplicated in code), exactly as the page settings comment lists them. The content rules above apply unchanged, because the page body is the same markup.
