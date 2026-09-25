# Install and QA checklist

Hand this to the user (or walk through it together) once a `new-site` or `new-page` deliverable is ready to go into GHL.

## Install order for a new site

1. Website Settings > Tracking Code > Header: paste `01-site-head-code.html`.
2. Header global section: one Custom HTML/JS element with `02-global-header.html`. Delete old header elements.
3. Footer global section: same with `03-global-footer.html`.
4. Homepage: one section with one Custom HTML/JS element containing `04-homepage-body.html`. Set the homepage path to `/` and redirect `/home`.
5. Page settings: SEO title, meta description, social image from the design output's page-settings part.
6. Form builder: apply the style values from the setup steps. Chat widget: match the brand colours.
7. Upload media to the Media Library and replace every image token with its URL.

## QA before publishing (always in Preview, never the builder canvas)

- Content runs edge to edge, no white strips at top or sides.
- Header transparent over a dark hero, solid after scroll and on light pages. Logo visible.
- Mobile menu opens, closes on link tap and Escape.
- Menu anchors scroll on the homepage without reloading.
- Hero image or video loads. Paste each media URL into a new tab to confirm.
- Test form submission lands in the CRM and triggers the workflow.
- Chat opens and does not cover the back-to-top button.
- Check 375px, 800px and 1440px widths. No sideways scroll.
- Scroll through slowly once: scroll-triggered animations only play when their section is on screen, so full-page screenshots can look "unfinished".
