// Visual QA: renders frames of the loop at fixed times for each viewport.
// usage: node scripts/shoot.mjs [url] [outDir]
import { chromium } from "playwright";
const url = process.argv[2] ?? "http://localhost:4173/";
const out = process.argv[3] ?? "screenshots";
const times = (process.env.TIMES ?? "0,1.5,3.2,4.9,6.4,7.9,9.0,10.6,12.5,13.8,14.6,14.99").split(",").map(Number);
const views = { desktop: { width: 1440, height: 1000 }, tablet: { width: 820, height: 1180 }, mobile: { width: 390, height: 844 } };
const only = process.env.VIEWS?.split(",");
// QA only: route Google Fonts through the sandbox proxy.
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: "localhost,127.0.0.1" } : undefined;
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", proxy, args: proxy ? ["--ignore-certificate-errors"] : [] });
for (const [name, vp] of Object.entries(views)) {
  if (only && !only.includes(name)) continue;
  const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 2, reducedMotion: process.env.REDUCED ? "reduce" : "no-preference" });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const root = page.locator(".sbs-root");
  await root.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  for (const t of process.env.REDUCED ? [0] : times) {
    await page.evaluate((ms) => {
      for (const a of document.getAnimations()) { a.pause(); a.currentTime = ms; }
    }, t * 1000);
    await page.waitForTimeout(60);
    await root.screenshot({ path: `${out}/${name}-${String(t).padStart(5, "0")}${process.env.REDUCED ? "-reduced" : ""}.png` });
  }
  await page.close();
}
await browser.close();
