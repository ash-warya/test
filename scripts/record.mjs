// Renders the showcase loop to MP4, frame-exact, by seeking the CSS
// animations and piping screenshots to ffmpeg.
// usage: FFMPEG=/path/to/ffmpeg node scripts/record.mjs [url] [outDir]
// env: VIEWS=desktop,mobile  FPS=30  LOOPS=2
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";

const url = process.argv[2] ?? "http://localhost:4173/";
const out = process.argv[3] ?? "videos";
const ffmpeg = process.env.FFMPEG ?? "ffmpeg";
const fps = Number(process.env.FPS ?? 30);
const loops = Number(process.env.LOOPS ?? 2);
const LOOP_MS = 16000;
const views = {
  desktop: { viewport: { width: 1600, height: 1000 }, scale: 1.25 },
  mobile: { viewport: { width: 390, height: 844 }, scale: 3 },
};
const only = process.env.VIEWS?.split(",");
mkdirSync(out, { recursive: true });

const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: "localhost,127.0.0.1" } : undefined;
const browser = await chromium.launch({
  executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  proxy,
  args: proxy ? ["--ignore-certificate-errors"] : [],
});

for (const [name, v] of Object.entries(views)) {
  if (only && !only.includes(name)) continue;
  const page = await browser.newPage({ viewport: v.viewport, deviceScaleFactor: v.scale });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const root = page.locator(".sbs-root");
  await root.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  const file = `${out}/showcase-${name}.mp4`;
  const enc = spawn(ffmpeg, [
    "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-i", "-",
    "-vf", "pad=ceil(iw/2)*2:ceil(ih/2)*2:color=white",
    "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", file,
  ], { stdio: ["pipe", "inherit", "inherit"] });

  const frames = Math.round((LOOP_MS / 1000) * fps * loops);
  for (let f = 0; f < frames; f++) {
    const ms = ((f * 1000) / fps) % LOOP_MS;
    await page.evaluate((t) => {
      for (const a of document.getAnimations()) { a.pause(); a.currentTime = t; }
    }, ms);
    const png = await root.screenshot({ animations: "allow" });
    if (!enc.stdin.write(png)) await new Promise((r) => enc.stdin.once("drain", r));
  }
  enc.stdin.end();
  await new Promise((r) => enc.on("close", r));
  console.log("wrote", file);
  await page.close();
}
await browser.close();
