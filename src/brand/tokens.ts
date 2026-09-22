/**
 * UX Signal Studio design tokens.
 *
 * Mirrors the exports of `src/pages/IndexV2.tsx` in the Lovable project
 * ("Ash's Portfolio Hub"), which is the source of truth for the editorial
 * brand system. When this component is moved into that project, delete this
 * file and import the same names from "@/pages/IndexV2" instead.
 */

export const INK = "#111113";
export const INK_SOFT = "#1B1B1E";
export const IVORY = "#F9FAFB";
export const GOLD = "#B8955A";
export const SLATE = "#8A8A93";
export const LINE = "rgba(241,236,227,0.10)";
export const LINE_DARK = "rgba(17,17,19,0.12)";

export const serif = "'DM Serif Display', 'Noto Serif Display', Georgia, serif";
export const sans = "'Inter', ui-sans-serif, system-ui, sans-serif";

export const MAXW = 1080;

/** Card elevation used by EndorsementsV2 / WhatIBelieve. Values in px. */
export const SHADOW_CARD = [
  [0, 1, 2, "rgba(17,17,19,0.04)"],
  [0, 12, 40, "rgba(17,17,19,0.08)"],
] as const;

/** Radii used across IndexV2 / ForStartups (buttons 8, cards 14, glass 16). */
export const RADIUS = { button: 8, card: 14, glass: 16 } as const;

/** Easing tokens from styles.css (.page-enter / .micro-lift and .portfolio-fade-in). */
export const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
export const EASE_SOFT = "cubic-bezier(0.2, 0.8, 0.2, 1)";
