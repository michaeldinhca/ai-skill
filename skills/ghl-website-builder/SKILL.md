---
name: ghl-website-builder
description: Build, extend, or fix a client website inside GoHighLevel (GHL) using a tested 4-layer architecture (site-wide CSS, global header, global footer, per-page body) that survives GHL's known quirks — boxed content width, theme CSS leaking into custom code, the builder canvas not running JS, iframe form embeds, etc. Use this whenever the user is building a new GHL client site, adding/replacing a page on an existing GHL site, or debugging a GHL page that looks wrong (boxed/narrow content, wrong fonts or heading colors, broken sticky header, menu not working, form not styled, script "not doing anything" in the editor). Trigger on any mention of GoHighLevel, GHL, HighLevel website/funnel builder, GHL Custom HTML/JS / Custom Code elements, or GHL header/footer/page code — even if the user doesn't name this skill directly.
argument-hint: [new-site|new-page|fix]
---

# GHL Website Builder

A reusable playbook for building any client website in GoHighLevel, distilled from real builds. It exists because GHL has sharp edges (container widths, theme CSS bleed, an editor canvas that doesn't execute JS) that are easy to rediscover the hard way — this skill encodes the fixes so they don't have to be rediscovered.

## Picking a mode

| Mode | When | Read |
|---|---|---|
| `new-site` | Brand-new client site from scratch | `references/prompt-new-site.md` |
| `new-page` | Adding/replacing one page on a site that already has the 4 layers built | `references/prompt-new-page.md` |
| `fix` | Something in existing GHL code looks or behaves wrong | `references/prompt-change-request.md` |

If invoked with an explicit argument (`/ghl-website new-site`, etc.), use that mode directly. If invoked with freeform text and no argument, infer the mode from what's being asked and state the inference in one line before proceeding (e.g. "This sounds like a new page for an existing site — using new-page mode.").

## Before doing anything else

1. **Read `references/platform-know-how.md` first, every time.** It is the hard-won set of platform rules (architecture, CSS scoping, the full-width fix script, header/footer behavior, JS, forms, media, SEO). All three modes depend on it and it does not change per client — but re-read it each invocation rather than relying on memory, since it contains exact code (the full-width script, the CSS shield) that must be reproduced correctly, not paraphrased.
2. **Then read the reference file for the chosen mode.** Each one lists its own required inputs, steps, and exact output format — follow that format, it's been tuned against real GHL delivery.
3. **Gather required inputs before generating anything — do not guess.** Each mode's reference file marks some inputs as required. If the user's message (or an attached `=== INPUTS ===` block, which this skill still accepts verbatim if pasted) is missing a required field, stop and ask only for those missing fields. It's fine to silently fall back to the stated defaults for optional fields — but never invent business facts: proof points, testimonials, certifications, pricing, service areas, or a form embed code. Those get a placeholder and a question, not a guess.
4. **Never invent the visual identity from nothing.** Before proposing colors, fonts, or layout:
   - If the user hasn't attached a logo, brand guideline, existing mockup, or screenshots, ask for at least one of those — or explicit permission to propose an original palette/type pairing (some INPUTS fields default to "propose one" and that's fine once asked-for, but ask first rather than assuming).
   - If a `DOMAIN` or an existing-site URL is given and nothing else is attached, fetch that URL and look at the live site before proposing a design, so choices are anchored to something real rather than generic.
   - For `new-page` and `fix` modes specifically, always work from the client's actual design guideline file and a finished reference page (or current GHL Preview screenshots) — never approximate the existing site's look from description alone.
   - If GHL's own platform behavior is unclear on something `platform-know-how.md` and `references/issue-log.md` don't cover, search for official GoHighLevel documentation or support articles rather than guessing how the platform behaves.

## Build flow: plan, then mockup, then split for GHL

This applies to `new-site` and `new-page` — anywhere you're producing page content, not `fix`. Work in three gated phases, one page at a time. For `new-site` that means the homepage only — don't plan or mock up the rest of the site in the same pass; other pages are separate `new-page` runs later. Never collapse phases into one response or decide on your own to keep going: each phase ends with the user, not with you.

**Phase 1 — Plan (short, text only, no code)**

Propose, in a few lines each:
- Sections for this page (a plain list, e.g. hero / problems / services / proof / process / FAQ / contact)
- Mood (a handful of words, e.g. "confident, industrial, no-nonsense")
- Tone (a handful of words, e.g. "direct, plain-English, a little blunt")

Keep it short — this is a fast alignment check, not the full design guideline. Stop and ask for feedback before writing any code. If the user adjusts something, restate the plan briefly and check again before moving on.

**Phase 2 — Single-file mockup (for review, not for GHL yet)**

Once the plan is approved, build ONE self-contained `.html` file for this page — everything inline (CSS in `<style>`, JS in `<script>`), openable directly in a browser, no GHL splitting yet. For `new-site`, include a real header and footer in this same file so it reads as a finished page. For `new-page`, reconstruct the existing site's real header/footer from its design guideline/reference page so the mockup can be judged on its own, even though only the page body ultimately gets delivered to GHL.

- **Images**: use real, working Unsplash photo URLs (`images.unsplash.com/photo-...`), not placeholder tokens — the point of this phase is that it looks finished enough to react to. Verify a URL actually resolves before using it rather than guessing one.
- **Motion**: where it strengthens the page, add real animation — CSS transitions/keyframes, scroll-reveal, hover states, a considered hero effect. Respect `prefers-reduced-motion`.
- **Video**: where a hero or section would benefit from a background video, source a real, working, free-license video file (e.g. Pexels, Coverr, Mixkit) and embed it with `<video>` — verify it resolves rather than fabricating a link. Don't force video in where it doesn't earn its place.

Deliver the single file, then stop and ask for comments. Iterate on this same single file — not on GHL layers — until it's approved. This is the cheap phase to get wrong; don't rush past it into Phase 3.

**Phase 3 — Split into GHL**

Only once the mockup is approved, split it into the 4-layer GHL structure using the migration procedure in `references/platform-know-how.md` ("When migrating an existing single-file HTML mockup into GHL") — that procedure exists for exactly this handoff, whether the single file came from this skill's own Phase 2 or from something the user handed you directly. Before delivering, flag every Unsplash/stock-video URL carried over from the mockup and ask whether to keep it (it renders fine in GHL — it's just an external image/video URL) or swap it for the client's own Media Library upload. Then follow the mode's own output format in `references/prompt-new-site.md` or `references/prompt-new-page.md` for what to deliver.

## After building

- `references/issue-log.md` — symptom → cause → fix table. Check it whenever something looks broken, and check new work against it before delivering.
- `references/qa-checklist.md` — install order and pre-publish QA checklist. Hand this to the user (or walk through it together) once a `new-site` or `new-page` deliverable is ready to go into GHL.

## Ground rules that apply in every mode

- Every code block ends with the self-check list from that mode's reference file, graded PASS or FIXED per line — fix issues before answering, don't just report them.
- `{PREFIX}` and other `{TOKEN}` placeholders get substituted with the actual client values throughout, including inside code — never leave a literal `{PREFIX}` in delivered code.
- Deliver complete files, not diffs or "...unchanged..." placeholders, except in `fix` mode where only the one changed file is expected.
- Never use an em dash in any client-facing copy: headlines, body text, CTAs, alt text, meta descriptions, everything a site visitor reads. It is one of the clearest tells that text was AI-written, and the whole point of this skill is copy a real client can put in front of real customers without it reading that way. Use a period, comma, colon, or a rewritten sentence instead. This applies in Phase 1 and Phase 2 copy, not only the final Phase 3 files.
