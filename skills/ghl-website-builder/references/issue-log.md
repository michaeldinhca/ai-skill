# Issue log

Symptom, cause, fix — from real builds. Check this before diagnosing a "looks wrong" report from scratch, and check new work against it before delivering.

| Symptom | Cause | Fix |
|---|---|---|
| Page boxed at about 1170px, white margins | GHL row max-width and padding around custom code | Full-width script in header, footer and every page body |
| White strip at top, header text invisible | GHL section padding pushes the hero down under a transparent header | Same full-width script (clears vertical padding up to the section) |
| Headings dark or wrong font inside custom blocks | GHL theme styles h1-h3, p, a directly | Shield block in master CSS, all selectors scoped |
| Nav or headline lost uppercase after adding a reset | Reset used `text-transform:none` | Use `inherit` in the shield |
| Hero shows only the dark overlay | Relative image path or unreplaced image token | Media Library URL, test it in a new tab |
| Form shows a white card and default blue button on a dark site | GHL form is an iframe, site CSS cannot reach inside | Paste the form skin (`05-form-custom-css.css`) into that form's own Styles panel, Custom CSS field |
| Field border stays blue on hover/focus despite an `!important` override | GHL's own rule `#_builder-form .form-builder--item input[type="text"][class="form-control"]:focus` (specificity 1,4,1) wins | Use the heavier `html body #_builder-form .form-builder--item input.form-control[class]:focus` pattern (1,4,3) from `form-skin-template.css` |
| Submit button text stays white after setting the button's colour | The label colour is an inline style on an inner div, not the button | Target `button.button-element *` with `!important`, not just the button |
| Consent checkbox is a plain white square | Native browser checkbox control, unstyled | `appearance:none` with a dark box and an accent, checked-state background image |
| Form panel is empty or collapsed to about 50px in Preview | Placeholder or wrong form ID; `form_embed.js` hides the iframe until a real form loads | Use the real form URL and its 20-character form ID, not a placeholder |
| Form fails to load, or loads a different form, on a white-label account | Embed built against the wrong host | Build the iframe `src` and `form_embed.js` `src` from the host in the client's own form URL, not `msgsndr.com`/`leadconnectorhq.com` by default |
| Back-to-top hidden behind chat bubble | Both bottom-right | Back-to-top bottom-left |
| Code "does nothing" in the editor | GHL builder canvas does not run custom JS | Check in Preview or live |
| Menu links reload the homepage | Homepage served at /home while links point to "/#id" | Homepage at "/", redirect /home, link rewrite script |
| Fixed header scrolls away or misplaces | A GHL ancestor has a CSS transform | Full-width script clears transforms on ancestors |
| Script error breaks the page | Top-level const/let names collide with GHL scripts | Wrap every block in an IIFE |
| Sizes slightly off vs mockup | rem depends on GHL root font size | Convert rem to px |
| Saved page source is huge and unreadable | Saved as "Webpage, Single File" (.mhtml) | Save as "Webpage, HTML Only", or DevTools > copy outerHTML |
| GHL editor slow or code cut off | Very large code element | Keep under 60 KB or split style+markup and script into two elements |
