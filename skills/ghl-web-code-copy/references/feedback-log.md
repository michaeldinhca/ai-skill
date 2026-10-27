# Feedback and improvement log

This skill gets better only if each chat that uses it writes down what it learned. **Append an entry here at the end of every use**, even if everything worked ("no change" entries are useful: they show which steps are solid).

## How to add an entry
1. Copy the template below to the end of the "Entries" section.
2. Be concrete: the exact text/button/coordinate that failed, the error, the fix that worked.
3. If the fix is general, **also edit the real file** (`gotchas.md`, `ui-map.md`, a script, or `SKILL.md`) in the same commit and mention it in "Applied".
4. Do not put client secrets, API keys or passwords here. Names of clients are fine only if the owner is OK with it; prefer "client A".
5. Commit with message `ghl-web-code-copy: feedback <date> <short topic>` and push (pull --rebase first).

If you cannot push, show the entry to the user so they can paste it into the repo.

## Template
```
### YYYY-MM-DD  <site type / what was copied>
- Worked:
- Failed or slow (exact symptom):
- Fix / workaround:
- Proposed improvement (script, doc, or step):
- Applied: yes (file) / no
- GHL UI version noticed (if the UI looked different):
```

## Entries

### 2026-10 first use: bilingual (EN + fr-CA) construction company site, about 10 pages
- Worked: Chrome/Edge with remote debugging, real-mouse clicks by text, CodeMirror `setValue` + sha1 check, dragging global sections, SEO panel fields, Publish, `check_live.ps1` after 60 s.
- Failed: JS `.click()`; clicking hidden code editor wrapper closed the dialog; clicking a global section did nothing (drag needed); Publish was forgotten once, the live page looked unchanged; `<link>` tags (canonical, hreflang, fonts) stripped from head code; head scripts ran late and flashed the loader.
- Fix: all of the above are in `gotchas.md`.
- Proposed improvement: test whether hreflang can survive via SEO panel "Custom meta tags"; test `upload` step in `ghl_do.mjs`; add a script that sets SEO panel fields from the "GHL PAGE SETTINGS" comment.
- Applied: yes (gotchas.md, scripts)

### 2026-10-26 second session: French pages (home, careers, accessibility, 404) in GHL
- Worked: Add new page flow, ghl_paste (88 KB home page body matched sha1), `set` step for SEO fields, drag global header/footer, Publish, check_live (all four pages live with correct lang, title, description, canonical, geo, noindex on 404).
- Failed or slow: cloning a page (owner forbids; metadata errors); screenshots were in 1.25x device pixels so clicks missed until `clickxy` divided by devicePixelRatio; toolbar icons needed a second click; typing SEO fields broke when the panel re-laid out; descriptions over 154 chars flagged by GHL.
- Fix / workaround: see gotchas.md sections Coordinates, Creating pages, Builder timing.
- Proposed improvement: one `ghl_page.mjs` script that does the whole per-page flow from a page file (create page, paste, SEO, head code, globals, publish, live check); script to set the Images (share image) field; test whether hreflang can go in "Custom meta tags".
- Applied: partly (ghl_do.mjs: DPR scaling, `set`, key chords, BOM, eval fix; ghl_drag.mjs: DPR scaling).

### 2026-10-26 global header and footer replaced with bilingual versions
- Worked: editing the code inside the global section from an open page, `ghl_paste.mjs` hash match, "Section Changes Made" dialog Save, Save page, Publish; all pages (EN and FR) showed the new header and footer after about 60 s.
- Failed or slow: clicked the pencil icon first (it only renames); clicked the section's save icon (says already saved as Global); my first Save/Publish clicks after the dialog did not register because the sync confirmation dialog was in the way.
- Fix / workaround: see gotchas.md "Updating a Global Section".
- Proposed improvement: script that, after pasting, detects and confirms the "Section Changes Made" dialog before saving and publishing.
- Applied: yes (gotchas.md, SKILL.md).

### 2026-10-26 site-wide head code replaced
- Worked: replacing the head tracking code with `01-site-head-code.html`, live check for the `[data-l` language rules; the broken bilingual header (menus overlapping) was fixed by it.
- Failed or slow: I overwrote the old head code without backing it up first (the owner stressed sites often hold Google Tag Manager and tracking scripts). It turned out the old value equalled an earlier revision of our own file (git revision with identical length), so nothing was lost, but that was luck.
- Fix / workaround: see gotchas.md "Site-wide head/body tracking code": back up, diff, merge, then paste, then verify.
- Proposed improvement: `ghl_headcode.mjs read|write` script that saves the backup, shows the diff and refuses to write if third-party tags would be dropped.
- Applied: yes (gotchas.md).

### 2026-10-26 French forms (inquiry + career), Zone de service rename, mid-width header
- Worked: Duplicate form, inline translation with `setafter`, message-type On Submit, preview in a throwaway headless browser to check rendering, live check of embedded form ids.
- Failed or slow: first tried the page-builder iframe selectors in the form builder; page list order shifted after earlier edits so a fixed click opened the wrong page (English 404; nothing changed). Always confirm the page name (eval on page text) before pasting.
- Proposed improvement: `ghl_do.mjs` `expect` step that aborts the run when the open page's name is not the intended one; a `ghl_form_translate.mjs` that takes a JSON of labels.
- Applied: partly (ghl_do.mjs: form-builder iframe, setafter).

### 2026-10-26 English pages, share images, hreflang, Lighthouse agent audits
- Worked: media upload via hidden input; `ghl_seo.mjs`; JS-created hreflang; per page flow in about 10 calls; a verify script over all 10 URLs (title/description length, canonical, og:image, hreflang count, header/footer).
- Failed or slow: bulk image-URL replace hit body photos (reverted); PowerShell alias clash (`Rd`) sent empty SEO values (caught before saving); canonical "already present" false positive; card lookup missed one name.
- Proposed improvement: a `ghl_page.mjs` that runs the whole per-page flow; `expect` step to abort when the open page is not the intended one; check_live.ps1 should render with a headless browser to see JS-created tags.
- Applied: yes (gotchas.md, ghl_seo.mjs).

### 2026-10-27 llms.txt via Edit Domain, shared Edge window
- Worked: Settings > Domains & URL Redirects > Manage > ⋮ > Edit; native-setter fill of the llms.txt textarea (1833 chars); Save; live `/llms.txt` after under a minute.
- Failed or slow: `/settings/domains` URL redirects to the site list (correct path is `/settings/domain`); my own debug window died (port refused) so I had to use the shared Edge on 9333; scripts attach to the first crmbright tab, which was another session's.
- Fix / workaround: gotchas.md (llms.txt/robots.txt corrected, shared browser note).
- Proposed improvement: `GHL_TAB_MATCH` env var (URL substring) honoured by all scripts so sessions can share one browser; `ghl_domain_txt.mjs`.
- Applied: yes (gotchas.md); script improvement open.
