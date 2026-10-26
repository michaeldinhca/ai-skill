---
name: ghl-web-code-copy
description: Copy finished website code (head code, global header/footer, page bodies, per-page SEO settings, share images) into a GoHighLevel (GHL) site by driving a logged-in browser the user controls, then prove each page is saved, published and live. Use this when the user has a site's code ready (for example from ghl-website-builder) and wants Claude to "put it into GHL", "create the pages in GHL", "paste the code", "publish the pages", "set the SEO fields", or "upload the share images", or when a GHL copy session needs the known workarounds for the page builder. Also use it at the start of any such session to record lessons in its feedback log. Trigger on GHL page builder automation, Tracking Code, Custom HTML/JS element, Global Section, Saved Assets, GHL SEO panel.
argument-hint: [setup|copy-site|copy-page|seo|media|verify|feedback]
---

# GHL Web Code Copy

Moves prepared code into GHL and verifies it, with the user watching and logged in. Companion to `ghl-website-builder` (which makes the code). Every step was learned on a real site; the workarounds are in `references/gotchas.md`.

## Ground rules
1. **The user logs in; you drive.** Open a separate browser profile with the debug port; never ask for, type or store passwords. A GHL API key is not needed and the builder cannot be done by API anyway.
2. **Ask before starting** (one question, not many): which site/location URL, which pages in which order, and which things the owner keeps for themselves (forms, redirects, DNS, favicon, deleting anything).
3. **One page at a time, with proof.** Paste, Save (dialog), Save (page), Publish, `check_live.ps1`, screenshot. Show the user what you saw. Never claim "done" without the live check.
4. **Never clone a page.** Every page is made with "Add new page". Clones carry broken metadata.
5. **New pages are live immediately.** Create them with the final slug and finish them promptly.
5. **Don't change what you weren't asked to.** No deleting pages, no replacing existing pages' content without telling the user which page and what will be lost.
6. Log what you learn (see Feedback).

## Setup (once per session) - mode `setup`
```powershell
cd <skill>/scripts
npm install                                  # puppeteer-core only, once
./launch-browser.ps1 -Url "<GHL pages list URL>"   # user logs in in that window
node ghl_probe.mjs                           # confirms the connection and the builder state
```
Portable Node is fine if Node is not installed. All scripts read `GHL_DEBUG_URL` (default `http://127.0.0.1:9222`).

## Tools
| Script | Purpose |
|---|---|
| `scripts/launch-browser.ps1` | start Edge/Chrome with remote debugging and a throwaway profile |
| `scripts/ghl_probe.mjs` | list tabs/frames, visible editors and dialogs; run when anything does nothing |
| `scripts/ghl_do.mjs steps.json` | generic runner: goto, wait, click (by text), clickxy, fill, type, press, eval, text, shot, upload |
| `scripts/ghl_paste.mjs file shot [body\|head]` | load code into the OPEN code editor via CodeMirror and sha1-check it |
| `scripts/ghl_verify.mjs file [body\|head]` | after saving, compare what GHL stored with the file |
| `scripts/ghl_drag.mjs x1 y1 x2 y2 shot` | real-mouse drag (Global Sections onto canvas) |
| `scripts/ghl_headcode.mjs read/write` | site-wide head code: backs up the old value, refuses to drop GTM/pixel tags, then sets the new one |
| `scripts/ghl_seo.mjs page-file` | fills SEO panel Title/Description/Images/canonical from the page file, enforces length limits |
| `scripts/check_live.ps1 -Url ...` | what the published page outputs: lang, title, meta, canonical, og, duplicates |
| `scripts/share_card.mjs spec.json out/` | 1200x630 share images with headline from brand assets |

Formats: `references/page-file-format.md`. UI map: `references/ui-map.md`.

## Workflow - mode `copy-site`
Default order (confirm with the user):
1. **Site head code** (Website Settings > Tracking & scripts > Head tracking code). **Back up the OLD value first and merge any GTM/pixel/verification tags** (gotchas: Site-wide head/body tracking code). Keep to what survives: no `<link>`.
2. **Global header and footer**: change the code through any page that contains them (not the pencil icon, see gotchas: Updating a Global Section), Save the sync dialog, Save page, Publish. New pages get them by dragging from Saved Assets > Global Sections. Only touch existing globals when the owner says so.
3. **Pages**, one at a time: create page + slug, add Row + Custom HTML/JS element, paste body, add global header above and footer below, Save.
4. **Per page SEO**: SEO panel (title, description, social image URL, language, canonical), then page Header code from `HEAD-CODE-BEGIN..END`.
5. **Publish**, wait about 60 s, `check_live.ps1` (and on a phone-size screenshot if the user asks).
6. **Media**: upload images to Media Storage, collect the CDN links, update the code/SEO image fields. Share images: `share_card.mjs`, 1200x630.
7. Report in a table: page, URL, saved, published, live check result, open issues.

Mode `copy-page` is steps 3 to 5 for one page. Mode `seo` is step 4 only. Mode `verify` is `check_live.ps1` plus `ghl_verify.mjs` on everything.

## When something does nothing
Screenshot, `ghl_probe.mjs`, re-read `references/gotchas.md`. One retry with fresh coordinates, then ask the user to do that click and carry on; note it in the feedback log.

## Feedback and improvement (do this at the end of every use)
Open `references/feedback-log.md`, add an entry with what worked, what failed (exact symptom), the fix and a proposed improvement. If the lesson is general, also fix the real file (`gotchas.md`, `ui-map.md`, a script, or this file) in the same commit. Then pull --rebase and push the repo, or show the entry to the user to paste. Also invite the user once: "anything about this process you want changed?" and log their answer. Check the log at the start of a session: unresolved "Proposed improvement" lines are the backlog.
