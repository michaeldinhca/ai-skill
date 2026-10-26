# Page file format

One file per page, so that "copy this page into GHL" is mechanical. This is the format `ghl_paste.mjs` and `ghl_verify.mjs` expect, and what `ghl-website-builder` should emit for its GHL split. If the repo uses another layout, either convert it or give the scripts a file in this shape.

```html
<!-- GHL PAGE SETTINGS
Page name: Careers
Slug: careers                      (French copy: fr/careers)
SEO title (52): Careers | Example Inc
Meta description (148): ...
Social image: https://assets.cdn.filesafe.space/<locationId>/media/<id>.jpg
Page header code: paste the block between HEAD-CODE-BEGIN and HEAD-CODE-END into  </> Tracking Code > Header
HEAD-CODE-BEGIN
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="alternate" ...>   (may be stripped: see gotchas)
<meta name="geo.region" content="CA-QC">
<script type="application/ld+json">{...}</script>
  HEAD-CODE-END
SEO panel > Links & tags > Canonical links > Add: https://example.com/careers
Indexing: normal
-->
<div class="x x-page page-careers" lang="en">
  <style>...</style>
  ...markup...
  <script>...</script>
</div>
```

Rules:
- The settings comment comes first and contains no `--` inside it.
- Everything after the comment is the exact code pasted into the page's Custom HTML/JS element (the `body` mode strips the comment).
- `HEAD-CODE-BEGIN` / `HEAD-CODE-END` markers are on their own lines.
- Site-wide code lives in separate files (head code, global header, global footer, form CSS) and is pasted the same way (`body` mode, no comment needed).
- Keep each block under GHL's practical size limit; check that save really succeeded with `ghl_verify.mjs`.
