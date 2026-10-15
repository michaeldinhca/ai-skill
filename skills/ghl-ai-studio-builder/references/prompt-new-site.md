# Mode: new-site

Building a brand-new site for GHL AI Studio. You've already read `stack-contract.md`.

## Inputs

Identical to the classic `../ghl-website-builder/references/prompt-new-site.md` "Inputs", with these technical substitutions:

- `FORM_URL` and `FORM_EMBED` are **not used** (AI Studio uses a native form).
- `FORM_FIELDS*`: what the form collects (blank = name, email, phone, message).
- `FORM_TARGET*`: where submissions go: `webhook` (GHL inbound webhook URL kept in env var `CONTACT_WEBHOOK_URL`), `email` (service + env vars), or `log` (testing only).
- `LOGO_URL` / `HERO_MEDIA_URL`: used in the mockup as usual; in Phase 3 they become REPLACE slots per `stack-contract.md` "Images".

Every other field, its meaning, default and the required `*` marks are exactly as in the classic file. Accept a pasted `INPUTS` block in that shape.

## Role

Senior front-end developer, brand designer and conversion copywriter, building a new site that runs in GHL AI Studio.

## Steps

1. Read inputs and attachments. Ask only for missing required fields.
2. **Phase 1 (Plan)** and **3. Phase 2 (Mockup)**: exactly as steps 2 and 3 of the classic `prompt-new-site.md`, saving drafts to `{PREFIX}-ai-studio-site/drafts/` and rebuilding the preview with `../ghl-website-builder/scripts/build_preview.py` (`--name`, `--base-url` first run, `--noindex` for a real identity). Stop after each.
4. **Phase 3 (Convert)**: only once the mockup is approved:
   a. Write `{PREFIX}-DESIGN-GUIDELINES.md` exactly as classic step 4a (tokens, type scale, spacing, components, imagery, motion, copy rules with no-em-dash, font pairing recorded), plus a "Tailwind mapping" section: which token class or variable each design token became.
   b. Convert every draft per `stack-contract.md` "Converting an approved mockup": shared components, one route per page, same look, copy, anchors and motion.
   c. Form: native form + `src/lib/contact.functions.ts` per `FORM_FIELDS` and `FORM_TARGET`, redirecting to `/thank-you`.
   d. Utility routes: `$.tsx` (404), `thank-you.tsx`, `accessibility.tsx`, same layout and tokens as home, not in the nav, accessibility linked in the footer. Content rules from classic `platform-know-how.md` "Utility pages" and `accessibility.md` section 4.
   e. AODA core: `public/aoda-ada.min.js` + `aoda-loader.tsx`, config per `accessibility.md` section 2.
   f. Images: every stock URL becomes a REPLACE slot with its approved source URL listed.
   g. Write everything into `{PREFIX}-ai-studio-site/src/...` and `SETUP.md`, rebuild the preview (drafts stay), and run `qa-checklist.md`. If Node is available, offer to scaffold a scratch TanStack Start project and run `npm run build` against the files; report if you couldn't.

## Output format (Phase 3)

- **PART 1**: Design guideline (`{PREFIX}-DESIGN-GUIDELINES.md`)
- **PART 2**: Token note (light + dark oklch, extra brand variables, font fallback `@font-face`)
- **PART 3**: `__root.tsx` font link edit note
- **PART 4**: Shared components (`site-layout`, `site-header`, `site-footer`, `back-to-top`, `reveal`, `aoda-loader`, any section components)
- **PART 5**: `src/routes/index.tsx`, then one route file per sub page
- **PART 6**: `src/routes/$.tsx` (404)
- **PART 7**: `src/routes/thank-you.tsx`
- **PART 8**: `src/routes/accessibility.tsx`
- **PART 9**: `src/lib/contact.functions.ts`
- **PART 10**: `SETUP.md`: paste order, `public/aoda-ada.min.js` upload, token values, font edit, env vars (`CONTACT_WEBHOOK_URL`), how to test the form end to end
- **PART 11**: Placeholder and image list (every REPLACE slot with its approved mockup source)
- **PART 12**: Self-check from `qa-checklist.md`, PASS or FIXED per line
