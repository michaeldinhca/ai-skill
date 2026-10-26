// Load code into the code editor that is ALREADY OPEN in the GHL page builder, and prove it matches the source file.
//
//   node ghl_paste.mjs <file> <shot.png> [body|head]
//
//   body (default)  the file with its leading "<!-- GHL PAGE SETTINGS ... -->" comment removed
//                   -> use with: element settings > "Open Code Editor" (Custom HTML/Javascript element)
//   head            only the lines between HEAD-CODE-BEGIN and HEAD-CODE-END in that comment
//                   -> use with: the toolbar "</>" Tracking Code dialog, Header Tracking tab
//
// It sets the value through CodeMirror's own API, so nothing is typed (no auto-closing tags, no auto-indent,
// no truncation on 100 KB files). It prints a SHA-1 of what was sent and of what the editor now holds.
// It does NOT click Save: do that yourself (the dialog's Save button), then save the page.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import crypto from 'node:crypto';

const [, , file, shot, mode] = process.argv;
if (!file || !shot) { console.error('usage: node ghl_paste.mjs <file> <shot.png> [body|head]'); process.exit(1); }
let code = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
if (mode === 'head') {
  const m = code.match(/HEAD-CODE-BEGIN\n([\s\S]*?)\n\s*HEAD-CODE-END/);
  if (!m) { console.log('no HEAD-CODE-BEGIN/END block in file'); process.exit(1); }
  code = m[1] + '\n';
} else {
  code = code.replace(/^<!-- GHL PAGE SETTINGS[\s\S]*?-->\n/, '');
}
const sha = s => crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);
const DEBUG = process.env.GHL_DEBUG_URL || 'http://127.0.0.1:9222';
const browser = await puppeteer.connect({ browserURL: DEBUG, defaultViewport: null });
const pages = await browser.pages();
const page = pages.find(p => p.url().includes('page-builder')) || pages[0];
await page.bringToFront();
const f = page.frames().find(f => f.url().includes('page-builder.leadconnectorhq.com')) || page.mainFrame();
const res = await f.evaluate((text) => {
  // only editors that are on screen (hidden wrappers with 0x0 size exist and must be ignored)
  const els = [...document.querySelectorAll('.CodeMirror')].filter(e => e.getBoundingClientRect().width > 0 && e.CodeMirror);
  if (!els.length) return { ok: false, why: 'no visible CodeMirror editor. Is the code dialog open?' };
  const cm = els[0].CodeMirror;
  cm.setValue(text); cm.refresh();
  return { ok: true, back: cm.getValue(), lines: cm.lineCount(), editors: els.length };
}, code);
if (!res.ok) { console.log(res.why); process.exit(1); }
console.log('sent   :', code.length, 'chars, sha1', sha(code));
console.log('editor :', res.back.length, 'chars,', res.lines, 'lines, sha1', sha(res.back), `(visible editors: ${res.editors})`);
console.log(res.back === code ? 'MATCH: the editor holds exactly the intended code' : 'MISMATCH: do not save');
await page.screenshot({ path: shot });
browser.disconnect();
process.exit(res.back === code ? 0 : 2);
