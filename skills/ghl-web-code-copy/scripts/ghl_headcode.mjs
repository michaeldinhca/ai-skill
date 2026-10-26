// Read or replace the SITE-WIDE head tracking code (Websites > the site > Settings > Tracking & scripts) safely.
//
//   node ghl_headcode.mjs read  <backup-folder>                 save the current value to <backup-folder>/head-<timestamp>.html and print length + sha1
//   node ghl_headcode.mjs write <new-file> <backup-folder>      back up the current value, REFUSE if it holds third-party tags
//                                                              (GTM, gtag, fbq, pixels, ...) that <new-file> does not contain, else set the new value
//   add --force to write anyway after you have reviewed the report (never the default)
//
// The settings tab must be open in the GHL browser tab (launch-browser.ps1). After "write", click the page's Save button
// (ghl_do.mjs {"click":"Save","nth":"last"}), wait for the spinner, then verify on the live HTML.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const [, , mode, a, b] = process.argv;
const force = process.argv.includes('--force');
if (!['read', 'write'].includes(mode)) { console.error('usage: ghl_headcode.mjs read <backup-folder> | write <new-file> <backup-folder> [--force]'); process.exit(1); }
const backupDir = mode === 'read' ? a : b;
if (!backupDir) { console.error('a backup folder is required'); process.exit(1); }
const sha = s => crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);

const browser = await puppeteer.connect({ browserURL: process.env.GHL_DEBUG_URL || 'http://127.0.0.1:9222', defaultViewport: null });
const page = (await browser.pages()).find(p => /crmbright|gohighlevel|leadconnector|highlevel/i.test(p.url()));
const old = await page.evaluate(() => {
  const el = [...document.querySelectorAll('textarea')].find(e => /loaded in the <head>/.test(e.placeholder));
  return el ? el.value : null;
});
if (old === null) { console.log('Head tracking code textarea not found. Open Websites > the site > Settings first.'); process.exit(1); }

fs.mkdirSync(backupDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const backup = path.join(backupDir, `head-${stamp}.html`);
fs.writeFileSync(backup, old, 'utf8');
console.log(`backup saved: ${backup}  (${old.length} chars, sha1 ${sha(old)})`);

if (mode === 'read') { browser.disconnect(); process.exit(0); }

const next = fs.readFileSync(a, 'utf8').replace(/\r\n/g, '\n');
// third-party signatures that must not be dropped silently
const sigs = [/googletagmanager\.com[^"'\s)]*/g, /GTM-[A-Z0-9]+/g, /\bG-[A-Z0-9]{6,}\b/g, /\bUA-\d+-\d+\b/g, /\bAW-\d+\b/g, /fbq\(\s*['"]init['"]\s*,\s*['"]?\d+/g,
  /connect\.facebook\.net[^"'\s)]*/g, /clarity\.ms[^"'\s)]*/g, /hotjar[^"'\s)]*/g, /google-site-verification[^>]*/g, /facebook-domain-verification[^>]*/g,
  /snap\.licdn\.com[^"'\s)]*/g, /static\.ads-twitter\.com[^"'\s)]*/g, /widgets\.leadconnectorhq\.com[^"'\s)]*/g];
const found = new Set();
for (const re of sigs) for (const m of old.matchAll(re)) found.add(m[0]);
const lost = [...found].filter(s => !next.includes(s));
console.log(`third-party tags in the OLD code: ${found.size ? [...found].join(' | ') : 'none found'}`);
if (lost.length && !force) {
  console.log('REFUSING to write: these would be lost:\n  ' + lost.join('\n  ') + '\nMerge them into the new file (or use --force after the owner agrees).');
  browser.disconnect(); process.exit(2);
}
// line level summary of what changes
const oldLines = new Set(old.split('\n')), newLines = new Set(next.split('\n'));
const removed = [...oldLines].filter(l => l.trim() && !newLines.has(l));
console.log(`lines only in OLD (will disappear): ${removed.length}`);
for (const l of removed.slice(0, 6)) console.log('   - ' + l.slice(0, 110));

const len = await page.evaluate((v) => {
  const el = [...document.querySelectorAll('textarea')].find(e => /loaded in the <head>/.test(e.placeholder));
  Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(el, v);
  el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }));
  return el.value.length;
}, next);
console.log(`new value set: ${len} chars (file ${next.length}). Now click Save on the settings page.`);
browser.disconnect();
process.exit(len === next.length ? 0 : 3);
