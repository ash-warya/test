import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { GOLD, INK, IVORY, LINE_DARK, MAXW, SLATE, sans, serif } from "@/brand/tokens";
import { showcaseContent, type ShowcaseContent } from "./showcase-data";
import { LAYOUTS, buildShowcaseCss, type Box, type ElementId, type Layout } from "./showcase-motion";
import {
  AdCard,
  BusinessCard,
  LogoCard,
  PaletteCard,
  PhoneMock,
  PostCard,
  SearchCard,
  TypePrimaryCard,
  TypeSecondaryCard,
  WebsiteMock,
  u,
} from "./pieces";

const SEARCH_ROWS = 4;

const css = (c: ShowcaseContent) =>
  `
.sbs-root{container-type:inline-size;position:relative}
.sbs-canvas{position:relative;width:100%;overflow:hidden;border-radius:16px;background:hsl(0 0% 96%);isolation:isolate}
.sbs-desktop{aspect-ratio:16/9;--u:calc(100cqw / ${LAYOUTS.desktop.stage.w})}
.sbs-mobile{aspect-ratio:9/16;--u:calc(100cqw / ${LAYOUTS.mobile.stage.w});display:none}
.sbs-box{position:absolute}
.sbs-box>[data-sbs]{width:100%;height:100%;transform-origin:50% 50%;backface-visibility:hidden}
.sbs-camera{position:absolute;inset:0;will-change:transform}
@media (max-width: 639px){.sbs-desktop{display:none}.sbs-mobile{display:block}}
@media (min-width: 640px) and (max-width: 1023px){.sbs-desktop .sbs-tablet-hide{display:none}}
` +
  buildShowcaseCss({ grid: c.instagram.grid.length, swatches: c.brand.palette.length, searchRows: SEARCH_ROWS });

function Positioned({ box, id, children, dataId = id }: { box: Box; id: string; dataId?: string; children: ReactNode }) {
  return (
    <div
      className={`sbs-box${box.tabletHidden ? " sbs-tablet-hide" : ""}`}
      style={{ left: u(box.x), top: u(box.y), width: u(box.w), height: u(box.h), zIndex: box.z }}
    >
      <div data-sbs={dataId}>{children}</div>
    </div>
  );
}

