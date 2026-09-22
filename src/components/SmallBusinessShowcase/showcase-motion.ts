/**
 * ANIMATION for the Small Business showcase.
 *
 * One 15 second timeline drives everything. It is compiled to plain CSS
 * @keyframes (transform, opacity, clip-path only) so the loop runs on the
 * compositor with no per-frame JavaScript and no React re-renders.
 *
 * Coordinates are in stage units: the desktop stage is 1600 x 900, the
 * mobile stage is 900 x 1600. `--u` is one stage unit in real pixels.
 *
 * To retime: edit TIMELINE (seconds). To recompose: edit LAYOUTS.
 * Content never lives here; see showcase-data.ts.
 */

import type { PillarKey } from "./showcase-data";
import { EASE_OUT } from "@/brand/tokens";

export const LOOP = 15;

export const EASE = {
  /** Art-directed entrances: fast start, long settle. Token from styles.css. */
  enter: EASE_OUT,
  /** Camera: symmetric, no overshoot. */
  camera: "cubic-bezier(0.65, 0, 0.35, 1)",
  /** Peripheral exit as the camera pushes back in. */
  exit: "cubic-bezier(0.5, 0, 0.75, 0)",
  fade: "cubic-bezier(0.4, 0, 0.2, 1)",
  hold: "linear",
} as const;

// ---------------------------------------------------------------------------
// Timeline (seconds). Scenes are documented, cues reference them.
// ---------------------------------------------------------------------------

export const SCENES = {
  website: [0, 2.4],
  brand: [2.4, 5.2],
  social: [5.2, 8.0],
  adsSearch: [8.0, 10.8],
  ecosystem: [10.8, 13.3],
  loop: [13.3, LOOP],
} as const;

export type ElementId =
  | "website"
  | "logo"
  | "typePrimary"
  | "typeSecondary"
  | "palette"
  | "card"
  | "phone"
  | "postA"
  | "postB"
  | "ad0"
  | "ad1"
  | "ad2"
  | "search";

type Pose = { o?: number; x?: number; y?: number; s?: number; r?: number };

type Cue = {
  /** Entrance start. */
  at: number;
  dur?: number;
  /** Offset the element enters from, relative to its resting place. */
  from: Pose;
  /** Optional mask that opens with the entrance. */
  clip?: "up" | "left" | "down";
};

export const TIMELINE = {
  // Scene 2: brand. Logo first, then type, then color and collateral.
  logo: { at: 2.5, dur: 1.3, from: { y: 28, s: 0.97 }, clip: "up" },
  typePrimary: { at: 3.05, dur: 1.2, from: { x: -36 }, clip: "left" },
  typeSecondary: { at: 3.4, dur: 1.1, from: { x: -28 } },
  palette: { at: 3.75, dur: 1.1, from: { y: 20 } },
  card: { at: 4.15, dur: 1.3, from: { y: 56, r: 3, s: 1.02 } },

  // Scene 3: social. Phone rises, grid populates, posts slide out of it.
  phone: { at: 5.5, dur: 1.4, from: { y: 110 } },
  postA: { at: 6.85, dur: 1.2, from: { x: -80, s: 0.96 } },
  postB: { at: 7.15, dur: 1.2, from: { x: -110, s: 0.96 } },

  // Scene 4: ads stack in, then fan (see ADS_FAN). Search follows.
  ad0: { at: 8.05, dur: 0.9, from: { y: 90 } },
  ad1: { at: 8.17, dur: 0.9, from: { y: 90 } },
  ad2: { at: 8.29, dur: 0.9, from: { y: 90 } },
  search: { at: 8.95, dur: 1.2, from: { y: 36 }, clip: "down" },
} satisfies Partial<Record<ElementId, Cue>>;

/** Ads land stacked, then fan to their resting layout pose. */
export const ADS_FAN = { at: 8.9, dur: 1.0, stagger: 0.06 };

