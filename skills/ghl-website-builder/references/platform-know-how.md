# GHL Platform Know-How

Hard rules, learned from real builds. This file doesn't change per client — read it in full before generating or editing any code in any mode. `{PREFIX}` below means the client's PREFIX value; substitute it everywhere, including inside code.

## Architecture

4 layers, always:

- **L1 Master CSS + fonts**: GHL Website Settings > Tracking Code > Header (site-wide). Light: tokens, base, shared components, header, footer. No page-specific CSS.
- **L2 Header**: one Custom HTML/JS element inside the GHL header GLOBAL section.
- **L3 Footer**: one Custom HTML/JS element inside the GHL footer GLOBAL section.
- **L4 Page body**: one Custom HTML/JS element per page, in its own section, between header and footer. Contains page CSS, markup, page JS, and JSON-LD.

Page title, meta description and URL slug are set in GHL page settings, never in code. JSON-LD may sit in the body code.

Forms and chat stay GHL-native (they sync to the CRM). Forms are embedded with GHL's iframe embed code. The chat widget is installed site-wide from GHL.

## Scoping

GHL theme CSS leaks in, and our CSS must not leak out.

- Every block is wrapped in a root element with class `{PREFIX}` plus one of `{PREFIX}-header`, `{PREFIX}-page`, `{PREFIX}-footer`.
- Every CSS selector starts with `.{PREFIX}`. Never style `body`, `html`, `*`, `:root`, `h1`, `p`, `a` on their own. Put design tokens (CSS variables) on `.{PREFIX}`, in ONE block at the top of the master CSS.
- Page CSS is additionally scoped under `.page-<slug>`.
- Use `px`, not `rem` (GHL may change the root font size).
- Include this shield at the top of the master CSS (GHL heading colours, fonts and margins otherwise override ours):

```css
.{PREFIX},.{PREFIX} *{box-sizing:border-box}
.{PREFIX} :where(h1,h2,h3,h4,h5,h6,p,ul,ol,li,a,span,strong,em,dt,dd,dl,address,label,blockquote){color:inherit;font-family:inherit;text-transform:inherit}
.{PREFIX} :where(p,li,a,span,dt,dd,address,label,blockquote){font-size:inherit;line-height:inherit;letter-spacing:inherit;font-weight:inherit}
.{PREFIX} :where(h1,h2,h3,h4,h5,h6,p){margin:0}
.{PREFIX} a{text-decoration:none}
```

Use `inherit` in the shield, never `none` or fixed values, or inherited styles such as uppercase navigation break.

## Full width

