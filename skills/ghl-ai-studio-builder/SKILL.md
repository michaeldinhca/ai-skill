---
name: ghl-ai-studio-builder
description: Build, extend, or fix a website for GoHighLevel (GHL) AI Studio, which runs a fixed TanStack Start v1 project (React 19, Vite 7, TanStack Router file routes, Tailwind CSS v4 with oklch tokens, shadcn/ui, lucide-react, react-hook-form + zod, createServerFn form handling). Same design process as ghl-website-builder (plan, single-file mockup, design guideline, utility pages, accessibility core, mockup legal, SEO/GEO); only the final build step differs, producing complete drop-in route/component/server-function files. Use this whenever the user mentions GHL AI Studio, HighLevel AI Studio, an AI Studio site, asks for a TanStack Start site meant for GHL, or pastes AI Studio's own "build a complete production-ready website" prompt. Do NOT use it for classic GHL website/funnel builder pages built from Custom HTML/JS elements; that is ghl-website-builder.
argument-hint: [new-site|new-page|fix]
---

# GHL AI Studio Builder

The sibling of `ghl-website-builder`. **The design side is identical**: same inputs, same three gated phases, same mockup, same design guideline, same copy, legal, accessibility, SEO and font rules. **Only the technical target changes**: instead of splitting the approved mockup into GHL's 4 Custom Code layers, Phase 3 converts it into a TanStack Start v1 app that drops into AI Studio and runs.

This skill depends on `ghl-website-builder` being installed beside it (`../ghl-website-builder/`). Its references are the design source of truth and are read from there, never copied, so the two skills can't drift apart.

## Picking a mode

| Mode | When | Read |
|---|---|---|
| `new-site` | Brand-new AI Studio site | `references/prompt-new-site.md` |
| `new-page` | One more route on an existing AI Studio site | `references/prompt-new-page.md` |
| `fix` | Something in existing AI Studio code looks or behaves wrong | `references/prompt-change-request.md` |

With an explicit argument use that mode. Otherwise infer it and state the inference in one line.

## Before doing anything else

1. **Read `references/stack-contract.md` every time.** It is AI Studio's fixed technical contract (stack, files you may and may not touch, routes, server functions, output format) and how each classic design rule maps onto it. It replaces the classic `platform-know-how.md` for anything technical; read `platform-know-how.md` only for its design behavior (header over hero, back-to-top placement, reveal on scroll, utility pages), not its GHL mechanics.
2. **For `new-site` and `new-page`, read `../ghl-website-builder/references/accessibility.md`**, then the AODA-ADA core's own `README.md` and `CHECKLIST.md` it points to. The WCAG checklist is unchanged; how the core is loaded is in `stack-contract.md`.
3. **Read `../ghl-website-builder/references/mockup-legal.md` before producing any mockup.** Unchanged: invented name and wordmark, `001 NoWhere Avenue, ON, G5G 0R0, Canada`, `+1 999-999-9999`, `info@mockup.ngynsolutions.com`, free stock media only, until the user explicitly confirms the real identity.
4. **Read `../ghl-website-builder/references/seo-geo.md`.** Content rules are unchanged; in AI Studio the title, description and social image go into each route's `head()` instead of a page settings comment.
5. **Read the reference file for the chosen mode** and follow its steps and output format.
6. **Gather required inputs; do not guess.** Same rule as the classic skill: ask only for missing required fields, default the optional ones, never invent business facts (proof, testimonials, certifications, pricing, service areas, accessibility contact details). Mock identity values are the one exception.
7. **Never invent the visual identity from nothing.** Same rule as the classic skill: ask for a logo, brand guide, mockup or screenshots (or explicit permission to propose a palette); if only a domain is given, fetch the live site first to understand the business, never to copy it. For `new-page` and `fix`, work from the site's design guideline and its real code, never from description.

## Build flow: plan, then mockup, then convert for AI Studio

Applies to `new-site` and `new-page`. Three gated phases, each its own response, each ending with the user.

**Phase 1 and Phase 2 are exactly the classic skill's.** Follow `../ghl-website-builder/SKILL.md` "Build flow" for "Which pages are in this build", "Every expected link must work", Phase 1 (sitemap, sections, mood, tone, fonts from `font-library.md`) and Phase 2 (one self-contained `drafts/<slug>.html` per page with the shared header and footer inline, real working Unsplash images, motion and video where they earn their place, SEO/GEO and accessibility from the first draft, mock identity). Rebuild the preview with `../ghl-website-builder/scripts/build_preview.py <site-folder>` after every draft change; it must report zero broken links before you show anything. Iterate on the drafts until approved. This is the cheap phase to get wrong; the design is judged here, not in AI Studio.

**Phase 3: Convert to AI Studio.** Only once the mockup is approved. Follow `stack-contract.md`'s "Converting an approved mockup" procedure and the mode's output format. The page must look and behave like the approved mockup: same layout, type, spacing, colors, motion and copy. Translating to React, Tailwind and shadcn/ui is a technical change and never a reason to restyle anything. If a design element can't be reproduced inside the contract, say exactly which one and propose the closest option before changing it.

## Delivery: one project folder per site

```
{PREFIX}-ai-studio-site/
├── index.html, <slug>.html, sitemap.xml, site.json   (generated by build_preview.py from drafts/, never hand-edited)
├── {PREFIX}-DESIGN-GUIDELINES.md
├── SETUP.md                       (AI Studio install steps, token values, env vars, image list)
├── drafts/                        (Phase 2 mockups; kept after conversion as the visual reference)
└── src/                           (Phase 3 output, mirrors AI Studio's project paths)
    ├── routes/*.tsx
    ├── components/*.tsx
    └── lib/*.functions.ts
```

- Unlike the classic skill, **drafts are kept after Phase 3**: AI Studio pages aren't static HTML, so the drafts plus the generated preview remain the reviewable, crawlable copy of the design.
- `new-site` creates the folder; `new-page` adds files to it; `fix` edits in place and reports the paths. If you can't find a site's folder, ask before creating a second one.
- Files are written to disk and also shown in the response in AI Studio's output format.

## After building

- `references/qa-checklist.md`: graded PASS / FIXED per line in every Phase 3 delivery. Fix before answering.
- `../ghl-website-builder/references/issue-log.md` covers design and accessibility symptoms; technical AI Studio symptoms are in `stack-contract.md` "Known issues".

## Ground rules that apply in every mode

The classic skill's "Ground rules" all apply unchanged except the GHL-specific ones (form skin, 4 layers, px-not-rem, full-width script), which `stack-contract.md` replaces. In particular:

- No em dashes or en dashes anywhere a visitor reads.
- No scrolling marquee/ticker banners unless asked.
- Every `new-site` build bundles a 404 page, a thank you page and an accessibility statement page with the homepage.
- Every site loads the shared AODA-ADA core and passes its checklist; never write a custom accessibility widget or edit the core; never claim "AODA/ADA compliant".
- Every mockup follows `mockup-legal.md`; any site showing a real business identity is built with `--noindex` unless the user says otherwise.
- `{PREFIX}` and `{TOKEN}` placeholders substituted everywhere. Complete files only, no "unchanged" placeholders.
- Every delivery ends with the self-check, PASS or FIXED per line.
