# QA checklist

Grade every line PASS or FIXED in the delivery. Fix before answering; don't just report.

## Design parity (the design is the classic skill's)
- [ ] Phase 1 plan and Phase 2 drafts were approved before any route file was written.
- [ ] Each route matches its approved `drafts/<slug>.html` section by section: layout, type, spacing, colors, copy, anchors, motion. Any difference was approved by the user.
- [ ] Design guideline written, font pairing recorded, Tailwind mapping section present.
- [ ] Header transparent over a dark hero and solid after 40px, solid elsewhere; back-to-top bottom-left above the AODA launcher; reveal only hides below-the-fold elements.
- [ ] 404 (`$.tsx`, noindex), thank you and accessibility routes built with the same layout and tokens, not in nav, accessibility linked in footer with real or mock-per-legal details.
- [ ] AODA core loaded via `aoda-loader` with config first (`statementUrl`, `feedbackEmail`, `side: 'left'`, brand tokens), core file untouched.
- [ ] Fonts: client fonts unchanged or a `font-library.md` pairing not used recently; only used weights; fallback faces in the stacks.
- [ ] `build_preview.py` on the folder exits clean (zero broken links, no SEO errors); drafts kept.

## Stack and files
- [ ] Only stack imports: `@tanstack/react-router`, `@tanstack/react-start`, `react`, `@/components/ui/*`, `@/components/*`, `@/lib/*`, `lucide-react`, `recharts`, `react-hook-form`, `zod`, `@hookform/resolvers/zod`. No react-router-dom, next/*, axios, new packages.
- [ ] No output for `routeTree.gen.ts`, `package.json`, `tsconfig`, `vite.config`, `src/styles.css` tokens, `src/components/ui/*`. `__root.tsx` only touched for font links, delivered as a note.
- [ ] Every file is complete: no `...`, no "rest unchanged".
- [ ] Each file starts with its `// src/...` path comment and has one fenced block.
- [ ] Route file names match the paths used in `createFileRoute("...")`.

## Routes and SEO
- [ ] Every content route has its own `head()` with unique title (60 chars max) and description (160 chars max), plus og:title, og:description, og:type, twitter:card.
- [ ] Exactly one `<h1>` per page; heading levels don't skip.
- [ ] Every `<Link to>` points to a delivered route; every `#anchor` exists on its page. No `href="#"`.
- [ ] Every page reachable from nav, footer or a page body.

## Styling
- [ ] Only semantic token classes. Grep for `bg-white`, `bg-black`, `text-white`, `text-black`, `-gray-`, `-slate-`, `-zinc-`, `-blue-`, `-red-`, `#` hex, `rgb(`: none.
- [ ] Mobile-first: works at 360px wide, no horizontal scroll.
- [ ] Animation behind `motion-safe:` / respects `prefers-reduced-motion`.

## Forms and server functions
- [ ] Server function in `src/lib/*.functions.ts`, not `src/server/`.
- [ ] Module scope: imports, types, schema, exported server fns only. Helpers and constants inside `.handler()`.
- [ ] `process.env` read only inside `.handler()`; no secrets or URLs hardcoded.
- [ ] zod validation in the validator step; client form uses the same field rules via `zodResolver`.
- [ ] Returns a plain serializable object; UI shows success and error in a `role="status"` region; submit button disabled while submitting.
- [ ] Every input has a `<Label htmlFor>`, `autoComplete` where relevant, `aria-invalid` + described error.

## Content and accessibility
- [ ] No external image URLs; every image slot is a sized placeholder with `aria-label` and a `{/* REPLACE: ... */}` comment.
- [ ] Skip link, landmarks, visible focus, keyboard-operable mobile menu with a labelled button.
- [ ] Text contrast 4.5:1 against its token background (check the token note values).
- [ ] No em dash or en dash in visitor-facing copy.
- [ ] No invented testimonials, stats, certifications or prices; placeholders are marked.
- [ ] Mockup: mock name, address, phone, email per `mockup-legal.md`; nothing copied from the real business.
- [ ] No "ADA/AODA compliant" claims; no marquee ticker unless asked.
- [ ] No literal `{PREFIX}` / `{TOKEN}` left anywhere.

## Handover
- [ ] Token note (light + dark oklch), font link note, REPLACE image list, install steps: paste each file at its path, set env vars, set tokens, preview every route, submit the form once.