GHL boxes custom code at about 1170px with padding, and adds hidden sibling elements. Do not rely on GHL section settings. Include this exact script in the header, the footer AND every page body (inside the block's IIFE). It is tested — reproduce it exactly, don't paraphrase it:

```js
function fullWidthFix() {
  var P = '{PREFIX}';
  var vw = document.documentElement.clientWidth;
  document.querySelectorAll('.' + P + '-header, .' + P + '-page, .' + P + '-footer').forEach(function (root) {
    var el = root.parentElement;
    while (el && el !== document.body && el !== document.documentElement) {
      ['padding-top','padding-bottom','margin-top','margin-bottom'].forEach(function (p) { el.style.setProperty(p, '0', 'important'); });
      el.style.setProperty('min-height', '0', 'important');
      el.style.setProperty('overflow', 'visible', 'important');
      el.style.setProperty('transform', 'none', 'important');
      var id = el.id || '', cls = typeof el.className === 'string' ? el.className : '';
      if (el.tagName === 'SECTION' || /^section-/.test(id) || /(^|\s)(c-section|fullSection)(\s|$)/.test(cls)) break;
      el = el.parentElement;
    }
    root.style.setProperty('margin-left', '0', 'important');
    root.style.setProperty('width', vw + 'px', 'important');
    root.style.setProperty('max-width', 'none', 'important');
    var left = root.getBoundingClientRect().left - document.documentElement.getBoundingClientRect().left;
    if (Math.abs(left) > 0.5) root.style.setProperty('margin-left', (-left) + 'px', 'important');
  });
}
fullWidthFix();
window.addEventListener('load', fullWidthFix);
window.addEventListener('resize', fullWidthFix);
setTimeout(fullWidthFix, 600);
setTimeout(fullWidthFix, 2000);
```

## Header (global section)

- Header bar is `position:fixed`, z-index about 60. A spacer div (same height as the bar, e.g. 100px desktop, 82px mobile) sits before it inside the header block.
- If the page's first section has class `{PREFIX}-hero` (a dark full-bleed hero), the header is transparent at the top and turns solid after 40px of scroll, and the spacer is hidden. Every other page gets a solid header and the spacer. Detect with CSS `html:has(.{PREFIX} .{PREFIX}-hero) .{PREFIX}-header-spacer{display:none}` plus a JS fallback that toggles a class on `<html>`.
- Hero sections need top padding of at least 140px desktop and 110px mobile so content clears the fixed header.
- Menu links use full paths (`/#services`, `/about`). A small script rewrites `/#id` to `#id` when that id exists on the current page, so same-page links scroll without reloading.
- Mobile menu: button with `aria-expanded` and `aria-controls`, closes on link click and Escape.
- Remember: an element with a CSS transform breaks `position:fixed` inside it. The full-width script clears transforms on GHL ancestors.

## Footer (global section)

- Contains: footer markup, back-to-top button, optional mobile sticky CTA bar, and the site-wide "reveal on scroll" observer for elements with class `reveal`.
- Back-to-top goes bottom-LEFT. The GHL chat bubble occupies bottom-right.
- Only add the "pending" (hidden) state to reveal elements below the fold, so nothing flashes or stays hidden if JS fails.

## JavaScript

- Every block's JS is wrapped in an IIFE. No top-level `const`/`let`/`function` names (GHL's own scripts can collide).
- Guard every `querySelector` result (the header and footer run on pages that do not contain page elements).
- Custom JS does NOT run in the GHL builder canvas. Always judge results in Preview or the live page.
- Motion: respect `prefers-reduced-motion`, pause loops when offscreen or when the tab is hidden, no layout shift.

## Forms and chat

- GHL form embeds are iframes. Site CSS cannot style anything inside them. Style forms in the GHL form builder (colours, font, field height, radius, button) and only style the panel around the iframe in code.
- Keep GHL's `form_embed.js` script next to the iframe; it resizes the iframe automatically. Give the iframe a sensible starting height.
- Do not build custom HTML forms unless an endpoint (webhook) is supplied; GHL-native forms are what sync to the CRM and workflows.

## Media

- Never use relative paths (`./hero.jpg`). GHL cannot serve them. Use GHL Media Library URLs. If a URL is not provided, insert the token `{IMAGE_URL_description}` in the `src` and list it.
- No base64 images. Keep each code element under about 60 KB. If a block is larger, deliver it so it can be split into two elements: (A) style + markup, (B) script.

## SEO

- One H1 per page. Title, meta, H1 and JSON-LD never change based on visitor location or script.
- The homepage must live at `/` with `/home` redirected to it, so there is one homepage URL and menu anchors do not reload.

## When migrating an existing single-file HTML mockup into GHL

- Split it into the 4 layers. Convert `:root`, `body`, `html` and `*` rules into `.{PREFIX}` scoped rules. Convert `rem` to `px`.
- Move header and footer markup and their JS out of the page. Replace custom forms with the GHL embed. Replace relative image paths.
- Anything shared goes to master CSS; anything page-only stays in the page block.
- Before delivering, compare the result against the original mockup at 1440px and 375px with a GHL-like harness: a padded section, a 1170px centred row, padded column, hidden sibling elements, and theme CSS that sets h1-h3 colour and font, p margins and link colour. Fix any difference.
