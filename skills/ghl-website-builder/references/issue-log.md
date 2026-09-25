# Issue log

Symptom, cause, fix — from real builds. Check this before diagnosing a "looks wrong" report from scratch, and check new work against it before delivering.

| Symptom | Cause | Fix |
|---|---|---|
| Page boxed at about 1170px, white margins | GHL row max-width and padding around custom code | Full-width script in header, footer and every page body |
| White strip at top, header text invisible | GHL section padding pushes the hero down under a transparent header | Same full-width script (clears vertical padding up to the section) |
| Headings dark or wrong font inside custom blocks | GHL theme styles h1-h3, p, a directly | Shield block in master CSS, all selectors scoped |
| Nav or headline lost uppercase after adding a reset | Reset used `text-transform:none` | Use `inherit` in the shield |
| Hero shows only the dark overlay | Relative image path or unreplaced image token | Media Library URL, test it in a new tab |
| Form looks unstyled or does not match | GHL form is an iframe, site CSS cannot reach inside | Style it in the GHL form builder |
| Back-to-top hidden behind chat bubble | Both bottom-right | Back-to-top bottom-left |
| Code "does nothing" in the editor | GHL builder canvas does not run custom JS | Check in Preview or live |
| Menu links reload the homepage | Homepage served at /home while links point to "/#id" | Homepage at "/", redirect /home, link rewrite script |
| Fixed header scrolls away or misplaces | A GHL ancestor has a CSS transform | Full-width script clears transforms on ancestors |
| Script error breaks the page | Top-level const/let names collide with GHL scripts | Wrap every block in an IIFE |
| Sizes slightly off vs mockup | rem depends on GHL root font size | Convert rem to px |
| Saved page source is huge and unreadable | Saved as "Webpage, Single File" (.mhtml) | Save as "Webpage, HTML Only", or DevTools > copy outerHTML |
| GHL editor slow or code cut off | Very large code element | Keep under 60 KB or split style+markup and script into two elements |