/** Inner sequences that play inside a revealed element. */
export const INNER = {
  swatches: { at: 3.95, stagger: 0.08, dur: 0.8 },
  grid: { at: 6.05, stagger: 0.085, dur: 0.7 },
  typing: { at: 9.4, dur: 0.7 },
  searchRows: { at: 9.95, stagger: 0.12, dur: 0.8 },
};

/** Scene 6: everything drifts outward and fades while the camera pushes in. */
export const EXIT = { at: 13.3, dur: 0.85, stagger: 0.035, distance: 90, scale: 0.97 };

export const CAPTIONS = {
  /** "Your business, elevated." Visible at loop start AND end (seamless). */
  opening: { outAt: 2.0, outDur: 0.6, inAt: 14.05, inDur: 0.8 },
  /** Closing headline over the full composition. */
  closing: { at: 11.3, dur: 1.0, outAt: 13.2, outDur: 0.55 },
  /** Highlight windows for the running index. Inactive labels sit at `dim`. */
  dim: 0.28,
  fade: 0.4,
  pillars: {
    website: [[0, 2.4], [14.3, LOOP]],
    brand: [[2.4, 5.2]],
    social: [[5.2, 8.0]],
    ads: [[8.0, 9.2]],
    seo: [[9.2, 10.9]],
  } as Record<PillarKey, [number, number][]>,
  /** All labels at full strength over the ecosystem frame. */
  allOn: [11.2, 13.4] as [number, number],
};

// ---------------------------------------------------------------------------
// Layouts
// ---------------------------------------------------------------------------

export type Box = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Static art-direction tilt in degrees (never animated as a spin). */
  r?: number;
  z: number;
  /** Hidden at tablet widths to lighten the periphery. */
  tabletHidden?: boolean;
};

type CameraStop = { t: number; s: number; x: number; y: number };

export type Layout = {
  name: "desktop" | "mobile";
  stage: { w: number; h: number };
  boxes: Partial<Record<ElementId, Box>>;
  /** Camera path. Origin is the website centre. The final stop must equal the first. */
  camera: CameraStop[];
  captions: { opening: Box; closing: Box; pillars: Box; align: "left" | "right" };
};

const desktopCameraStart = { s: 1.8, x: 0, y: 40 };
/** Mobile opens tight on the website's headline column, not the whole page. */
const mobileCameraStart = { s: 2.0, x: 290, y: 245 };

