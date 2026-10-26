// Diagnose the browser connection and the state of the builder. Run this FIRST in a new chat, and whenever a step does nothing.
//
//   node ghl_probe.mjs
//
// Prints: the open tabs, every frame, whether a CodeMirror editor is on screen, and any open dialog's text.
// If the builder's UI has changed (new version of GHL), the differences show up here before they break a paste.
import puppeteer from 'puppeteer-core';

const DEBUG = process.env.GHL_DEBUG_URL || 'http://127.0.0.1:9222';
let browser;
try { browser = await puppeteer.connect({ browserURL: DEBUG, defaultViewport: null }); }
catch (e) { console.log(`Cannot reach ${DEBUG}. Start the browser with launch-browser.ps1 and keep it open.`); process.exit(1); }
const pages = await browser.pages();
console.log('tabs:'); for (const p of pages) console.log('  ' + p.url().slice(0, 130));
const page = pages.find(p => p.url().includes('page-builder')) || pages[0];
for (const f of page.frames()) {
  const r = await f.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    return {
      url: location.href.slice(0, 90),
      codeMirrorVisible: [...document.querySelectorAll('.CodeMirror')].filter(vis).length,
      codeMirrorTotal: document.querySelectorAll('.CodeMirror').length,
      dialogs: [...document.querySelectorAll('[role=dialog], .hr-modal, .modal')].filter(vis).map(e => e.innerText.replace(/\s+/g, ' ').slice(0, 90)),
    };
  }).catch(e => ({ err: e.message }));
  console.log(JSON.stringify(r));
}
browser.disconnect();
