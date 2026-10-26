// Fill the page-builder SEO panel from a page file's "GHL PAGE SETTINGS" comment.
//
//   node ghl_seo.mjs <page-file> [--lang fr-ca]
//
// Precondition: the SEO panel is open (toolbar icon, may need two clicks; see gotchas). It then:
//   - expands Content / Images / Links & tags only when their inputs are not on screen (never toggles an open section closed)
//   - sets Title, Description and the Images (social image URL) with the native setter
//   - adds the canonical link if the page has none yet (modal: type, confirm Add)
//   - checks the length rules (title < 70, description <= 154) and refuses to continue if broken
// It does NOT set the language (use the Language select, see gotchas) and does NOT save: save the page yourself.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const file = process.argv[2];
if (!file) { console.error('usage: node ghl_seo.mjs <page-file>'); process.exit(1); }
const h = fs.readFileSync(file, 'utf8');
const T = (h.match(/SEO title \(\d+\): (.*)/) || [])[1]?.trim();
const D = (h.match(/Meta description \(\d+\): (.*)/) || [])[1]?.trim();
const I = (h.match(/Social image: (\S+)/) || [])[1];
const C = (h.match(/Canonical links > Add: (\S+)/) || [])[1];
if (!T || !D) { console.log('title/description not found in file'); process.exit(1); }
if (T.length >= 70 || D.length > 154) { console.log(`LENGTH RULE BROKEN: title ${T.length} (<70), description ${D.length} (<=154)`); process.exit(2); }

const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await puppeteer.connect({ browserURL: process.env.GHL_DEBUG_URL || 'http://127.0.0.1:9222', defaultViewport: null });
const page = (await b.pages()).find(p => /crmbright|gohighlevel|leadconnector|highlevel/i.test(p.url()));
const frame = page.frames().find(f => /page-builder\.leadconnectorhq\.com/.test(f.url())) || page.mainFrame();

async function hasInput(ph) { return frame.evaluate(q => [...document.querySelectorAll('input,textarea')].some(e => e.offsetParent && (e.placeholder === q)), ph); }
async function clickSection(name) {
  const r = await frame.evaluate(n => {
    const el = [...document.querySelectorAll('div,span,p,h3,h4,button')].filter(e => e.offsetParent && e.children.length < 4 && (e.innerText || '').trim().split('\n')[0].trim() === n)
      .sort((a, c) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - c.getBoundingClientRect().width * c.getBoundingClientRect().height)[0];
    if (!el) return null; el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: r.x + 40, y: r.y + r.height / 2 };
  }, name);
  if (!r) { console.log('section not found: ' + name); return false; }
  const fe = await (await frame.frameElement())?.boundingBox().catch(() => null) || { x: 0, y: 0 };
  await page.mouse.move(r.x + fe.x, r.y + fe.y); await wait(120); await page.mouse.down(); await wait(70); await page.mouse.up(); await wait(1200); return true;
}
async function setVal(ph, v) {
  return frame.evaluate((q, v) => {
    const el = [...document.querySelectorAll('input,textarea')].find(e => e.offsetParent && e.placeholder === q); if (!el) return 'NOT FOUND';
    Object.getOwnPropertyDescriptor(el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, 'value').set.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); return el.value === v ? 'ok' : 'differs';
  }, ph, v);
}
if (!(await hasInput('Title'))) await clickSection('Content');
console.log('Title:', await setVal('Title', T)); console.log('Description:', await setVal('Description', D));
if (I) { if (!(await hasInput('Images'))) await clickSection('Images'); console.log('Images:', await setVal('Images', I)); }
if (C) {
  const hasLabel = () => frame.evaluate(() => [...document.querySelectorAll('div,span,p,label')].some(e => e.offsetParent && (e.innerText || '').trim() === 'Canonical links'));
  const present = () => frame.evaluate(c => { const lab = [...document.querySelectorAll('div,span,p,label')].filter(e => e.offsetParent && (e.innerText || '').trim() === 'Canonical links')[0]; if (!lab) return false;
    return [...document.querySelectorAll('div,span,p,input')].some(e => e.offsetParent && (lab.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING) && ((e.value || e.innerText || '').trim() === c) && !/preview/i.test(e.className || '')); }, C);
  if (!(await hasLabel())) await clickSection('Links & tags');
  if (await present()) console.log('canonical already present');
  else {
    const pos = await frame.evaluate(() => {
      const lab = [...document.querySelectorAll('div,span,p,label')].filter(e => e.offsetParent && (e.innerText || '').trim() === 'Canonical links')[0]; if (!lab) return null;
      lab.scrollIntoView({ block: 'center' });
      const btn = [...document.querySelectorAll('button')].filter(e => e.offsetParent && (e.innerText || '').trim() === 'Add' && (lab.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING))[0]; if (!btn) return null;
      const r = btn.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    if (!pos) console.log('canonical Add button not found');
    else {
      const fe = await (await frame.frameElement())?.boundingBox().catch(() => null) || { x: 0, y: 0 };
      await page.mouse.move(pos.x + fe.x, pos.y + fe.y); await wait(150); await page.mouse.down(); await wait(70); await page.mouse.up(); await wait(1500);
      console.log('canonical input:', await setVal('https://example.com', C));
      const ok = await frame.evaluate(() => { const bs = [...document.querySelectorAll('button')].filter(e => e.offsetParent && (e.innerText || '').trim() === 'Add'); const b = bs[bs.length - 1]; if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
      if (ok) { await page.mouse.move(ok.x + fe.x, ok.y + fe.y); await wait(150); await page.mouse.down(); await wait(70); await page.mouse.up(); await wait(1200); console.log('canonical added'); }
    }
  }
}
b.disconnect();