export const LAYOUTS: Record<"desktop" | "mobile", Layout> = {
  desktop: {
    name: "desktop",
    stage: { w: 1600, h: 900 },
    boxes: {
      website: { x: 450, y: 150, w: 700, h: 440, z: 10 },
      logo: { x: 150, y: 92, w: 196, h: 196, z: 12 },
      palette: { x: 372, y: 58, w: 300, h: 70, z: 11 },
      typePrimary: { x: 196, y: 330, w: 266, h: 172, z: 14 },
      typeSecondary: { x: 96, y: 540, w: 212, h: 92, z: 13, tabletHidden: true },
      card: { x: 560, y: 572, w: 262, h: 150, r: -3, z: 15 },
      phone: { x: 1122, y: 92, w: 232, h: 472, z: 16 },
      postA: { x: 1384, y: 52, w: 150, h: 190, z: 13 },
      postB: { x: 1418, y: 250, w: 138, h: 176, z: 12, tabletHidden: true },
      ad0: { x: 1294, y: 470, w: 150, h: 196, r: -6, z: 17 },
      ad1: { x: 1356, y: 482, w: 150, h: 196, r: 0, z: 18, tabletHidden: true },
      ad2: { x: 1418, y: 494, w: 150, h: 196, r: 6, z: 19 },
      search: { x: 896, y: 628, w: 372, h: 150, z: 20 },
    },
    camera: [
      { t: 0, ...desktopCameraStart },
      { t: 0.45, ...desktopCameraStart },
      { t: 2.6, s: 1.42, x: 0, y: 30 },
      { t: 4.9, s: 1.16, x: 120, y: 40 },
      { t: 5.4, s: 1.16, x: 120, y: 40 },
      { t: 6.6, s: 1.14, x: -130, y: 30 },
      { t: 8.0, s: 1.14, x: -130, y: 30 },
      { t: 9.2, s: 1.1, x: -150, y: -24 },
      { t: 10.8, s: 1.1, x: -150, y: -24 },
      { t: 12.0, s: 1, x: 0, y: 0 },
      { t: 13.3, s: 1, x: 0, y: 0 },
      { t: LOOP, ...desktopCameraStart },
    ],
    captions: {
      opening: { x: 72, y: 832, w: 600, h: 40, z: 40 },
      closing: { x: 72, y: 736, w: 560, h: 110, z: 40 },
      pillars: { x: 1028, y: 832, w: 500, h: 40, z: 40 },
      align: "right",
    },
  },

  mobile: {
    name: "mobile",
    stage: { w: 900, h: 1600 },
    boxes: {
      logo: { x: 64, y: 96, w: 180, h: 180, z: 12 },
      typePrimary: { x: 268, y: 96, w: 290, h: 180, z: 13 },
      palette: { x: 582, y: 96, w: 254, h: 84, z: 11 },
      typeSecondary: { x: 582, y: 200, w: 254, h: 76, z: 11 },
      website: { x: 70, y: 316, w: 760, h: 478, z: 10 },
      card: { x: 60, y: 752, w: 300, h: 172, r: -3, z: 15 },
      phone: { x: 560, y: 716, w: 270, h: 548, z: 16 },
      postA: { x: 384, y: 820, w: 156, h: 196, z: 12 },
      ad0: { x: 70, y: 1000, w: 176, h: 220, r: -6, z: 17 },
      ad1: { x: 176, y: 1012, w: 176, h: 220, r: 0, z: 18 },
      ad2: { x: 282, y: 1024, w: 176, h: 220, r: 6, z: 19 },
      search: { x: 70, y: 1270, w: 470, h: 142, z: 20 },
    },
    camera: [
      { t: 0, ...mobileCameraStart },
      { t: 0.45, ...mobileCameraStart },
      { t: 2.6, s: 1.2, x: 0, y: 250 },
      { t: 4.9, s: 1.08, x: 0, y: 260 },
      { t: 5.4, s: 1.08, x: 0, y: 260 },
      { t: 6.6, s: 1.08, x: 0, y: -10 },
      { t: 8.0, s: 1.08, x: 0, y: -10 },
      { t: 9.2, s: 1.08, x: 0, y: -110 },
      { t: 10.8, s: 1.08, x: 0, y: -110 },
      { t: 12.0, s: 1, x: 0, y: 0 },
      { t: 13.3, s: 1, x: 0, y: 0 },
      { t: LOOP, ...mobileCameraStart },
    ],
    captions: {
      opening: { x: 64, y: 1466, w: 772, h: 40, z: 40 },
      closing: { x: 64, y: 1432, w: 772, h: 96, z: 40 },
      pillars: { x: 64, y: 1540, w: 772, h: 32, z: 40 },
      align: "left",
    },
  },
};

// ---------------------------------------------------------------------------
// Compiler: timeline + layout -> CSS
// ---------------------------------------------------------------------------

type Stop = { t: number; css: string; ease?: string };

const pct = (t: number) => `${+((t / LOOP) * 100).toFixed(3)}%`;
const u = (n: number) => `calc(var(--u) * ${+n.toFixed(2)})`;

const transform = (p: Required<Pose>) =>
  `transform:translate3d(${u(p.x)},${u(p.y)},0) rotate(${+p.r.toFixed(2)}deg) scale(${+p.s.toFixed(4)})`;

const pose = (p: Pose): Required<Pose> => ({ o: 1, x: 0, y: 0, s: 1, r: 0, ...p });
const poseCss = (p: Pose) => {
  const f = pose(p);
  return `opacity:${f.o};${transform(f)}`;
};

