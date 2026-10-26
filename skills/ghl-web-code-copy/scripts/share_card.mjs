// Make social-share ("Open Graph") images: 1200x630 JPEG cards with a headline, tied to each page's content.
// 1200x630 (1.91:1) is the size Facebook, LinkedIn, X large cards, WhatsApp and iMessage all crop well.
//
//   node share_card.mjs spec.json <out-folder>
//
// spec.json:
// { "brand": { "logo": "C:/path/logo.png", "ink": "#0d1318", "accent": "#0371c1", "accentSoft": "#7fbdf0",
//              "displayFont": "C:/path/display.woff2", "bodyFont": "C:/path/body.woff2" },
//   "cards": [
//     { "name": "home-en", "kicker": "ACA Construction Inc", "headline": "General contractor<br>in <em>Montreal</em>",
//       "sub": "Renovations, repairs and paving.", "layout": "collage", "images": ["a.jpg","b.jpg","c.jpg"],
//       "footerLeft": "example.com  .  (514) 000-0000", "footerRight": "" },
//     { "name": "careers-en", "layout": "photo", "images": ["crew.jpg"], ... },
//     { "name": "about-en",   "layout": "plain", ... } ] }
// Layouts: "collage" (3 photos at the right), "photo" (one photo under a dark shade), "plain" (brand colour and shapes).
// Output file names: share-<name>.jpg. Check each card by eye: long French headlines may need a smaller "fontSize" on the card.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const [, , specFile, outDir] = process.argv;
if (!specFile || !outDir) { console.error('usage: node share_card.mjs spec.json <out-folder>'); process.exit(1); }
const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'));
const B = Object.assign({ ink: '#0d1318', accent: '#0371c1', accentSoft: '#7fbdf0' }, spec.brand || {});
const url = p => 'file:///' + path.resolve(p).replace(/\\/g, '/');
fs.mkdirSync(outDir, { recursive: true });

const css = (c) => `
@font-face{font-family:'D';src:url(${B.displayFont ? url(B.displayFont) : ''}) format('woff2');font-weight:100 900}
@font-face{font-family:'B';src:url(${B.bodyFont ? url(B.bodyFont) : ''}) format('woff2');font-weight:100 900}
*{box-sizing:border-box;margin:0}html,body{width:1200px;height:630px;overflow:hidden;background:${B.ink};font-family:'B',Arial,sans-serif;color:#fff}
.card{position:relative;width:1200px;height:630px;overflow:hidden}.bg{position:absolute;inset:0;background-size:cover;background-position:center}
.shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(8,12,16,.96) 0%,rgba(8,12,16,.86) 46%,rgba(8,12,16,.35) 100%)}
.bar{position:absolute;left:64px;top:64px;width:84px;height:8px;background:${B.accent}}
.logo{position:absolute;right:56px;top:48px;background:#fff;border-radius:16px;padding:14px 22px;display:flex}.logo img{height:62px;width:auto}
.txt{position:absolute;left:64px;top:104px;width:${c.textWidth || 620}px}
.kick{font-size:24px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:${B.accentSoft};margin-bottom:18px}
h1{font-family:'D',Impact,sans-serif;font-weight:900;text-transform:uppercase;font-size:${c.fontSize || 104}px;line-height:1;letter-spacing:.01em}
h1 em{font-style:normal;color:${B.accentSoft}}
.sub{margin-top:24px;font-size:28px;line-height:1.3;font-weight:500;color:#e6ecf1;max-width:${c.textWidth || 620}px}
.foot{position:absolute;left:64px;right:64px;bottom:44px;display:flex;justify-content:space-between;font-size:24px;font-weight:700}
.collage{position:absolute;right:0;top:0;bottom:0;width:470px;display:grid;grid-template-rows:1fr 1fr 1fr;gap:6px;transform:skewX(-6deg);transform-origin:top right;margin-right:-30px}
.collage div{background-size:cover;background-position:center}`;

const browser = await puppeteer.launch({
  executablePath: process.env.BROWSER_PATH || ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe'].find(p => fs.existsSync(p)),
  headless: 'new', args: ['--disable-gpu', '--allow-file-access-from-files'],
});
for (const c of spec.cards) {
  let bg;
  if (c.layout === 'collage') bg = `<div class="collage">${c.images.slice(0, 3).map(i => `<div style="background-image:url(${url(i)})"></div>`).join('')}</div><div class="shade" style="background:linear-gradient(90deg,${B.ink} 0%,${B.ink} 52%,rgba(0,0,0,0) 76%)"></div>`;
  else if (c.layout === 'photo') bg = `<div class="bg" style="background-image:url(${url(c.images[0])})"></div><div class="shade"></div>`;
  else bg = `<div class="bg" style="background:radial-gradient(900px 520px at 85% 10%,${B.accent}88,rgba(0,0,0,0) 70%),${B.ink}"></div><div style="position:absolute;right:70px;bottom:70px;width:230px;height:230px;border-radius:50%;border:14px solid ${B.accentSoft}80"></div><div style="position:absolute;right:130px;bottom:130px;width:110px;height:110px;border-radius:50%;background:${B.accent}"></div>`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css(c)}</style></head><body><div class="card">${bg}
    <div class="bar"></div>${B.logo ? `<div class="logo"><img src="${url(B.logo)}"></div>` : ''}
    <div class="txt"><div class="kick">${c.kicker || ''}</div><h1>${c.headline}</h1><div class="sub">${c.sub || ''}</div></div>
    <div class="foot"><span>${c.footerLeft || ''}</span><span>${c.footerRight || ''}</span></div></div></body></html>`;
  const tmp = path.join(outDir, `.${c.name}.html`);
  fs.writeFileSync(tmp, html);
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.goto(url(tmp), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const file = path.join(outDir, `share-${c.name}.jpg`);
  await page.screenshot({ path: file, type: 'jpeg', quality: 90, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log(path.basename(file), Math.round(fs.statSync(file).size / 1024) + ' KB');
  await page.close(); fs.unlinkSync(tmp);
}
await browser.close();