function Stage({ layout, c }: { layout: Layout; c: ShowcaseContent }) {
  const b = layout.boxes;
  const site = b.website!;
  const origin = `${u(site.x + site.w / 2)} ${u(site.y + site.h / 2)}`;

  const pieces: Partial<Record<ElementId, ReactNode>> = {
    website: (
      <div data-sbs="website-mask" style={{ width: "100%", height: "100%" }}>
        <WebsiteMock c={c} />
      </div>
    ),
    logo: <LogoCard c={c} />,
    typePrimary: <TypePrimaryCard c={c} />,
    typeSecondary: <TypeSecondaryCard c={c} />,
    palette: <PaletteCard c={c} />,
    card: <BusinessCard c={c} />,
    phone: <PhoneMock c={c} />,
    postA: <PostCard c={c} post={c.instagram.featured[0]} />,
    postB: <PostCard c={c} post={c.instagram.featured[1]} />,
    ad0: <AdCard c={c} ad={c.ads[0]} />,
    ad1: <AdCard c={c} ad={c.ads[1]} />,
    ad2: <AdCard c={c} ad={c.ads[2]} />,
    search: <SearchCard c={c} />,
  };

  const cap = layout.captions;
  const capBox = (bx: Box): CSSProperties => ({ position: "absolute", left: u(bx.x), top: u(bx.y), width: u(bx.w), height: u(bx.h), zIndex: bx.z });
  const labelStyle: CSSProperties = {
    fontFamily: sans,
    fontSize: u(layout.name === "mobile" ? 17 : 11),
    letterSpacing: "0.32em",
    textTransform: "uppercase",
    fontWeight: 800,
    color: INK,
    lineHeight: 1,
  };

  return (
    <div className={`sbs-canvas sbs-${layout.name}`} aria-hidden="true">
      <div className="sbs-camera" data-sbs="camera" style={{ transformOrigin: origin }}>
        {(Object.keys(b) as ElementId[]).map((id) =>
          pieces[id] ? (
            <Positioned key={id} id={id} box={b[id]!}>
              {pieces[id]}
            </Positioned>
          ) : null,
        )}
      </div>

      {/* Screen-space captions, outside the camera */}
      <div style={{ ...capBox(cap.opening), display: "flex", alignItems: "center" }}>
        <div data-sbs="opening" style={{ ...labelStyle, display: "flex", alignItems: "center", gap: u(14) }}>
          <span style={{ width: u(28), height: u(1.5), background: GOLD }} />
          {c.captions.opening}
        </div>
      </div>

      <div style={{ ...capBox(cap.closing), display: "flex", alignItems: "flex-end" }}>
        <div
          data-sbs="closing"
          style={{
            fontFamily: serif,
            fontSize: u(layout.name === "mobile" ? 40 : 34),
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            color: INK,
            maxWidth: u(layout.name === "mobile" ? 700 : 520),
          }}
        >
          {c.captions.closing}
        </div>
      </div>

      <div
        style={{
          ...capBox(cap.pillars),
          display: "flex",
          alignItems: "center",
          justifyContent: cap.align === "right" ? "flex-end" : "flex-start",
          gap: u(layout.name === "mobile" ? 14 : 10),
          ...labelStyle,
          fontWeight: 700,
          letterSpacing: "0.24em",
        }}
      >
        {c.captions.pillars.map((p, i) => (
          <span key={p.key} style={{ display: "contents" }}>
            {i > 0 && <span style={{ color: SLATE, opacity: 0.6, letterSpacing: 0 }}>·</span>}
            <span data-sbs={`pillar-${p.key}`}>{p.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <div style={{ fontFamily: sans, fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: INK, marginBottom: 14, fontWeight: 800 }}>
    {children}
  </div>
);

export type SmallBusinessShowcaseProps = {
  content?: ShowcaseContent;
  /** Hide the section heading when embedding the canvas somewhere else. */
  bare?: boolean;
  id?: string;
};

/**
 * Animated "entire digital presence" showcase for the Small Business page.
 * The loop runs in CSS, paused until at least a quarter of the canvas is in
 * view. Reduced-motion users get the final ecosystem frame, static.
 */
export default function SmallBusinessShowcase({ content = showcaseContent, bare = false, id = "what-you-get" }: SmallBusinessShowcaseProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      el?.setAttribute("data-playing", "true");
      return;
    }
    // Toggle an attribute, not React state: no re-render while it plays.
    const io = new IntersectionObserver(
      ([entry]) => el.setAttribute("data-playing", String(entry.intersectionRatio >= 0.25)),
      { threshold: [0, 0.25, 0.5] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const s = content.section;
  const allLabels = content.captions.pillars.map((p) => p.label).join(", ");

  return (
    <section id={id} style={{ background: IVORY, color: INK, padding: bare ? 0 : "96px 24px", borderTop: bare ? undefined : `1px solid ${LINE_DARK}` }}>
      <style>{css(content)}</style>
      <div style={{ maxWidth: bare ? undefined : MAXW + 160, margin: "0 auto" }}>
        {!bare && (
          <div style={{ maxWidth: MAXW, margin: "0 auto 48px", display: "grid", gap: 16 }}>
            <div>
              <SectionLabel>{s.label}</SectionLabel>
              <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(28px, 3.6vw, 44px)", lineHeight: 1.08, letterSpacing: "-0.02em", margin: 0, maxWidth: 820 }}>{s.heading}</h2>
            </div>
            <p style={{ fontFamily: sans, fontSize: 15, lineHeight: 1.6, color: "rgba(17,17,19,0.7)", margin: 0, maxWidth: 640 }}>{s.body}</p>
          </div>
        )}
        <div
          ref={rootRef}
          className="sbs-root"
          data-motion="on"
          role="img"
          aria-label={`${content.captions.closing} A ${content.business.descriptor.toLowerCase()} shown across ${allLabels}: logo, typefaces and color palette, a desktop website, an Instagram profile, ad creatives and a Google search listing.`}
        >
          <Stage layout={LAYOUTS.desktop} c={content} />
          <Stage layout={LAYOUTS.mobile} c={content} />
        </div>
      </div>
    </section>
  );
}
