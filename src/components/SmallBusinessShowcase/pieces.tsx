/**
 * Presentational pieces of the showcase. Pure layout, no timing.
 * All sizes are stage units via `u()`, so the canvas stays sharp at any width.
 * `data-sbs` hooks are the only link to the animation.
 */

import type { CSSProperties, ReactNode } from "react";
import { GOLD, INK, IVORY, LINE_DARK, SLATE, SHADOW_CARD, sans } from "@/brand/tokens";
import type { ImageAsset, ShowcaseContent } from "./showcase-data";

export const u = (n: number) => `calc(var(--u) * ${n})`;

export const shadow = (k = 1) =>
  SHADOW_CARD.map(([x, y, b, c]) => `${u(x * k)} ${u(y * k)} ${u(b * k)} ${c}`).join(", ");

const SURFACE = "#FFFFFF";
const SURFACE_SUBTLE = "hsl(0 0% 96%)";

const label = (size = 6.5): CSSProperties => ({
  fontFamily: sans,
  fontSize: u(size),
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  fontWeight: 700,
  color: SLATE,
  lineHeight: 1,
});

export function Img({ asset, style, eager }: { asset: ImageAsset; style?: CSSProperties; eager?: boolean }) {
  const fill: CSSProperties = { width: "100%", height: "100%", objectFit: "cover", display: "block", ...style };
  return (
    <picture style={{ display: "block", width: "100%", height: "100%" }}>
      {asset.avif && <source srcSet={asset.avif} type="image/avif" />}
      {asset.webp && <source srcSet={asset.webp} type="image/webp" />}
      <img src={asset.src} alt="" loading={eager ? "eager" : "lazy"} decoding="async" draggable={false} style={fill} />
    </picture>
  );
}

const Card = ({ children, style, dark }: { children: ReactNode; style?: CSSProperties; dark?: boolean }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: dark ? INK : SURFACE,
      color: dark ? IVORY : INK,
      borderRadius: u(14),
      boxShadow: shadow(),
      overflow: "hidden",
      position: "relative",
      ...style,
    }}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// Website (visual anchor)
// ---------------------------------------------------------------------------

