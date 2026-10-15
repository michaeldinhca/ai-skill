# AI Studio stack contract

Source: GHL AI Studio's own published build instructions. Every rule here is a hard requirement; breaking one means the files won't drop in and run. This file covers **technical** rules only. Design decisions come from the approved mockup and the classic skill's references.

## Stack (fixed)

| Concern | Use | Never |
|---|---|---|
| Framework | TanStack Start v1 (React 19, Vite 7) | Next.js, Remix, Astro, CRA |
| Routing | TanStack Router, file-based, `src/routes/` | react-router-dom, manual route trees |
| Server logic | `createServerFn` from `@tanstack/react-start` | Express, API route folders, external backends |
| Styling | Tailwind CSS v4, oklch tokens in `src/styles.css` | raw colors in components, CSS-in-JS, other frameworks |
| UI kit | shadcn/ui, already in `src/components/ui/` (import it) | re-creating Button/Input/Card etc. |
| Icons | `lucide-react` | icon fonts, external SVG URLs |
| Charts | `recharts` | other chart libs |
| Forms | `react-hook-form` + `zod` + `@hookform/resolvers/zod` | ad hoc forms, other validators |

Import alias `@/` maps to `src/`. Do not add dependencies.

## Files

| Path | Rule |
|---|---|
| `src/routes/__root.tsx` | Exists, renders `<Outlet />`. Do not rewrite. Only allowed edit: font `<link>`s in its `head().links`, delivered as an edit note. |
| `src/routes/index.tsx` | `/` |
| `src/routes/about.tsx` | `/about` (file name = path); `services/index.tsx`, `services/$slug.tsx` for nesting |
| `src/routes/$.tsx` | Catch-all route = the site's 404 page (since `__root.tsx`'s `notFoundComponent` can't be edited) |
| `src/routeTree.gen.ts` | Auto-generated. Never edit, never output. |
| `src/components/*.tsx` | Site components (layout, header, footer, sections, reveal, AODA loader). Never inside `src/components/ui/`. |
| `src/lib/*.functions.ts` | Server functions. Never under `src/server/`. |
| `src/styles.css` | Token definitions off-limits (deliver a token note instead). |
| `public/` | Static files served at `/`. Used only for the AODA core file. |
| `package.json`, `tsconfig*`, `vite.config.*` | Off-limits. |

## Classic design rule to AI Studio mapping

