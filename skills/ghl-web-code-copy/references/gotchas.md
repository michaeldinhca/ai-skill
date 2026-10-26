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

## Updating a Global Section (header/footer) that already exists
- **The pencil icon in Saved Assets > Global Sections only renames** ("Update This Section"). Do not use it to change code. The section's own save icon says "Section already saved as Global" and does nothing: that is normal.
- **To change a global section:** open ANY page that contains it, click inside the section's Custom HTML/JS element, settings (top-right icon) > Open Code Editor, `ghl_paste.mjs <file> shot body`, Save in the dialog, then **save the page**. GHL shows "Section Changes Made: these changes will sync across other instances where this section is used", click **Save** in that dialog, then **Publish** (the owner's rule: no save + publish, no change live).
- After one page is saved and published, every page that uses the section serves the new code (verified: English and French pages updated within about 60 s without republishing them). Confirm with `check_live.ps1` or by grepping the public HTML for a marker that only the new code has.
- Before changing a global, tell the owner: it changes every page at once. Do it when they say so (this owner wanted the French pages built first, then the globals).
- Paste the header and the footer one after the other; save the page after each if GHL shows the sync dialog twice.

## Site-wide head/body tracking code (Websites > the site > Settings > Tracking & scripts)
- **ALWAYS copy the OLD code out before replacing it.** Sites usually carry other tags there: Google Tag Manager, GA4, Meta pixel, chat widgets, verification meta tags. Overwriting loses them silently and GHL keeps no history.
- Procedure (do all of it, in order):
  1. Read the current value (`eval` on the textarea whose placeholder contains "loaded in the <head>", or `ghl_headcode.mjs read`), save it to `backup/head-<date>.html` outside the repo or in the client's backups folder, and print its length and sha1.
  2. Compare with the code you are about to paste. Anything in the old value that is not in the new file (GTM, pixels, verification tags) must be **merged in**, not dropped. Show the owner the list of kept third-party tags.
  3. Only then set the new value (native setter on the textarea, never typing) and click **Save** at the bottom of the Settings tab (wait for the spinner to end).
  4. Verify on the live HTML (about 60 s later) that your marker is present AND that each third-party tag is still there.
- Body tracking code is a separate textarea: leave it alone unless asked, and back it up the same way before touching it.
- The site-wide head code is NOT the same as a page's Tracking Code (the `</>` icon in the builder, per page). Do not confuse the two.
- A header/footer change can look broken (both languages shown, menus overlapping) until the matching head-code CSS is in place: paste the head code BEFORE or together with global header/footer changes, and check one French and one English page on screen.
