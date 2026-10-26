# Gotchas (things that failed, and the fix)

Newest lessons go at the bottom of each section. Verified = seen working on a real GHL site.

## Browser control
- **`element.click()` from JS is ignored** by the builder. Use real mouse events (`page.mouse.move/down/up`), which `ghl_do.mjs` does. A modal may appear only after a full down+up. (verified)
- **The builder lives in an iframe** (`page-builder.leadconnectorhq.com`). Mouse coordinates are for the top page, so add the iframe's offset. `ghl_do.mjs` does it. (verified)
- Use a **separate browser profile** with `--remote-debugging-port=9222`. The user logs in; never ask for, type or store their password. (verified)
- Prefer clicking by **visible text**. Pixel coordinates in `ui-map.md` are for a 1920x1080 window and break when the window or the GHL UI changes.

## Code editors
- The code editor is **CodeMirror 5**. Typing into it mangles code (auto-close tags, auto-indent). Set the value with `cm.setValue(text)` (`ghl_paste.mjs`). (verified)
- Several `.CodeMirror` nodes exist; hidden ones are 0x0. Clicking the hidden `.hl-custom-code-editor` wrapper **closes the dialog**. Pick the visible one only. (verified)
- After Save in the dialog, **also save the page** (the page-level save icon), then **Publish**. Save is not Publish. (verified)
- Always run `ghl_verify.mjs` after saving: it re-reads what GHL stored.

## Page code
- A page's body code goes in a **Custom HTML/Javascript element**, inside a Row. The row/section/column paddings must be 0 for full width.
- **Scripts in element blocks run when the page is parsed; scripts in the head/tracking code run late.** Anything that must run before first paint (for example a loader switch) goes in the FIRST block of the global header, not in head code. (verified)
- **GHL strips `<link>` tags** from the site and page head code (the Google Fonts `<link>` was rewritten without its href; `rel=canonical` and `rel=alternate hreflang` do not survive). Use the SEO panel for canonical. Host fonts (woff2 on the GHL media CDN) and load them with `@font-face` in the header block instead. (verified)
- `<meta>` tags and JSON-LD pass through. GHL itself adds og:title, og:description, og:image and the twitter card from the SEO panel; don't duplicate them in head code. (verified)
- Do not put `--` inside the `<!-- GHL PAGE SETTINGS ... -->` comment of the page file: it ends the comment early.

## Global header / footer
- Clicking a Global Section in Saved Assets does nothing. **Drag it** onto the canvas (header above the content, footer below), `ghl_drag.mjs`. (verified)
- The header and footer must be added to **every page**, including new ones, or they show up bare. Check with `check_live.ps1`.

## SEO panel
- Fields: Title, Description, Keywords, Author, Images (URL), Links & tags (Custom meta tags, Canonical links), Language (searchable select, "fr-ca - French (Canada)"), Schema markup.
- Canonical goes here, not in the head code (see `<link>` above).
- Social image must be a **URL** (upload to Media Storage first, then paste the CDN link).

## Publishing
- **New pages are live the moment they are created** at their path. Name and slug first, work after; consider setting robots noindex in the page head until the page is done.
- Published pages are cached about 60 s. A stale result right after Publish usually means wait and retry. `check_live.ps1` adds a cache-busting query.
- Nested slugs work (`fr/thank-you`).

## Process
- Do pages **one at a time**: paste, save, verify, publish, check live, screenshot. Never batch ten pages before looking at one.
- Take a **screenshot after every click that changes state** and look at it. Silent failures are the norm.
- Do not guess coordinates twice: one miss, take a fresh screenshot.
- Leave to the owner anything involving payment, account security, DNS, or deleting things.
