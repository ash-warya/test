// Generates the art-directed placeholder SVGs used by the showcase.
// Every file is prefixed `placeholder-` so it is obvious what to replace.
import { writeFileSync } from "node:fs";
const dir = "src/components/SmallBusinessShowcase/assets";
const C = { rye: "#2B2420", crust: "#9A6B43", wheat: "#D9C3A0", oat: "#EFE7DA", sage: "#8C9A84", ink: "#111113", ivory: "#F9FAFB" };
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">${body}</svg>\n`;

// Loaf: an oval with scoring lines.
const loaf = (cx, cy, rx, ry, fill, score) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/>` +
  [-0.45, 0, 0.45].map((k) => `<path d="M${cx + k * rx - rx * 0.12} ${cy - ry * 0.55} q${rx * 0.12} ${ry * 0.55} 0 ${ry * 1.1}" stroke="${score}" stroke-width="${rx * 0.05}" fill="none" stroke-linecap="round"/>`).join("");

const files = {
  "placeholder-website-hero.svg": svg(800, 1000,
    `<rect width="800" height="1000" fill="${C.wheat}"/><rect y="640" width="800" height="360" fill="${C.crust}"/>` +
    `<circle cx="560" cy="330" r="150" fill="${C.oat}"/>` + loaf(400, 620, 250, 130, C.rye, C.wheat)),
  "placeholder-post-01.svg": svg(600, 600, `<rect width="600" height="600" fill="${C.oat}"/>` + loaf(300, 330, 190, 105, C.crust, C.oat)),
  "placeholder-post-02.svg": svg(600, 600, `<rect width="600" height="600" fill="${C.rye}"/><circle cx="300" cy="300" r="150" fill="${C.wheat}"/><circle cx="300" cy="300" r="92" fill="${C.oat}"/>`),
  "placeholder-post-03.svg": svg(600, 600, `<rect width="600" height="600" fill="${C.sage}"/><path d="M150 600V300a150 150 0 0 1 300 0v300z" fill="${C.oat}"/>`),
  "placeholder-post-04.svg": svg(600, 600, `<rect width="600" height="600" fill="${C.wheat}"/><rect x="0" y="380" width="600" height="220" fill="${C.crust}"/><circle cx="210" cy="300" r="95" fill="${C.ivory}"/><circle cx="380" cy="330" r="70" fill="${C.rye}"/>`),
  "placeholder-post-05.svg": svg(600, 600, `<rect width="600" height="600" fill="${C.crust}"/>` + loaf(300, 300, 170, 170, C.wheat, C.crust)),
  "placeholder-post-06.svg": svg(600, 600, `<rect width="600" height="600" fill="${C.ivory}"/><rect x="120" y="120" width="360" height="360" fill="${C.sage}"/><circle cx="300" cy="300" r="110" fill="${C.oat}"/>`),
  "placeholder-ad-01.svg": svg(800, 1000, `<rect width="800" height="1000" fill="${C.rye}"/><circle cx="400" cy="430" r="250" fill="${C.crust}"/>` + loaf(400, 470, 220, 120, C.wheat, C.crust)),
  "placeholder-ad-02.svg": svg(800, 1000, `<rect width="800" height="1000" fill="${C.oat}"/><path d="M160 1000V520a240 240 0 0 1 480 0v480z" fill="${C.sage}"/><circle cx="400" cy="560" r="110" fill="${C.ivory}"/>`),
  "placeholder-ad-03.svg": svg(800, 1000, `<rect width="800" height="1000" fill="${C.wheat}"/><rect y="600" width="800" height="400" fill="${C.rye}"/><circle cx="300" cy="520" r="160" fill="${C.oat}"/><circle cx="520" cy="560" r="120" fill="${C.crust}"/>`),
  "placeholder-map.svg": svg(300, 300,
    `<rect width="300" height="300" fill="#ECEBE8"/>` +
    `<path d="M-10 90 L310 60 M-10 200 L310 230 M80 -10 L110 310 M210 -10 L190 310" stroke="#FFFFFF" stroke-width="14"/>` +
    `<path d="M-10 140 Q150 120 310 150" stroke="#FFFFFF" stroke-width="7" fill="none"/>` +
    `<rect x="120" y="80" width="60" height="110" fill="#E1DFDA"/><rect x="220" y="100" width="70" height="80" fill="${C.sage}" opacity="0.35"/>` +
    `<path d="M150 170c-18 0-30-13-30-29 0-22 30-51 30-51s30 29 30 51c0 16-12 29-30 29z" fill="${C.ink}"/><circle cx="150" cy="140" r="9" fill="${C.ivory}"/>`),
};
for (const [name, body] of Object.entries(files)) writeFileSync(`${dir}/${name}`, body);
console.log(Object.keys(files).length, "placeholders written");