/** Combine a resting pose with a relative offset. */
const offset = (rest: Pose, d: Pose, o: number): Pose => {
  const r = pose(rest);
  return { o, x: r.x + (d.x ?? 0), y: r.y + (d.y ?? 0), r: r.r + (d.r ?? 0), s: r.s * (d.s ?? 1) };
};

const keyframes = (name: string, stops: Stop[]) => {
  const sorted = [...stops].sort((a, b) => a.t - b.t);
  const body = sorted
    .map((s) => `${pct(s.t)}{${s.css}${s.ease ? `;animation-timing-function:${s.ease}` : ""}}`)
    .join("");
  return `@keyframes ${name}{${body}}`;
};

const CLIP = {
  closed: { up: "inset(100% 0 0 0)", down: "inset(0 0 100% 0)", left: "inset(0 100% 0 0)" },
  open: "inset(0 0 0 0)",
};

type Rule = { selector: string; base: string; stops: Stop[] };

/** Peripheral element: enter, rest, drift outward on the loop push-in. */
function revealStops(cue: Cue, rest: Pose, out: Pose, exitAt: number): Stop[] {
  const from = offset(rest, cue.from, 0);
  const gone = offset(rest, out, 0);
  const end = cue.at + (cue.dur ?? 1.1);
  return [
    { t: 0, css: poseCss(from) },
    { t: cue.at, css: poseCss(from), ease: EASE.enter },
    { t: end, css: poseCss(rest), ease: EASE.hold },
    { t: exitAt, css: poseCss(rest), ease: EASE.exit },
    { t: exitAt + EXIT.dur, css: poseCss(gone) },
    { t: LOOP, css: poseCss(gone) },
  ];
}

/** Inner sequence: hidden until `at`, then stays (parent handles the exit). */
function innerStops(at: number, dur: number, from: Pose): Stop[] {
  return [
    { t: 0, css: poseCss(offset({}, from, 0)) },
    { t: at, css: poseCss(offset({}, from, 0)), ease: EASE.enter },
    { t: at + dur, css: poseCss({}) },
    { t: LOOP, css: poseCss({}) },
  ];
}

function clipStops(at: number, dur: number, dir: keyof typeof CLIP.closed, ease: string = EASE.enter): Stop[] {
  const closed = `clip-path:${CLIP.closed[dir]}`;
  const open = `clip-path:${CLIP.open}`;
  return [
    { t: 0, css: closed },
    { t: at, css: closed, ease },
    { t: at + dur, css: open },
    { t: LOOP, css: open },
  ];
}

function opacityWindows(windows: [number, number][], dim: number, fade: number): Stop[] {
  // Build a piecewise opacity track; windows are [on, off] in seconds.
  // Merge windows that touch, so a label handing over to "all on" stays lit.
  const merged: [number, number][] = [];
  for (const w of [...windows].sort((a, b) => a[0] - b[0])) {
    const last = merged[merged.length - 1];
    if (last && w[0] <= last[1] + fade) last[1] = Math.max(last[1], w[1]);
    else merged.push([w[0], w[1]]);
  }
  windows = merged;
  const stops: Stop[] = [];
  const at0 = windows.some(([a]) => a <= 0);
  const atEnd = windows.some(([, b]) => b >= LOOP);
  stops.push({ t: 0, css: `opacity:${at0 ? 1 : dim}` });
  for (const [a, b] of windows) {
    if (a > 0) {
      stops.push({ t: Math.max(0, a - fade / 2), css: `opacity:${dim}`, ease: EASE.fade });
      stops.push({ t: a + fade / 2, css: "opacity:1" });
    }
    if (b < LOOP) {
      stops.push({ t: b - fade / 2, css: "opacity:1", ease: EASE.fade });
      stops.push({ t: Math.min(LOOP, b + fade / 2), css: `opacity:${dim}` });
    }
  }
  stops.push({ t: LOOP, css: `opacity:${atEnd ? 1 : dim}` });
  return stops;
}

