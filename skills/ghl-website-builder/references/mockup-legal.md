# Mockup legal safety (required on every mockup)

Most mockups here are made for a business that has not hired us yet, and they get published on a public mockup host. Using that business's real name, logo, contact details, photos or project work without permission invites a legal complaint (trademark, copyright, passing off, implying an endorsement that doesn't exist). So a mockup never looks like the real business's official site.

**A mockup is anything built before the user has confirmed the business approved using its real identity:** every Phase 2 draft, and any Phase 3 split made from one. When in doubt, it's a mockup.

## The five rules

1. **Change the business name and logo wherever possible.** Invent a clearly different name in the same spirit (never a near-copy or a misspelling of the real one) and use a text wordmark or an original simple mark. Never place their real logo. Use the mock name everywhere a visitor or the mockup host shows it: page titles, headings, copy, footer, alt text, JSON-LD, the design guideline heading and `site.json` (pass `--name` to `build_preview.py`).
2. **Address:** always `001 NoWhere Avenue, ON, G5G 0R0, Canada`.
3. **Phone:** always `+1 999-999-9999` (`tel:+19999999999`).
4. **Email:** always `info@mockup.ngynsolutions.com`.
5. **Only free, publicly licensed photos and video** (Unsplash, Pexels, Coverr, Mixkit). Never use the business's own photos, videos, project galleries, case studies or portfolio pieces, and never hot-link media from their site or their host.

The same reasoning covers things the five rules don't name. In a mockup, do not reuse the real business's testimonials, reviews or ratings, staff or owner names and photos, client names, licence or certification numbers, awards, or the wording of their existing pages. Write original copy; show proof sections with obviously generic placeholder content, or leave them as marked placeholders.

These fixed values replace the usual "ask, never invent" rule **for mockups only**: a mockup doesn't ask for the real phone, address or email, and doesn't leave them blank. The accessibility config and statement page use the same mock email, phone and address.

## Indexing

Mockups with the mock identity are published to be indexed by search engines (`references/seo-geo.md`). That is only safe because nothing on them points at a real business. **A site that shows a real business's name, logo or contact details, even with the user's confirmation, is built with `--noindex`** unless the user explicitly asks for it to be indexed: an indexed page under someone else's business name competes with them in search results.

## Looking at the real site is fine; copying from it is not

Reading the business's current site to understand what they do, who they serve and what a better site would need is fine and expected. Taking anything from it into the mockup is not: logo, images, video, copy, project details, names, numbers.

## If a prompt asks for the real thing

When the user (or an inputs block) asks for the real logo, real business name, real contact details, real photos, or real projects in a mockup:

1. **Stop and ask again before doing it.** Say plainly that it's a legal risk: the mockup will be public, and using a business's name, logo or work without its permission can bring a trademark or copyright complaint.
2. Name exactly what was asked for (e.g. "their real logo and the three project photos from their gallery") and ask the user to confirm they have the business's approval or accept the risk.
3. **Only proceed after an explicit yes.** A real logo attached to the message, or a real name in the inputs, is not a confirmation by itself. Confirmation covers only the items named, not everything else.
4. Record it: add a line to the design guideline and `SETUP.md` saying which real assets are used and that the user confirmed it, with the date.

## Going live for a real client

When the user confirms the business is now a client and the site is going live with its real identity, every mock value has to go. `build_preview.py` prints a notice and sets `"mock": true` in `site.json` while any of the mock address, phone or email is still in the files, which is correct for a mockup and a blocker for a live site. Before a live handover: replace the mock name, logo, address, phone and email with real ones supplied by the user, swap stock media as agreed, rebuild, and confirm the notice is gone.