export function WebsiteMock({ c }: { c: ShowcaseContent }) {
  const { website: w, business: b, brand } = c;
  const [rye, crust, , oat] = brand.palette.map((p) => p.hex);
  const display = brand.typefaces.primary.family;
  const text = brand.typefaces.secondary.family;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: u(10),
        overflow: "hidden",
        background: SURFACE,
        boxShadow: `${shadow(1.4)}, 0 0 0 ${u(1)} ${LINE_DARK}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Browser chrome */}
      <div style={{ height: u(30), flex: "none", display: "flex", alignItems: "center", padding: `0 ${u(12)}`, borderBottom: `${u(1)} solid ${LINE_DARK}`, position: "relative" }}>
        <div style={{ display: "flex", gap: u(5) }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: u(7), height: u(7), borderRadius: 999, background: SLATE, opacity: 0.35 }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: u(230), height: u(17), borderRadius: 999, background: SURFACE_SUBTLE, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: sans, fontSize: u(8), color: SLATE, letterSpacing: "0.02em" }}>
          {b.url}
        </div>
      </div>

      {w.screenshot ? (
        <div style={{ flex: 1, minHeight: 0 }}>
          <Img asset={w.screenshot} style={{ objectPosition: "top" }} eager />
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 0, background: oat, color: rye, display: "flex", flexDirection: "column", fontFamily: text }}>
          {/* Nav */}
          <div style={{ height: u(46), flex: "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${u(30)}` }}>
            <div style={{ fontFamily: display, fontSize: u(15), letterSpacing: "-0.01em" }}>
              {b.wordmark.first} <span style={{ color: crust, fontStyle: "italic" }}>{b.wordmark.joiner}</span> {b.wordmark.last}
            </div>
            <div style={{ display: "flex", gap: u(20), fontSize: u(8.5), fontWeight: 500 }}>
              {w.nav.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
            <div style={{ background: rye, color: oat, fontSize: u(6.5), fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", padding: `${u(7)} ${u(12)}`, borderRadius: u(6) }}>{w.navCta}</div>
          </div>

          {/* Hero */}
          <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: u(22), padding: `${u(6)} ${u(30)} ${u(18)}` }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: u(12) }}>
              <div style={{ fontSize: u(7), fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: crust }}>{w.eyebrow}</div>
              <div style={{ fontFamily: display, fontSize: u(42), lineHeight: 1.0, letterSpacing: "-0.02em" }}>{w.headline}</div>
              <div style={{ fontSize: u(9.5), lineHeight: 1.55, opacity: 0.72, maxWidth: u(250) }}>{w.body}</div>
              <div style={{ display: "flex", gap: u(8), marginTop: u(4) }}>
                <span style={{ background: rye, color: oat, fontSize: u(6.5), fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", padding: `${u(9)} ${u(14)}`, borderRadius: u(6) }}>{w.cta}</span>
                <span style={{ border: `${u(1)} solid ${rye}33`, fontSize: u(6.5), fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", padding: `${u(9)} ${u(14)}`, borderRadius: u(6) }}>{w.secondaryCta}</span>
              </div>
            </div>
            <div style={{ borderRadius: u(6), overflow: "hidden", minHeight: 0 }}>
              <Img asset={w.hero} eager />
            </div>
          </div>

          {/* Highlights strip */}
          <div style={{ height: u(54), flex: "none", display: "grid", gridTemplateColumns: `repeat(${w.highlights.length}, 1fr)`, borderTop: `${u(1)} solid ${rye}1f`, margin: `0 ${u(30)}` }}>
            {w.highlights.map((h, i) => (
              <div key={h} style={{ display: "flex", alignItems: "center", gap: u(8), fontSize: u(7), fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", borderLeft: i ? `${u(1)} solid ${rye}1f` : "none", paddingLeft: i ? u(14) : 0 }}>
                <span style={{ fontFamily: display, fontSize: u(11), letterSpacing: 0, color: crust }}>0{i + 1}</span>
                {h}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Brand system
// ---------------------------------------------------------------------------

export function LogoCard({ c }: { c: ShowcaseContent }) {
  const { business: b, brand } = c;
  return (
    <Card dark>
      <div data-sbs="logo-mask" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {brand.logo ? (
          <div style={{ width: "62%", height: "62%" }}>
            <Img asset={brand.logo} style={{ objectFit: "contain" }} />
          </div>
        ) : (
          <div style={{ fontFamily: brand.typefaces.primary.family, textAlign: "center", lineHeight: 0.92, letterSpacing: "-0.01em" }}>
            <div style={{ fontSize: u(30) }}>{b.wordmark.first}</div>
            <div style={{ fontSize: u(24), color: GOLD, fontStyle: "italic", margin: `${u(2)} 0` }}>{b.wordmark.joiner}</div>
            <div style={{ fontSize: u(30) }}>{b.wordmark.last}</div>
          </div>
        )}
        <div style={{ ...label(5.5), color: "rgba(249,250,251,0.55)", position: "absolute", bottom: u(16) }}>{b.established}</div>
      </div>
    </Card>
  );
}

export function TypePrimaryCard({ c }: { c: ShowcaseContent }) {
  const t = c.brand.typefaces.primary;
  return (
    <Card>
      <div data-sbs="typePrimary-mask" style={{ position: "absolute", inset: 0, padding: u(16), display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ fontFamily: t.family, fontSize: u(84), lineHeight: 0.82, letterSpacing: "-0.03em" }}>{t.sample}</div>
          <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: u(6) }}>
            <div style={label(5.5)}>{t.role}</div>
            <div style={{ fontFamily: sans, fontSize: u(10), fontWeight: 600 }}>{t.name}</div>
          </div>
        </div>
        <div style={{ fontFamily: t.family, fontSize: u(11), lineHeight: 1.35, color: SLATE, letterSpacing: "0.01em" }}>
          ABCDEFGHIJKLMN abcdefghijklmn
          <br />
          0123456789 &amp; ?!
        </div>
      </div>
    </Card>
  );
}

export function TypeSecondaryCard({ c }: { c: ShowcaseContent }) {
  const t = c.brand.typefaces.secondary;
  return (
    <Card style={{ padding: u(14), display: "flex", alignItems: "center", gap: u(14) }}>
      <div style={{ fontFamily: t.family, fontSize: u(38), fontWeight: 600, lineHeight: 1, letterSpacing: "-0.03em" }}>{t.sample}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: u(5), minWidth: 0 }}>
        <div style={label(5.5)}>{t.role}</div>
        <div style={{ fontFamily: t.family, fontSize: u(11), fontWeight: 600 }}>{t.name}</div>
        <div style={{ fontFamily: t.family, fontSize: u(7), color: SLATE }}>Regular · Medium · Bold</div>
      </div>
    </Card>
  );
}

export function PaletteCard({ c }: { c: ShowcaseContent }) {
  return (
    <Card style={{ padding: u(8), display: "flex", gap: u(6) }}>
      {c.brand.palette.map((s, i) => (
        <div key={s.hex} data-sbs={`swatch-${i}`} style={{ flex: 1, display: "flex", flexDirection: "column", gap: u(5), minWidth: 0 }}>
          <div style={{ flex: 1, background: s.hex, borderRadius: u(4), boxShadow: `inset 0 0 0 ${u(1)} ${LINE_DARK}` }} />
          <div style={{ ...label(4.8), letterSpacing: "0.18em", color: INK, whiteSpace: "nowrap" }}>{s.name}</div>
        </div>
      ))}
    </Card>
  );
}

export function BusinessCard({ c }: { c: ShowcaseContent }) {
  const { business: b, brand } = c;
  const display = brand.typefaces.primary.family;
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Back of card, peeking out behind */}
      <div style={{ position: "absolute", inset: 0, transform: `translate(${u(16)}, ${u(-12)}) rotate(4deg)` }}>
        <Card dark style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: display, fontSize: u(44), color: GOLD, fontStyle: "italic" }}>{b.wordmark.joiner}</span>
        </Card>
      </div>
      <div style={{ position: "absolute", inset: 0 }}>
        <Card style={{ padding: u(16), display: "flex", flexDirection: "column", justifyContent: "space-between", background: IVORY }}>
          <div>
            <div style={{ fontFamily: display, fontSize: u(17), letterSpacing: "-0.01em" }}>
              {b.wordmark.first} <span style={{ color: GOLD, fontStyle: "italic" }}>{b.wordmark.joiner}</span> {b.wordmark.last}
            </div>
            <div style={{ width: u(22), height: u(1.5), background: GOLD, marginTop: u(8) }} />
          </div>
          <div style={{ fontFamily: sans, fontSize: u(7), lineHeight: 1.6, color: SLATE }}>
            <div style={{ ...label(5.5), color: INK, marginBottom: u(5) }}>{b.descriptor}</div>
            {b.address}
            <br />
            {b.phone} · {b.url}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Social
// ---------------------------------------------------------------------------

const Avatar = ({ c, size }: { c: ShowcaseContent; size: number }) => (
  <div style={{ width: u(size), height: u(size), borderRadius: 999, background: INK, color: IVORY, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 ${u(size * 0.04)} ${SURFACE}, 0 0 0 ${u(size * 0.08)} ${GOLD}`, flex: "none", fontFamily: c.brand.typefaces.primary.family, fontSize: u(size * 0.34), letterSpacing: "-0.02em" }}>
    {c.business.wordmark.first[0]}
    <span style={{ color: GOLD, fontStyle: "italic" }}>{c.business.wordmark.joiner}</span>
    {c.business.wordmark.last[0]}
  </div>
);

export function PhoneMock({ c }: { c: ShowcaseContent }) {
  const ig = c.instagram;
  return (
    <div style={{ width: "100%", height: "100%", background: INK, borderRadius: u(34), padding: u(7), boxShadow: shadow(1.5) }}>
      <div style={{ width: "100%", height: "100%", background: SURFACE, borderRadius: u(27), overflow: "hidden", display: "flex", flexDirection: "column", fontFamily: sans, color: INK }}>
        {/* Status bar + notch */}
        <div style={{ height: u(24), flex: "none", position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${u(18)}`, fontSize: u(7), fontWeight: 600 }}>
          <span>9:41</span>
          <span style={{ position: "absolute", left: "50%", top: u(6), transform: "translateX(-50%)", width: u(62), height: u(15), borderRadius: 999, background: INK }} />
          <span style={{ display: "flex", gap: u(2) }}>
            {[4, 6, 8].map((h) => (
              <span key={h} style={{ width: u(2.5), height: u(h), background: INK, borderRadius: u(1), alignSelf: "flex-end" }} />
            ))}
          </span>
        </div>
        {/* Handle */}
        <div style={{ padding: `${u(4)} ${u(12)}`, fontSize: u(10), fontWeight: 700, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {c.business.handle}
          <span style={{ display: "flex", gap: u(8) }}>
            <span style={{ width: u(10), height: u(10), borderRadius: u(3), border: `${u(1.3)} solid ${INK}` }} />
            <span style={{ width: u(10), height: u(1.3), background: INK, boxShadow: `0 ${u(3.5)} 0 ${INK}, 0 ${u(-3.5)} 0 ${INK}`, alignSelf: "center" }} />
          </span>
        </div>
        {/* Profile */}
        <div style={{ padding: `${u(8)} ${u(12)} 0`, display: "flex", alignItems: "center", gap: u(14) }}>
          <Avatar c={c} size={50} />
          <div style={{ flex: 1, display: "flex", justifyContent: "space-between" }}>
            {ig.stats.map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: u(10), fontWeight: 700 }}>{s.value}</div>
                <div style={{ fontSize: u(6.5), color: SLATE }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: `${u(8)} ${u(12)} 0`, fontSize: u(7.5), lineHeight: 1.45 }}>
          <div style={{ fontWeight: 700 }}>{c.business.name}</div>
          <div style={{ color: SLATE }}>{c.business.descriptor}</div>
          <div>{ig.bio}</div>
        </div>
        <div style={{ padding: `${u(8)} ${u(12)}`, display: "flex", gap: u(5) }}>
          {["Following", "Message", "Order"].map((t) => (
            <span key={t} style={{ flex: 1, textAlign: "center", fontSize: u(6.5), fontWeight: 600, background: SURFACE_SUBTLE, borderRadius: u(6), padding: `${u(5)} 0` }}>{t}</span>
          ))}
        </div>
        <div style={{ borderTop: `${u(1)} solid ${LINE_DARK}`, display: "flex", justifyContent: "center", padding: `${u(5)} 0` }}>
          <span style={{ width: u(40), height: u(1.5), background: INK }} />
        </div>
        {/* Grid populates tile by tile */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: u(1.5) }}>
          {ig.grid.map((g, i) => (
            <div key={i} data-sbs={`tile-${i}`} style={{ aspectRatio: "1", overflow: "hidden", background: SURFACE_SUBTLE }}>
              <Img asset={g} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PostCard({ c, post }: { c: ShowcaseContent; post: ShowcaseContent["instagram"]["featured"][number] }) {
  return (
    <Card style={{ display: "flex", flexDirection: "column", padding: u(8), gap: u(7), borderRadius: u(10) }}>
      <div style={{ display: "flex", alignItems: "center", gap: u(6), fontFamily: sans, fontSize: u(7), fontWeight: 700 }}>
        <Avatar c={c} size={15} />
        {c.business.handle}
      </div>
      <div style={{ flex: 1, minHeight: 0, borderRadius: u(4), overflow: "hidden" }}>
        <Img asset={post.image} />
      </div>
      <div style={{ fontFamily: sans, fontSize: u(7), lineHeight: 1.3 }}>
        <span style={{ fontWeight: 700 }}>{c.business.handle}</span> {post.caption}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Ads + search
// ---------------------------------------------------------------------------

export function AdCard({ c, ad }: { c: ShowcaseContent; ad: ShowcaseContent["ads"][number] }) {
  return (
    <Card style={{ display: "flex", flexDirection: "column", borderRadius: u(10) }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Img asset={ad.image} />
      </div>
      <div style={{ padding: `${u(9)} ${u(10)} ${u(10)}`, display: "flex", flexDirection: "column", gap: u(6) }}>
        <div style={label(5)}>Sponsored · {c.business.name}</div>
        <div style={{ fontFamily: c.brand.typefaces.primary.family, fontSize: u(12), lineHeight: 1.08, letterSpacing: "-0.01em" }}>{ad.headline}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `${u(1)} solid ${LINE_DARK}`, paddingTop: u(6), fontFamily: sans, fontSize: u(6), fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          {ad.cta}
          <span style={{ color: GOLD, letterSpacing: 0, fontSize: u(9) }}>→</span>
        </div>
      </div>
    </Card>
  );
}

export function SearchCard({ c }: { c: ShowcaseContent }) {
  const s = c.search;
  const full = Math.round(s.rating);
  return (
    <Card>
      <div data-sbs="search-mask" style={{ position: "absolute", inset: 0, padding: u(14), display: "flex", flexDirection: "column", gap: u(12), fontFamily: sans }}>
        {/* Search field */}
        <div style={{ height: u(28), flex: "none", borderRadius: 999, background: SURFACE_SUBTLE, display: "flex", alignItems: "center", gap: u(8), padding: `0 ${u(12)}` }}>
          <span style={{ width: u(8), height: u(8), borderRadius: 999, border: `${u(1.4)} solid ${SLATE}`, position: "relative", flex: "none" }}>
            <span style={{ position: "absolute", width: u(4), height: u(1.4), background: SLATE, right: u(-4), bottom: u(-2), transform: "rotate(45deg)" }} />
          </span>
          <span data-sbs="typing" style={{ fontSize: u(9), color: INK, whiteSpace: "nowrap" }}>{s.query}</span>
        </div>
        {/* Business profile */}
        <div style={{ flex: 1, minHeight: 0, display: "flex", gap: u(14) }}>
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: u(6) }}>
            <div data-sbs="row-0" style={{ fontSize: u(13), fontWeight: 600, letterSpacing: "-0.01em" }}>{s.title}</div>
            <div data-sbs="row-1" style={{ display: "flex", alignItems: "center", gap: u(5), fontSize: u(8), color: SLATE, whiteSpace: "nowrap" }}>
              <span style={{ color: INK, fontWeight: 600 }}>{s.rating.toFixed(1)}</span>
              <span style={{ color: GOLD, letterSpacing: "0.08em" }}>{"★".repeat(full)}</span>
              <span>({s.reviews})</span>
              <span>· {s.category} · {s.price}</span>
            </div>
            <div data-sbs="row-2" style={{ fontSize: u(8), color: SLATE }}>
              <span style={{ color: INK, fontWeight: 600 }}>{s.status}</span> · {s.hours}
            </div>
            <div data-sbs="row-3" style={{ display: "flex", gap: u(5), marginTop: "auto" }}>
              {s.actions.map((a) => (
                <span key={a} style={{ fontSize: u(6.5), fontWeight: 600, padding: `${u(4)} ${u(9)}`, borderRadius: 999, border: `${u(1)} solid ${LINE_DARK}` }}>{a}</span>
              ))}
            </div>
          </div>
          <div style={{ width: u(92), flex: "none", borderRadius: u(8), overflow: "hidden" }}>
            <Img asset={s.map} />
          </div>
        </div>
      </div>
    </Card>
  );
}
