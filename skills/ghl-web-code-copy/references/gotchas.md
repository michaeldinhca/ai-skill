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

## Creating pages
- **NEVER clone / duplicate a page** (the ⋮ menu > Clone). GHL copies the page's metadata badly and the clone has errors. **Every page is created with "Add new page"** (name + path), then its code is pasted in. A clone is also live immediately under a throwaway path like `/fr/thank-you-892827`. (owner rule, learned the hard way)
- Add global header/footer and the code element to each new page by hand; it is slower, but correct.

## Publishing
- **New pages are live the moment they are created** at their path. Name and slug first, work after; consider setting robots noindex in the page head until the page is done.
- Published pages are cached about 60 s. A stale result right after Publish usually means wait and retry. `check_live.ps1` adds a cache-busting query.
- Nested slugs work (`fr/thank-you`).

## Process
- Do pages **one at a time**: paste, save, verify, publish, check live, screenshot. Never batch ten pages before looking at one.
- Take a **screenshot after every click that changes state** and look at it. Silent failures are the norm.
- Do not guess coordinates twice: one miss, take a fresh screenshot.
- Leave to the owner anything involving payment, account security, DNS, or deleting things.

## Coordinates
- Screenshots are in device pixels; mouse clicks are CSS pixels. When the browser zoom / Windows scale is not 100% (devicePixelRatio 1.25) every coordinate read from a screenshot is off by that factor. `ghl_do.mjs` `clickxy` now divides by devicePixelRatio. The scale can change mid-session (window moved to another monitor): check with an eval of `devicePixelRatio` when clicks miss. (verified)

## Builder timing and clicks (learned on the second session)
- **Toolbar icons (+, SEO, </>) often need a second click**: the first click after working in the canvas or a dialog only shows the tooltip. Click, wait 2.5 s, check the panel's text with an `eval` (e.g. `document.body.innerText.includes('Quick Add')`); click again only if it is not open. Do not click blindly twice: the second click closes it when the first one worked.
- **Use `set` (not `fill`/`type`) for SEO Title, Description and the canonical URL.** Typing makes the panel re-lay out (the Preview box grows) and the next click lands on the wrong field. `set` writes the value with the native setter, immune to layout shifts. Collapsed sections change position between pages: click section titles by position from a fresh screenshot, then verify with an `eval` of the page text.
- **SEO limits (owner rule):** title under 70 characters, description at most 154 characters (GHL flags 155+ with a warning "Description is under 155 characters"). Check ALL page files before pasting; also update the copy inside the JSON-LD block.
- **Page card flow:** Add new page > name + path (no leading slash needed, nested `fr/careers` works) > Create new page > the new card shows "Use existing / Create from blank" (scroll the list to see it) > Create from blank > wait about 16 s for the builder.
- **New page canvas:** close the Ask AI panel, "Blank Section", + > "1 Column" row, click the column once, + > search "Custom" > "Code", then the top-right settings icon > "Open Code Editor".
- **Order that worked per page (about 12 tool calls once the flow is known):** paste body, Save dialog, Save page, SEO panel (title, description, language `fr-ca`, canonical), Tracking Code header paste, Save, drag global header (above) and footer (below), Save page, Publish, wait 60 s, `check_live.ps1`.
- **hreflang `<link rel="alternate">` does not survive** (stripped from head code); not yet solved. `check_live.ps1` shows it missing.
- **No og:image appears until the SEO panel Images field is set** (upload the share image to Media Storage first).
- `ghl_do.mjs` `eval` returning nothing used to crash the runner; fixed. A PowerShell-written `steps.json` had a BOM that broke JSON parsing; the runner now strips it.
