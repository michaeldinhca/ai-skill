// Drag with a real mouse from one point to another, with a "hover" screenshot before the drop.
// Needed for GHL "Saved Assets > Global Sections": clicking a global section does nothing, dragging it onto the page works.
//
//   node ghl_drag.mjs x1 y1 x2 y2 shot.png
//
// Drop NEAR THE TOP of the page content for a header and BELOW the last section for a footer.
// Take a screenshot first (ghl_do.mjs {"shot":...}) and read the coordinates from it.
import puppeteer from 'puppeteer-core';

const [, , x1, y1, x2, y2, shot] = process.argv;
if (!shot) { console.error('usage: node ghl_drag.mjs x1 y1 x2 y2 shot.png'); process.exit(1); }
const wait = ms => new Promise(r => setTimeout(r, ms));
const DEBUG = process.env.GHL_DEBUG_URL || 'http://127.0.0.1:9222';
const browser = await puppeteer.connect({ browserURL: DEBUG, defaultViewport: null });
const all = await browser.pages();
const page = all.find(p => p.url().includes('page-builder')) || all[0];
await page.bringToFront();
const A = [+x1, +y1], B = [+x2, +y2];
await page.mouse.move(A[0], A[1]); await wait(250);
await page.mouse.down(); await wait(300);
const N = 25;
for (let i = 1; i <= N; i++) { await page.mouse.move(A[0] + (B[0] - A[0]) * i / N, A[1] + (B[1] - A[1]) * i / N); await wait(40); }
await wait(500);
await page.screenshot({ path: shot.replace(/\.png$/, '-hover.png') });
await page.mouse.up(); await wait(2500);
await page.screenshot({ path: shot });
console.log(`dragged ${A} -> ${B}`);
browser.disconnect();
