---
name: ghl-ai-studio-builder
description: Build, extend, or fix a website for GoHighLevel (GHL) AI Studio, which runs a fixed TanStack Start v1 project (React 19, Vite 7, TanStack Router file routes, Tailwind CSS v4 with oklch tokens, shadcn/ui, lucide-react, react-hook-form + zod, createServerFn form handling). Produces complete, drop-in route/component/server-function files that paste straight into AI Studio and run. Use this whenever the user mentions GHL AI Studio, HighLevel AI Studio, an AI Studio site, or asks for a TanStack Start site meant for GHL, or pastes AI Studio's own "build a complete production-ready website" prompt. Do NOT use it for classic GHL website/funnel builder pages built from Custom HTML/JS elements; that is the ghl-website-builder skill.
argument-hint: [new-site|new-page|fix]
---

# GHL AI Studio Builder

GHL AI Studio is not the classic GHL page builder. It hosts a real React app on a **fixed** stack, and it only accepts files that fit that stack exactly. This skill encodes AI Studio's own build contract (from the instructions AI Studio publishes) plus the house rules from the classic builder, so every delivery is "paste in and run".

If the request is about the classic builder (Custom HTML/JS elements, global header/footer, site-wide CSS, iframe form embeds), stop and use `ghl-website-builder` instead.

## Modes

| Mode | When | Output |
|---|---|---|
| `new-site` | A whole site from scratch | every route file, components, server-function file(s), font `<link>` note, token note |
| `new-page` | One more route on an existing AI Studio site | the new route file, any new components, nav update to the shared header component |
| `fix` | Something in existing AI Studio code is wrong (build error, broken route, form not submitting, wrong colors) | only the changed files, each complete |

With an explicit argument use that mode. Otherwise infer it and say so in one line.

## Before doing anything else

1. **Read `references/stack-contract.md` every time.** It is the non-negotiable stack, routing, styling, server-function and output rules. Reproduce its templates exactly; do not paraphrase from memory.
2. **Read `references/templates.md`** for the route, layout, form and server-function skeletons this skill builds from.
3. **Mockups follow the classic skill's legal rules.** Read `../ghl-website-builder/references/mockup-legal.md`: invented name and wordmark, address `001 NoWhere Avenue, ON, G5G 0R0, Canada`, phone `+1 999-999-9999`, email `info@mockup.ngynsolutions.com`, nothing copied from the real business, until the user explicitly confirms the real identity may be used.
4. **SEO/GEO and fonts**: read `../ghl-website-builder/references/seo-geo.md` (what a page's title, description and content must do) and `../ghl-website-builder/references/font-library.md` (pairings to offer, avoiding recent ones). In AI Studio the SEO tags go in each route's `head()`, not in a build script.
5. **Gather required inputs; never guess business facts.** Required for `new-site`: what the business does and for whom, the pages wanted, what the form collects and what should happen on submit, and a visual anchor (logo, brand guide, screenshot, existing-site URL, or explicit permission to propose a palette). If a domain is given and nothing else, fetch the live site to understand the business before proposing anything. Ask only for what's missing. Never invent testimonials, certifications, pricing, service areas or stats; use a marked placeholder and a question.
6. **For `new-page` and `fix`, work from the real code.** Ask the user to paste the current `src/routes/__root.tsx`, the shared header/footer components, `src/styles.css` (tokens) and the file in question, or point at a local copy. Never rebuild an existing site's look from description.

## Build flow (new-site, new-page)

Three gated phases. Each ends with the user, never with you continuing on your own.

**Phase 1: Plan (text only).** Sitemap with every route path and what links to it; sections per page; mood and tone (a few words each); two font pairings (or the client's fonts); the brand palette as oklch values mapped to AI Studio's semantic tokens (`--primary`, `--accent`, etc.); what the form collects and what the server function does with it. Stop for feedback.

**Phase 2: Files.** Generate the full file set in the output format from `references/stack-contract.md`. Also save every file locally under `{PREFIX}-ai-studio-site/` (same project-relative paths, e.g. `{PREFIX}-ai-studio-site/src/routes/index.tsx`) so there is a durable source of truth; later `new-page`/`fix` runs reuse that folder. Show the files in the response too.

**Phase 3: QA + handover.** Run `references/qa-checklist.md` against every file and fix failures before answering. End with the checklist graded PASS / FIXED per line, the list of `{/* REPLACE: ... */}` image slots, the token values to set in AI Studio, and install steps.

If the user wants it reviewable before pasting into AI Studio and Node is available, offer to scaffold a local TanStack Start project in the site folder and run `npm run build` to prove the files compile. Say it if you couldn't.

## Ground rules in every mode

- **Stack is fixed.** No Next.js, Remix, react-router-dom, Express, separate API servers, other CSS frameworks, styled-components, or new npm packages. Only what `stack-contract.md` lists.
- **Never touch** `src/routeTree.gen.ts`, `package.json`, `tsconfig*`, `vite.config.*`, the token definitions in `src/styles.css`, `src/components/ui/*`, or `src/routes/__root.tsx` (one exception: adding font `<link>`s to its `head().links`). Brand colors are delivered as a token note for the user to set, not as edits.
- **Semantic tokens only** (`bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `border-border`, ...). No raw palette classes (`bg-white`, `text-black`, `bg-blue-600`), no hex in `className` or `style`.
- **No external image URLs in code.** Images are placeholder `<div>`s with `{/* REPLACE: <what goes here> */}`, an `aria-label` describing the intended image, and a fixed aspect ratio so layout doesn't jump when swapped. Icons from lucide-react. (This overrides the classic skill's "use real Unsplash URLs" rule.)
- **Complete files only.** No ellipses, no "rest unchanged", even in `fix` mode for the files you touch.
- **One H1 per page, unique `head()` title (60 chars max) and description (160 chars max) per route**, semantic landmarks, alt text or `aria-label` on every image slot, keyboard-reachable nav, visible focus, `prefers-reduced-motion` respected for any animation.
- **No em dashes or en dashes in any visitor-facing copy.** Use a period, comma, colon or a rewritten sentence.
- **No scrolling marquee/ticker banners** unless the user asks for one.
- **Never claim** the site is "ADA/AODA compliant" in copy.
- `{PREFIX}` and other `{TOKEN}` placeholders are substituted everywhere before delivery.
