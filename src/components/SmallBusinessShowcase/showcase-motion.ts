/**
 * ANIMATION for the Small Business showcase.
 *
 * One 16 second timeline drives everything. It is compiled to plain CSS
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

export const LOOP = 16;

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
  /** Brand system assembles in the centre of the canvas. */
  brand: [0, 3.4],
  /** Brand pieces travel to the left; the website opens from the centre. */
  website: [3.4, 6.0],
  search: [6.0, 8.2],
  social: [8.2, 10.4],
  ads: [10.4, 11.9],
  ecosystem: [11.9, 14.6],
  /** Everything clears; the loop restarts on an empty canvas. */
  loop: [14.6, LOOP],
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
  clip?: "up" | "left" | "down" | "center";
};

export const TIMELINE = {
  // Scene 1: brand, assembled in the centre (see LAYOUTS[*].intro).
  logo: { at: 0.4, dur: 1.3, from: { y: 28, s: 0.97 }, clip: "up" },
  typePrimary: { at: 0.85, dur: 1.2, from: { x: -36 }, clip: "left" },
  typeSecondary: { at: 1.15, dur: 1.1, from: { x: -28 } },
  palette: { at: 1.45, dur: 1.1, from: { y: 20 } },
  card: { at: 1.85, dur: 1.3, from: { y: 56, r: 3, s: 1.02 } },

  // Scene 2: website opens from the centre once the brand has moved aside.
  website: { at: 4.2, dur: 1.5, from: { s: 0.9 }, clip: "center" },

  // Scene 3: Google search / Maps listing.
  search: { at: 6.2, dur: 1.2, from: { y: 36 }, clip: "down" },

  // Scene 4: Instagram. Phone rises, grid populates, posts slide out of it.
  phone: { at: 8.3, dur: 1.4, from: { y: 110 } },
  postA: { at: 9.55, dur: 1.2, from: { x: -80, s: 0.96 } },
  postB: { at: 9.85, dur: 1.2, from: { x: -110, s: 0.96 } },

  // Scene 5: ads stack in, then fan (see ADS_FAN).
  ad0: { at: 10.45, dur: 0.9, from: { y: 90 } },
  ad1: { at: 10.57, dur: 0.9, from: { y: 90 } },
  ad2: { at: 10.69, dur: 0.9, from: { y: 90 } },
} satisfies Partial<Record<ElementId, Cue>>;

/** Brand pieces travel from their centre arrangement to their resting place. */
export const BRAND_MOVE = { at: 3.3, dur: 1.3, stagger: 0.07 };

/** Ads land stacked, then fan to their resting layout pose. */
export const ADS_FAN = { at: 11.1, dur: 1.0, stagger: 0.06 };

/** Inner sequences that play inside a revealed element. */
export const INNER = {
  swatches: { at: 1.65, stagger: 0.08, dur: 0.8 },
  grid: { at: 8.85, stagger: 0.085, dur: 0.7 },
  typing: { at: 6.65, dur: 0.7 },
  searchRows: { at: 7.2, stagger: 0.12, dur: 0.8 },
};

/** Scene 7: everything drifts outward and fades, website last. */
export const EXIT = { at: 14.6, dur: 0.8, stagger: 0.035, distance: 90, scale: 0.97 };

export const CAPTIONS = {
  /** "Your business, elevated." Visible at loop start AND end (seamless). */
  opening: { outAt: 2.8, outDur: 0.6, inAt: 15.15, inDur: 0.75 },
  /** Closing headline over the full composition. */
  closing: { at: 12.5, dur: 1.0, outAt: 14.4, outDur: 0.55 },
  /** Highlight windows for the running index. Inactive labels sit at `dim`. */
  dim: 0.28,
  fade: 0.4,
  pillars: {
    brand: [[0, 4.2], [15.5, LOOP]],
    website: [[4.2, 6.0]],
    seo: [[6.0, 8.2]],
    social: [[8.2, 10.4]],
    ads: [[10.4, 11.9]],
  } as Record<PillarKey, [number, number][]>,
  /** All labels at full strength over the ecosystem frame. */
  allOn: [12.2, 14.6] as [number, number],
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
  /** Where brand pieces first assemble (top-left, stage units) before moving to `boxes`. */
  intro: Partial<Record<ElementId, { x: number; y: number }>>;
  /** Camera path. Origin is the website centre. The final stop must equal the first. */
  camera: CameraStop[];
  captions: { opening: Box; closing: Box; pillars: Box; align: "left" | "right" };
};

