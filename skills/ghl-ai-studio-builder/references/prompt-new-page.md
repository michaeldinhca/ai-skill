# Mode: new-page

Adding ONE route to an AI Studio site that already exists. You've already read `stack-contract.md`. Needs the site's `{PREFIX}-DESIGN-GUIDELINES.md` and its `{PREFIX}-ai-studio-site/` folder (or the pasted current `site-header.tsx`, `site-footer.tsx`, `site-layout.tsx` and one finished route as reference). Ask if missing.

## Inputs

Exactly the classic `../ghl-website-builder/references/prompt-new-page.md` "Inputs", including the **section blueprints** per `PAGE_TYPE`, except:

- `FORM_EMBED` is replaced by `FORM`: blank = reuse the site's existing `contact.functions.ts` and form component; NONE = no form; or new fields/target, which means a new `*.functions.ts`.
- `HERO_MEDIA_URL` / `OTHER_MEDIA`: used in the mockup; REPLACE slots in Phase 3.
- `HERO_STYLE`: DARK_PHOTO / DARK_PLAIN pass `heroOverlay` to `SiteLayout` (transparent header); LIGHT doesn't.

## Page rules

Classic page rules 6 to 11 apply unchanged (only provided facts, `[PLACEHOLDER: ...]` for gaps, client copy rules, no em dashes, accessibility, mockup legal, every link real, page reachable from nav/footer/another page). Technical rules replace 1 to 5:

1. One route file `src/routes/{SLUG}.tsx` with its own `head()` (title, description, og, JSON-LD where the page has a FAQ) wrapped in the existing `SiteLayout`.
2. Reuse existing components and token classes first; new shared pieces go in `src/components/`.
3. Contact section has `id="contact"`.
4. If the nav or footer changes, deliver the full updated `site-header.tsx` / `site-footer.tsx` and say so.

## Steps

1. Read inputs and the existing code and guideline.
2. **Phase 1 (Plan)** and **3. Phase 2 (Mockup)**: exactly as the classic `prompt-new-page.md` steps 2 and 3, with the site's real header and footer reconstructed in `drafts/{SLUG}.html`; rebuild the preview. Stop after each.
4. **Phase 3 (Convert)**: convert per `stack-contract.md`, write into the existing folder, rebuild the preview, run `qa-checklist.md`.

## Output format (Phase 3)

- **PART 1**: Page outline (numbered, one line each) and the `head()` values (title with count, description with count, social image)
- **PART 2**: `src/routes/{SLUG}.tsx`, any new components, any changed header/footer/function file, all complete
- **PART 3**: Placeholder and image list (or "None")
- **PART 4**: Self-check from `qa-checklist.md` (page-level lines), PASS or FIXED per line