| Classic (GHL) | AI Studio |
|---|---|
| L1 master CSS + token block | Token note (oklch, light + dark) for `src/styles.css`; components use semantic token classes only (`bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `border-border`). Brand values that have no semantic token (e.g. a second accent) become a CSS variable the user adds in the token note and are referenced as `bg-[var(--brand-x)]`, never raw hex. |
| Scoping under `.{PREFIX}`, CSS shield, px not rem, full-width script | Not needed. Tailwind utilities; React owns the page. Drop these rules. |
| L2 global header | `src/components/site-header.tsx`: fixed bar, transparent over a dark hero and solid after 40px scroll (hero pages pass `heroOverlay` to the layout), mobile menu with `Sheet`, `aria-expanded`, Escape closes and focus returns, `scrollPaddingTop` kept equal to header height. |
| L3 global footer, back-to-top, reveal on scroll | `src/components/site-footer.tsx` (links `/accessibility`), `back-to-top.tsx` bottom-left stacked above the AODA launcher (bottom about 84px), `reveal.tsx` IntersectionObserver wrapper that only hides elements below the fold. |
| L4 page body | `src/routes/<slug>.tsx` wrapped in `SiteLayout`, one `<main id="main">`. |
| GHL page settings comment | Route `head()`: title (60 max), description (150 to 160), `og:title`, `og:description`, `og:type`, `og:image` (when an image is approved), `twitter:card`. Same values as the draft's `<head>`. |
| JSON-LD (`FAQPage` etc.) | `head().scripts: [{ type: "application/ld+json", children: JSON.stringify({...}) }]`. Same schema rules as `seo-geo.md` (no business or rating schema in a mockup). |
| GHL form iframe + form skin | Native form with shadcn `Input`/`Textarea`/`Label`/`Button` + react-hook-form + zod, styled from the same tokens as the mockup; submit through a server function. No form skin file. |
| Form on-submit redirect to thank you | On success, `navigate({ to: "/thank-you" })`. |
| GHL domain 404 assignment | `src/routes/$.tsx`, `head()` with `robots: noindex`. |
| AODA core in head code | `public/aoda-ada.min.js` (copied from `AODA-ADA/dist/`, never edited) loaded by `src/components/aoda-loader.tsx` inside `SiteLayout`: set `window.AODA_ADA_CONFIG` first, then append one `<script src="/aoda-ada.min.js">` if not already present. Config is the same as `accessibility.md` section 2. If AI Studio won't accept a `public/` file, use a hosted URL from the user instead. |
| Media Library URLs, `{IMAGE_URL_x}` tokens | See "Images" below. |
| Unsplash / stock video in the mockup | Same keep-or-swap question as the classic Phase 3, answered under "Images". |

## Converting an approved mockup

1. Extract the design tokens from the drafts into the token note and the design guideline.
2. Build the shared pieces once: `site-layout.tsx`, `site-header.tsx`, `site-footer.tsx`, `back-to-top.tsx`, `reveal.tsx`, `aoda-loader.tsx`.
3. One route per draft, section by section, same order, same copy (byte for byte), same headings, ids and anchors. Mockup paths (`/about`, `/#services`) become `<Link to="/about">` and `<Link to="/" hash="services">`.
4. Motion: port keyframes and transitions to Tailwind (`motion-safe:` variants, arbitrary `animate-[...]`) or a small component; JS motion honours `prefers-reduced-motion`, `aoda-motion-off` on `<html>` and the `aoda:change` event, and pauses offscreen. Video and anything moving over 5 seconds keeps its visible pause control.
5. Forms: fields and labels from the mockup's form, server function per "Server functions", thank you redirect.
6. Build the utility routes: `$.tsx` (404), `thank-you.tsx`, `accessibility.tsx` (content from `AODA-ADA/templates/accessibility-statement.html`, every `{{PLACEHOLDER}}` filled per `accessibility.md` section 4).
7. Compare each route against its draft section by section; any difference is a bug unless the user approved it.

## Routes

- Every content route exports `Route = createFileRoute("<path>")({ head, component })` with a unique title and description.
- One `<h1>` per page, ordered headings, semantic landmarks.
- Internal links: `<Link to>`; every link resolves to a route in this build or a real `#id`. No `href="#"`.

## Server functions

- `src/lib/<name>.functions.ts`, thin wrapper: module scope holds only imports, erased types, the zod schema and exported `createServerFn(...)` declarations. Helpers and constants go **inside** `.handler()`.
- `process.env.*` read only inside `.handler()`. No hardcoded secrets or URLs.
- Validate with zod: `.validator((data: unknown) => Schema.parse(data))` as AI Studio's template shows. Newer TanStack Start names it `.inputValidator(...)`; switch only if the user reports a type error on `.validator`.
- Return plain serializable objects (`{ success, message }`).
- Call as `await submitX({ data: values })`.
- Where submissions go is a required input (`FORM_TARGET`): a GHL inbound webhook URL in an env var (recommended, keeps leads in the CRM), an email service, or log only. Never guess.

## Images

AI Studio's rule: no external image URLs in code. So every approved Unsplash image or stock video becomes a sized placeholder that keeps the mockup's exact aspect ratio, crop intent and overlay:

```tsx
<div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted" role="img" aria-label="Crew installing a cedar deck at dusk">
  {/* REPLACE: hero image. Approved mockup source: https://images.unsplash.com/photo-...?w=1920 (swap for the client's own upload if preferred) */}
</div>
```

List every slot in `SETUP.md` with its approved source URL, so the user uploads it in AI Studio and the result matches the mockup. If the user explicitly asks to keep external URLs anyway, say it breaks AI Studio's stated rule, and only proceed on a yes.

## Output format

Each file: a path comment line, then one fenced block with the full file:

    // src/routes/index.tsx
    ```tsx
    ...full file content...
    ```

Complete files only. After the files: token note, font link note, image REPLACE list, env vars, install steps.

## Token note

Map the mockup's palette onto AI Studio's tokens, light and dark, oklch:

| Token | Light | Dark |
|---|---|---|
| `--primary` | `oklch(...)` | `oklch(...)` |

Cover `--background`, `--foreground`, `--card`, `--card-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--accent`, `--accent-foreground`, `--muted`, `--muted-foreground`, `--border`, `--input`, `--ring`, `--destructive`, plus any extra brand variables. 4.5:1 for text pairs, 3:1 for borders and focus rings. If the mockup is single-theme, dark mirrors light rather than inventing a second look.

## Fonts

The approved pairing (from `font-library.md`) loads through the one allowed `__root.tsx` edit: preconnect to the font hosts plus one stylesheet link with only the weights used. Map families with `--font-sans` / `--font-serif` / `--font-display` in the token note and use `font-sans` / `font-display` classes. Keep the metric-matched fallback names in the stacks (`'Fraunces', 'Fraunces Fallback', serif`) and include the fallback `@font-face` rules from `font-fallbacks.css` in the token note.

## Known issues

| Symptom | Cause | Fix |
|---|---|---|
| Route 404s though the file exists | `createFileRoute` path doesn't match file name, or file outside `src/routes/` | Match exactly; let the generator rebuild `routeTree.gen.ts` |
| Type error on `.validator` | Newer TanStack Start API | `.inputValidator(...)` with the same body |
| Server function leaks to client bundle / env undefined | Runtime code or `process.env` at module scope | Move inside `.handler()` |
| Colors wrong in dark mode | Raw palette class or hex used | Semantic token classes only |
| Header covers focused element | `scrollPaddingTop` not updated | Set it from the header height on mount and resize |
| Accessibility toolbar missing | `aoda-loader` not in layout, or `public/aoda-ada.min.js` not uploaded | Check both; config must be set before the script loads |