/** Loop start and end: close on the brand board in the centre. */
const desktopCameraStart = { s: 1.2, x: 0, y: 20 };
const mobileCameraStart = { s: 1.05, x: 0, y: -100 };

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
    intro: {
      palette: { x: 560, y: 190 },
      logo: { x: 560, y: 282 },
      typePrimary: { x: 776, y: 282 },
      typeSecondary: { x: 842, y: 498 },
      card: { x: 560, y: 498 },
    },
    camera: [
      { t: 0, ...desktopCameraStart },
      { t: 2.6, ...desktopCameraStart },
      { t: 4.8, s: 1.14, x: 110, y: 40 },
      { t: 6.0, s: 1.14, x: 110, y: 40 },
      { t: 7.0, s: 1.14, x: -40, y: -50 },
      { t: 8.2, s: 1.14, x: -40, y: -50 },
      { t: 9.2, s: 1.14, x: -130, y: -40 },
      { t: 10.4, s: 1.14, x: -130, y: -40 },
      { t: 11.2, s: 1.1, x: -150, y: -10 },
      { t: 11.9, s: 1.1, x: -150, y: -10 },
      { t: 12.9, s: 1, x: 0, y: 0 },
      { t: 14.7, s: 1, x: 0, y: 0 },
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
      postA: { x: 396, y: 800, w: 134, h: 164, z: 12 },
      ad0: { x: 70, y: 1146, w: 176, h: 220, r: -6, z: 17 },
      ad1: { x: 176, y: 1158, w: 176, h: 220, r: 0, z: 18 },
      ad2: { x: 282, y: 1170, w: 176, h: 220, r: 6, z: 19 },
      search: { x: 70, y: 972, w: 470, h: 142, z: 20 },
    },
    intro: {
      logo: { x: 64, y: 700 },
      typePrimary: { x: 268, y: 700 },
      palette: { x: 582, y: 700 },
      typeSecondary: { x: 582, y: 804 },
      card: { x: 300, y: 910 },
    },
    camera: [
      { t: 0, ...mobileCameraStart },
      { t: 2.6, ...mobileCameraStart },
      { t: 4.8, s: 1.08, x: 0, y: 260 },
      { t: 6.0, s: 1.08, x: 0, y: 260 },
      { t: 7.0, s: 1.08, x: 0, y: 100 },
      { t: 8.2, s: 1.08, x: 0, y: 100 },
      { t: 9.2, s: 1.08, x: 0, y: -10 },
      { t: 10.4, s: 1.08, x: 0, y: -10 },
      { t: 11.2, s: 1.08, x: 0, y: -160 },
      { t: 11.9, s: 1.08, x: 0, y: -160 },
      { t: 12.9, s: 1, x: 0, y: 0 },
      { t: 14.7, s: 1, x: 0, y: 0 },
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
  closed: { up: "inset(100% 0 0 0)", down: "inset(0 0 100% 0)", left: "inset(0 100% 0 0)", center: "inset(50% 50% 50% 50%)" },
  open: "inset(0 0 0 0)",
  /** The website mask opens past its edges so its shadow is not clipped. */
  openWide: "inset(-12% -12% -12% -12%)",
};

type Rule = { selector: string; base: string; stops: Stop[] };

/**
 * Enter, rest, drift outward at the end of the loop. With `intro`, the element
 * first lands at an intermediate pose and travels to rest at `moveAt`.
 */
function revealStops(cue: Cue, rest: Pose, out: Pose, exitAt: number, intro?: { pose: Pose; moveAt: number }): Stop[] {
  const land = intro?.pose ?? rest;
  const from = offset(land, cue.from, 0);
  const gone = offset(rest, out, 0);
  const end = cue.at + (cue.dur ?? 1.1);
  const travel: Stop[] = intro
    ? [
        { t: intro.moveAt, css: poseCss(land), ease: EASE.camera },
        { t: intro.moveAt + BRAND_MOVE.dur, css: poseCss(rest), ease: EASE.hold },
      ]
    : [];
  return [
    { t: 0, css: poseCss(from) },
    { t: cue.at, css: poseCss(from), ease: EASE.enter },
    { t: end, css: poseCss(land), ease: EASE.hold },
    ...travel,
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

function clipStops(at: number, dur: number, dir: keyof typeof CLIP.closed, ease: string = EASE.enter, openValue = CLIP.open): Stop[] {
  const closed = `clip-path:${CLIP.closed[dir]}`;
  const open = `clip-path:${openValue}`;
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

  // Elements. Exit order by distance from the website, so it leaves last.
  const focus = center(layout.boxes.website!);
  const ids = Object.keys(layout.boxes) as ElementId[];
  const brandOrder = (Object.keys(layout.intro) as ElementId[]).sort(
    (a, b) => ((TIMELINE as Record<string, Cue>)[a]?.at ?? 0) - ((TIMELINE as Record<string, Cue>)[b]?.at ?? 0),
  );
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
    const out = id === "website" ? { s: EXIT.scale } : outward(layout, box);
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
      const at = layout.intro[id];
      const intro = at
        ? { pose: { ...rest, x: at.x - box.x, y: at.y - box.y }, moveAt: BRAND_MOVE.at + brandOrder.indexOf(id) * BRAND_MOVE.stagger }
        : undefined;
      rules.push({ selector: sel(id), base: poseCss(rest), stops: revealStops(cue, rest, out, exitAt, intro) });
    }

    if (cue.clip) {
      const openValue = cue.clip === "center" ? CLIP.openWide : CLIP.open;
      rules.push({
        selector: sel(`${id}-mask`),
        base: `clip-path:${openValue}`,
        stops: clipStops(cue.at, (cue.dur ?? 1.1) * 0.95, cue.clip, EASE.enter, openValue),
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
