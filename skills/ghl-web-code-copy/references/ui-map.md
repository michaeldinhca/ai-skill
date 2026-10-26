# GHL builder UI map

Fragile: GHL changes its UI. Coordinates are for a 1920x1080 window, page builder open. **Click by text first, coordinates last**, and re-measure from a screenshot when something misses. Update this file when you find that something moved (see `feedback-log.md`).

## Navigation
- Sites > Websites > open the site > pages list. URL pattern: `https://<host>/v2/location/<locationId>/funnels-websites/websites/<websiteId>`
- New page: **Add new page**, name it, set the **path** (slug), then open the builder.

## In the page builder (top bar)
| Control | Where | Notes |
|---|---|---|
| Show Settings (element) | icon at top-right, about 1888,73 | opens settings for the selected element; contains **Open Code Editor** for Custom HTML/JS |
| `</>` Tracking Code | about 152,73 | tabs **Header** / **Footer**; CodeMirror; Save about 1343,792 |
| SEO panel | about 312,73 | Title, Description, Keywords, Author, Images, Links & tags, Language, Schema |
| Save (page) | about 1777,26 | |
| Publish | about 1853,26 | toast "Page published successfully" |
| Saved Assets | left rail, about 66,360 | Global Sections: drag onto canvas |

## Add a code block
1. Click the **+** between sections > Quick Add > search "Rows" > pick a 1-column row.
2. Click **+** inside the row > search "Code" > **Custom HTML/Javascript**.
3. Select the element, **Show Settings** > **Open Code Editor**.
4. `node ghl_paste.mjs <page.html> shot.png body`, then click the dialog's **Save** (about 999,714).
5. Save the page, Publish.

## Head code per page
`</>` > Header tab > `node ghl_paste.mjs <page.html> shot.png head` > Save in the dialog > Save page.

## Media Storage
Sites > Media (or the Media button in image pickers). Upload by file input, then copy the file's link (CDN host `assets.cdn.filesafe.space/<locationId>/media/<id>.<ext>`). The `upload` step of `ghl_do.mjs` is untested: verify the first time.
