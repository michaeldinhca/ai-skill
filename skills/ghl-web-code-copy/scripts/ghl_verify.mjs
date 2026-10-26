// After saving, re-open the code editor and compare what GHL STORED with the source file.
//
//   (open the element's "Open Code Editor" or the Tracking Code dialog first)
//   node ghl_verify.mjs <file> [body|head]
//
// Exit code 0 = identical. This is the check that proves a paste really stuck (and survived the save).
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import crypto from 'node:crypto';

const [, , file, mode] = process.argv;
if (!file) { console.error('usage: node ghl_verify.mjs <file> [body|head]'); process.exit(1); }
let code = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
if (mode === 'head') { const m = code.match(/HEAD-CODE-BEGIN\n([\s\S]*?)\n\s*HEAD-CODE-END/); code = m ? m[1] + '\n' : ''; }
else code = code.replace(/^<!-- GHL PAGE SETTINGS[\s\S]*?-->\n/, '');
const sha = s => crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);
const DEBUG = process.env.GHL_DEBUG_URL || 'http://127.0.0.1:9222';
const browser = await puppeteer.connect({ browserURL: DEBUG, defaultViewport: null });
const page = (await browser.pages()).find(p => p.url().includes('page-builder'));
const f = page && page.frames().find(f => f.url().includes('page-builder.leadconnectorhq.com'));
const v = f ? await f.evaluate(() => { const el = [...document.querySelectorAll('.CodeMirror')].find(e => e.getBoundingClientRect().width > 0); return el && el.CodeMirror ? el.CodeMirror.getValue() : null; }) : null;
if (v === null) { console.log('editor not open'); process.exit(1); }
console.log('file  :', code.length, sha(code), '\nsaved :', v.length, sha(v));
console.log(v === code ? 'MATCH: the saved code is exactly the file' : 'MISMATCH');
browser.disconnect();
process.exit(v === code ? 0 : 2);
