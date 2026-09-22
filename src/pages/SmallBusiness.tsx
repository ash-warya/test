/**
 * Preview harness for the Small Business page. The Lovable project has no
 * Small Business route yet; this stands in for it so the section can be
 * reviewed in page context. Only <SmallBusinessShowcase /> is meant to move.
 */
import { SmallBusinessShowcase } from "@/components/SmallBusinessShowcase";
import { INK, IVORY, MAXW, sans, serif } from "@/brand/tokens";

export default function SmallBusiness() {
  return (
    <div style={{ background: INK, minHeight: "100vh", fontFamily: sans }}>
      <header style={{ color: IVORY, padding: "140px 24px 120px" }}>
        <div style={{ maxWidth: MAXW, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 800, marginBottom: 14 }}>UX Signal Studio · Small Business</div>
          <h1 style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.04, letterSpacing: "-0.02em", margin: 0, maxWidth: 820 }}>
            Senior design for the businesses that make a neighborhood.
          </h1>
        </div>
      </header>
      <SmallBusinessShowcase />
      <footer style={{ color: "rgba(241,236,227,0.6)", padding: "88px 24px", textAlign: "center", fontSize: 13 }}>Page continues…</footer>
    </div>
  );
}
