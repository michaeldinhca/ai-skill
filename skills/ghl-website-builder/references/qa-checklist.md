# Install and QA checklist

Hand this to the user (or walk through it together) once a `new-site` or `new-page` deliverable is ready to go into GHL.

All paths below are relative to the site's `{PREFIX}-ghl-site/` project folder. See `SKILL.md`'s "Delivery" section for the full layout.

## Install order for a new site

1. Website Settings > Tracking Code > Header: paste `global/01-site-head-code.html`.
2. Header global section: one Custom HTML/JS element with `global/02-global-header.html`. Delete old header elements.
3. Footer global section: same with `global/03-global-footer.html`.
4. Homepage: one section with one Custom HTML/JS element containing `pages/home.html`. Set the homepage path to `/` and redirect `/home`.
5. 404 page: create a page with `pages/404.html`, then Settings > Domains > the domain's three-dot menu > Edit > set it as that domain's 404/Error page.
6. Thank you page: create a page with `pages/thank-you.html`, not linked in nav. Then in the form builder: gear icon > Options tab > On Submit > redirect to this page's full published URL.
7. Page settings on every page: SEO title, meta description, social image from the design output's page-settings parts.
8. Form builder: open the form itself (not the site or page) and paste `global/04-form-custom-css.css` into its Styles panel, Custom CSS field. Chat widget: match the brand colours.
9. Upload media to the Media Library and replace every image token with its URL.

## QA before publishing (always in Preview, never the builder canvas)

- Content runs edge to edge, no white strips at top or sides.
- Header transparent over a dark hero, solid after scroll and on light pages. Logo visible.
- Mobile menu opens, closes on link tap and Escape.
- Menu anchors scroll on the homepage without reloading.
- Hero image or video loads. Paste each media URL into a new tab to confirm.
- Form matches the site: no white card, focused field border is the accent colour, checkbox is styled (not the native square) both unchecked and checked, submit button label is readable, privacy/terms links are readable.
- Test form submission lands in the CRM, triggers the workflow, and redirects to the thank you page (not an inline message).
- Visit a URL that doesn't exist on the domain: the branded 404 page loads, not GHL's default error page.
- Chat opens and does not cover the back-to-top button.
- Check 375px, 800px and 1440px widths. No sideways scroll.
- Scroll through slowly once: scroll-triggered animations only play when their section is on screen, so full-page screenshots can look "unfinished".
