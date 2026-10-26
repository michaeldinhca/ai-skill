// Step runner for the GHL website builder, driven through a logged-in browser started by launch-browser.ps1.
//
//   node ghl_do.mjs steps.json
//
// steps.json is an array. Each step is one of:
//   {"goto":"https://..."}                       open an address in the GHL tab
//   {"wait":2500}                                pause (ms)
//   {"click":"Exact visible text","nth":0}       real mouse click on the nth element whose text matches exactly ("last" allowed)
//        optional "scope":"css selector"         limit the search
//   {"clickxy":[x,y]}                            real mouse click at page coordinates (use after a screenshot)
//   {"fill":"placeholder|aria-label|name|css","value":"..."}   focus a field, select all, type the value
//   {"type":"text"}  {"press":"Enter"}           keyboard
//   {"eval":"js expression"}                     run in the builder frame (or the page) and print the result
//   {"text":true}                                print the visible text of the builder frame (or page)
//   {"shot":"C:\\path\\shot.png"}                screenshot of the whole window
//   {"top":true|false}                           act on the top page instead of the builder iframe
//   {"upload":{"input":"input[type=file]","files":["a.jpg","b.jpg"]}}   attach files to a file input (check the result on first use)
//
// Why real mouse events: GHL's menus often ignore element.click(); a real mouse down/up works.
// The page builder runs inside an iframe (page-builder.leadconnectorhq.com); this script finds it automatically
// and adds the frame's offset to coordinates.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const stepsFile = process.argv[2];
if (!stepsFile) { console.error('usage: node ghl_do.mjs steps.json'); process.exit(1); }
const steps = JSON.parse(fs.readFileSync(stepsFile, 'utf8'));
const DEBUG = process.env.GHL_DEBUG_URL || 'http://127.0.0.1:9222';
const wait = ms => new Promise(r => setTimeout(r, ms));

const browser = await puppeteer.connect({ browserURL: DEBUG, defaultViewport: null });
let pages = await browser.pages();
let page = pages.find(p => /crmbright|gohighlevel|leadconnector|highlevel/i.test(p.url())) || pages[0];
await page.bringToFront();
let forceTop = false;

async function ctx() {
  if (!forceTop && page.url().includes('page-builder')) {
    const f = page.frames().find(f => f.url().includes('page-builder.leadconnectorhq.com'));
    if (f && f !== page.mainFrame()) {
      const h = await f.frameElement(); const b = await h.boundingBox();
      return { f, dx: b.x, dy: b.y };
    }
  }
  return { f: page.mainFrame(), dx: 0, dy: 0 };
}
async function mouse(x, y) { await page.mouse.move(x, y); await wait(120); await page.mouse.down(); await wait(70); await page.mouse.up(); }
async function locate(t, nth, scope) {
  const c = await ctx();
  const r = await c.f.evaluate((t, nth, scope) => {
    const root = scope ? document.querySelector(scope) : document;
    if (!root) return null;
    const els = [...root.querySelectorAll('button, a, [role=button], [role=tab], [role=menuitem], [role=option], li, span, div, p, label, h1, h2, h3, h4')]
      .filter(e => e.children.length < 4 && (e.innerText || '').trim() === t && e.offsetParent !== null);
    const el = els[nth === 'last' ? els.length - 1 : (nth || 0)];
    if (!el) return null;
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, n: els.length };
  }, t, nth, scope);
  return r ? { x: r.x + c.dx, y: r.y + c.dy, n: r.n } : null;
}

for (const s of steps) {
  pages = await browser.pages();
  if (s.top !== undefined) { forceTop = !!s.top; console.log('top-page mode: ' + forceTop); continue; }
  if (s.goto) { await page.goto(s.goto, { waitUntil: 'domcontentloaded', timeout: 60000 }); console.log('goto ' + s.goto.slice(0, 100)); continue; }
  if (s.wait) { await wait(s.wait); continue; }
  if (s.click) {
    const b = await locate(s.click, s.nth, s.scope);
    if (!b) { console.log('!! NOT FOUND: ' + s.click); continue; }
    await mouse(b.x, b.y); console.log(`click "${s.click}" (${b.n} match${b.n > 1 ? 'es' : ''})`); continue;
  }
  if (s.clickxy) { await mouse(s.clickxy[0], s.clickxy[1]); console.log('clickxy ' + s.clickxy); continue; }
  if (s.fill) {
    const c = await ctx();
    const ok = await c.f.evaluate((q) => {
      const els = [...document.querySelectorAll('input, textarea, [contenteditable=true]')].filter(e => e.offsetParent !== null);
      let el = els.find(e => e.placeholder === q || e.getAttribute('aria-label') === q || e.name === q);
      if (!el) { try { el = document.querySelector(q); } catch (e) {} }
      if (!el) return false; el.scrollIntoView({ block: 'center' }); el.focus(); return true;
    }, s.fill);
    if (!ok) { console.log('!! FIELD NOT FOUND: ' + s.fill); continue; }
    await page.keyboard.down('Control'); await page.keyboard.press('KeyA'); await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.keyboard.type(s.value, { delay: 15 }); console.log(`filled "${s.fill}"`); continue;
  }
  if (s.type) { await page.keyboard.type(s.type, { delay: 10 }); console.log('typed ' + s.type.length + ' chars'); continue; }
  if (s.press) { await page.keyboard.press(s.press); console.log('press ' + s.press); continue; }
  if (s.eval) { const c = await ctx(); console.log('eval => ' + JSON.stringify(await c.f.evaluate(s.eval)).slice(0, 900)); continue; }
  if (s.text) { const c = await ctx(); console.log('text: ' + (await c.f.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 1400)))); continue; }
  if (s.shot) { await page.screenshot({ path: s.shot }); console.log('shot -> ' + s.shot); continue; }
  if (s.upload) {
    const c = await ctx();
    const h = await c.f.$(s.upload.input || 'input[type=file]');
    if (!h) { console.log('!! FILE INPUT NOT FOUND'); continue; }
    await h.uploadFile(...s.upload.files); console.log('attached ' + s.upload.files.length + ' file(s)'); continue;
  }
  console.log('!! unknown step: ' + JSON.stringify(s).slice(0, 80));
}
browser.disconnect();
