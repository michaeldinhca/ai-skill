# AI Studio stack contract

Source: GHL AI Studio's own published build instructions. Every rule here is a hard requirement; breaking one means the files won't drop in and run.

## Stack (fixed)

| Concern | Use | Never |
|---|---|---|
| Framework | TanStack Start v1 (React 19, Vite 7) | Next.js, Remix, Astro, CRA |
| Routing | TanStack Router, file-based, `src/routes/` | react-router-dom, manual route trees |
| Server logic | `createServerFn` from `@tanstack/react-start` | Express, API route folders, external backends |
| Styling | Tailwind CSS v4, oklch tokens in `src/styles.css` | raw colors, CSS-in-JS, other frameworks |
| UI kit | shadcn/ui, already in `src/components/ui/` (import it) | re-creating Button/Input/Card etc. |
| Icons | `lucide-react` | icon fonts, external SVG URLs |
| Charts | `recharts` | other chart libs |
| Forms | `react-hook-form` + `zod` + `@hookform/resolvers/zod` | uncontrolled ad hoc forms, other validators |

Import alias `@/` maps to `src/`. Do not add dependencies.

## Files

| Path | Rule |
|---|---|
| `src/routes/__root.tsx` | Exists. Renders `<Outlet />`. Do not rewrite. Only allowed edit: font `<link>`s in its `head().links`. |
| `src/routes/index.tsx` | `/` |
| `src/routes/about.tsx` | `/about` (file name = path) |
| `src/routes/services/index.tsx`, `src/routes/services/$slug.tsx` | nested and dynamic routes, if needed |
| `src/routeTree.gen.ts` | Auto-generated. Never edit, never output. |
| `src/components/*.tsx` | New site components (header, footer, sections). Never inside `src/components/ui/`. |
| `src/lib/*.functions.ts` | Server functions. Never under `src/server/`. |
| `src/styles.css` | Token definitions are off-limits. |
| `package.json`, `tsconfig*`, `vite.config.*` | Off-limits. |

Shared header/footer: since `__root.tsx` can't be rewritten, put `SiteHeader` and `SiteFooter` in `src/components/` and render them in each page (or in a small `src/components/site-layout.tsx` wrapper every route uses).

## Routes

- Every content route exports `Route = createFileRoute("<path>")({ head, component })`.
- `head()` returns `meta` with: `title` (60 chars max, keyword-rich, unique), `description` (160 chars max, unique), `og:title`, `og:description`, `og:type` = `website`, `twitter:card` = `summary_large_image`.
- One `<h1>` per page. Semantic HTML (`header`, `nav`, `main`, `section` with headings, `footer`).
- Internal links: `<Link to="/path">` from `@tanstack/react-router`. Same-page anchors: `<a href="#id">`. Every link must resolve to a route you actually delivered.
- Images lazy-load; alt text (or `aria-label` on a placeholder) on every one.

## Server functions

- One thin wrapper file per concern: `src/lib/<name>.functions.ts`.
- Module scope holds only imports, erased types and exported `createServerFn(...)` declarations. Any runtime helpers or constants go **inside** `.handler()`.
- Read `process.env.*` only inside `.handler()`.
- Validate input with zod in the validator step. AI Studio's template uses `.validator((data) => Schema.parse(data))`. Newer TanStack Start releases name it `.inputValidator(...)`; if the user reports a type error on `.validator`, switch to `.inputValidator` with the same body. Use the template's form unless told otherwise.
- Return plain serializable objects (`{ success: boolean; message: string }`), never class instances or Responses.
- Call from the client as `await submitX({ data: values })`. `useServerFn` from `@tanstack/react-start` is optional; the direct call works.
- Submissions need somewhere to go. If the user hasn't said, ask: email (which service and env var), a webhook (e.g. GHL inbound webhook URL in `process.env.*`), or just log + success for now. Never hardcode secrets or URLs.

## Images and assets

No external image URLs in code. Use a sized placeholder:

```tsx
<div className="aspect-[16/9] w-full rounded-lg bg-muted" role="img" aria-label="Crew installing a cedar deck at dusk">
  {/* REPLACE: hero image, crew installing a cedar deck, 1920x1080 */}
</div>
```

## Output format

For each file, a path comment line, then one fenced block with the full file:

    // src/routes/index.tsx
    ```tsx
    ...full file content...
    ```

Complete files only. Deliver every route file, every server-function file, and every new component file. After the files: the token note, the font `<link>` note (if any), the REPLACE image list, and install steps.

## Token note (brand colors)

Since `src/styles.css` token definitions can't be edited by us, deliver the palette as a table the user applies in AI Studio (or asks AI Studio's assistant to apply):

| Token | Light | Dark |
|---|---|---|
| `--primary` | `oklch(0.55 0.15 250)` | `oklch(0.70 0.14 250)` |
| `--primary-foreground` | ... | ... |

Cover `--background`, `--foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--accent`, `--muted`, `--muted-foreground`, `--border`, `--ring`. Check 4.5:1 contrast for every foreground/background pair.