const center = (b: Box) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });

/** Direction from the website centre, used for the outward drift. */
function outward(layout: Layout, b: Box): Pose {
  const focus = center(layout.boxes.website!);
  const c = center(b);
  const dx = c.x - focus.x;
  const dy = c.y - focus.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: (dx / len) * EXIT.distance, y: (dy / len) * EXIT.distance, s: EXIT.scale };
}

export const AD_IDS = ["ad0", "ad1", "ad2"] as const;

function compileLayout(layout: Layout, gridCount: number, swatchCount: number, rowCount: number): Rule[] {
  const scope = `.sbs-${layout.name}`;
  const rules: Rule[] = [];
  const sel = (id: string) => `${scope} [data-sbs="${id}"]`;

  // Camera.
  rules.push({
    selector: sel("camera"),
    base: poseCss({}),
    stops: layout.camera.map((c, i, all) => ({
      t: c.t,
      css: poseCss({ s: c.s, x: c.x, y: c.y }),
      ease: i < all.length - 1 && JSON.stringify({ ...c, t: 0 }) === JSON.stringify({ ...all[i + 1], t: 0 }) ? EASE.hold : EASE.camera,
    })),
  });

  // Peripheral elements, exit order by distance from the website.
  const focus = center(layout.boxes.website!);
  const ids = (Object.keys(layout.boxes) as ElementId[]).filter((id) => id !== "website");
  const byDistance = [...ids].sort(
    (a, b) =>
      Math.hypot(center(layout.boxes[b]!).x - focus.x, center(layout.boxes[b]!).y - focus.y) -
      Math.hypot(center(layout.boxes[a]!).x - focus.x, center(layout.boxes[a]!).y - focus.y),
  );

  for (const id of ids) {
    const box = layout.boxes[id]!;
    const cue = (TIMELINE as Record<string, Cue>)[id];
    if (!cue) continue;
    const exitAt = EXIT.at + byDistance.indexOf(id) * EXIT.stagger;
    const out = outward(layout, box);
    const isAd = (AD_IDS as readonly string[]).includes(id);
    const rest: Pose = { r: box.r ?? 0 };

    if (isAd) {
      // Stacked landing at a shared pose, then fan out to the resting tilt.
      const i = AD_IDS.indexOf(id as (typeof AD_IDS)[number]);
      const first = layout.boxes.ad0!;
      const stacked: Pose = { x: first.x - box.x + 12 * i, y: first.y - box.y + 4 * i, r: -2 + 2 * i, s: 1 };
      const fanAt = ADS_FAN.at + i * ADS_FAN.stagger;
      const enterEnd = cue.at + (cue.dur ?? 1);
      rules.push({
        selector: sel(id),
        base: poseCss(rest),
        stops: [
          { t: 0, css: poseCss(offset(stacked, cue.from, 0)) },
          { t: cue.at, css: poseCss(offset(stacked, cue.from, 0)), ease: EASE.enter },
          { t: enterEnd, css: poseCss(stacked), ease: EASE.hold },
          { t: Math.max(enterEnd, fanAt), css: poseCss(stacked), ease: EASE.enter },
          { t: fanAt + ADS_FAN.dur, css: poseCss(rest), ease: EASE.hold },
          { t: exitAt, css: poseCss(rest), ease: EASE.exit },
          { t: exitAt + EXIT.dur, css: poseCss(offset(rest, out, 0)) },
          { t: LOOP, css: poseCss(offset(rest, out, 0)) },
        ],
      });
    } else {
      rules.push({ selector: sel(id), base: poseCss(rest), stops: revealStops(cue, rest, out, exitAt) });
    }

    if (cue.clip) {
      rules.push({
        selector: sel(`${id}-mask`),
        base: `clip-path:${CLIP.open}`,
        stops: clipStops(cue.at, (cue.dur ?? 1.1) * 0.95, cue.clip),
      });
    }
  }

  // Inner sequences.
  for (let i = 0; i < swatchCount; i++) {
    rules.push({
      selector: sel(`swatch-${i}`),
      base: poseCss({}),
      stops: innerStops(INNER.swatches.at + i * INNER.swatches.stagger, INNER.swatches.dur, { y: 14 }),
    });
  }
  for (let i = 0; i < gridCount; i++) {
    rules.push({
      selector: sel(`tile-${i}`),
      base: poseCss({}),
      stops: innerStops(INNER.grid.at + i * INNER.grid.stagger, INNER.grid.dur, { s: 0.9 }),
    });
  }
  for (let i = 0; i < rowCount; i++) {
    rules.push({
      selector: sel(`row-${i}`),
      base: poseCss({}),
      stops: innerStops(INNER.searchRows.at + i * INNER.searchRows.stagger, INNER.searchRows.dur, { y: 10 }),
    });
  }
  rules.push({
    selector: sel("typing"),
    base: `clip-path:${CLIP.open}`,
    stops: clipStops(INNER.typing.at, INNER.typing.dur, "left", "steps(14, end)"),
  });

  // Captions (screen space, outside the camera).
  const o = CAPTIONS.opening;
  rules.push({
    selector: sel("opening"),
    base: poseCss({ o: 0 }),
    stops: [
      { t: 0, css: poseCss({}) },
      { t: o.outAt, css: poseCss({}), ease: EASE.fade },
      { t: o.outAt + o.outDur, css: poseCss({ o: 0, y: -8 }) },
      { t: o.inAt, css: poseCss({ o: 0, y: 10 }), ease: EASE.enter },
      { t: o.inAt + o.inDur, css: poseCss({}) },
      { t: LOOP, css: poseCss({}) },
    ],
  });
  const c = CAPTIONS.closing;
  rules.push({
    selector: sel("closing"),
    base: poseCss({}),
    stops: [
      { t: 0, css: poseCss({ o: 0, y: 18 }) },
      { t: c.at, css: poseCss({ o: 0, y: 18 }), ease: EASE.enter },
      { t: c.at + c.dur, css: poseCss({}) },
      { t: c.outAt, css: poseCss({}), ease: EASE.fade },
      { t: c.outAt + c.outDur, css: poseCss({ o: 0, y: -10 }) },
      { t: LOOP, css: poseCss({ o: 0, y: -10 }) },
    ],
  });
  for (const key of Object.keys(CAPTIONS.pillars) as PillarKey[]) {
    rules.push({
      selector: sel(`pillar-${key}`),
      base: "opacity:1",
      stops: opacityWindows([...CAPTIONS.pillars[key], CAPTIONS.allOn], CAPTIONS.dim, CAPTIONS.fade),
    });
  }
  return rules;
}

/**
 * Build the stylesheet. Base declarations are the FINAL ecosystem frame, which
 * is what reduced-motion users (and the first paint before CSS animation
 * starts) see. Animations are paused until the canvas is in view.
 */
export function buildShowcaseCss(counts: { grid: number; swatches: number; searchRows: number }) {
  const out: string[] = [];
  for (const layout of Object.values(LAYOUTS)) {
    const rules = compileLayout(layout, counts.grid, counts.swatches, counts.searchRows);
    rules.forEach((r, i) => {
      const name = `sbs-${layout.name}-${i}`;
      out.push(keyframes(name, r.stops));
      out.push(`${r.selector}{${r.base}}`);
      out.push(`.sbs-root[data-motion="on"] ${r.selector}{animation:${name} ${LOOP}s linear infinite both}`);
    });
  }
  out.push(`.sbs-root:not([data-playing="true"]) [data-sbs]{animation-play-state:paused!important}`);
  // Beats the site-wide reduced-motion rule, which would otherwise shorten the
  // loop to 0.001ms and strobe. Reduced motion shows the final composition.
  out.push(
    `@media (prefers-reduced-motion: reduce){.sbs-root [data-sbs]{animation:none!important}}`,
  );
  return out.join("\n");
}
