/**
 * CONTENT for the Small Business showcase.
 *
 * Everything the viewer reads or sees lives here. Swap copy, images, fonts
 * and colors in this file; the animation in showcase-motion.ts does not need
 * to change. Every image slot accepts an optional `avif` / `webp` source that
 * is served through <picture> before falling back to `src`.
 *
 * Anything named `placeholder-*` is a stand-in for a real client asset.
 */

import websiteHero from "./assets/placeholder-website-hero.svg";
import post01 from "./assets/placeholder-post-01.svg";
import post02 from "./assets/placeholder-post-02.svg";
import post03 from "./assets/placeholder-post-03.svg";
import post04 from "./assets/placeholder-post-04.svg";
import post05 from "./assets/placeholder-post-05.svg";
import post06 from "./assets/placeholder-post-06.svg";
import ad01 from "./assets/placeholder-ad-01.svg";
import ad02 from "./assets/placeholder-ad-02.svg";
import ad03 from "./assets/placeholder-ad-03.svg";
import mapTile from "./assets/placeholder-map.svg";

export type ImageAsset = {
  src: string;
  avif?: string;
  webp?: string;
  alt: string;
};

export type Typeface = {
  role: string;
  name: string;
  /** CSS font-family stack used to render the specimen. */
  family: string;
  sample: string;
};

export type Swatch = { name: string; hex: string };

export type PillarKey = "brand" | "website" | "social" | "ads" | "seo";

export type ShowcaseContent = typeof showcaseContent;

/** Placeholder client: a neighborhood bakery. Replace with a real engagement. */
export const showcaseContent = {
  section: {
    label: "What You Get",
    heading: "We don't just build your website. We build your entire digital presence.",
    body: "Brand, website, social, ads and search, designed as one system so every place a customer finds you feels like the same business.",
  },

  captions: {
    opening: "Your business, elevated.",
    closing: "Everything your business needs to show up beautifully.",
    /**
     * Running index in the corner of the canvas. It reads as the closing line
     * at the end of the loop. `key` links each label to its highlight window
     * in showcase-motion.ts, so labels can be renamed or reordered freely.
     */
    pillars: [
      { key: "brand", label: "Brand" },
      { key: "website", label: "Website" },
      { key: "seo", label: "SEO" },
      { key: "social", label: "Social" },
      { key: "ads", label: "Ads" },
    ] as { key: PillarKey; label: string }[],
  },

  business: {
    name: "Hearth & Grain",
    wordmark: { first: "Hearth", joiner: "&", last: "Grain" },
    descriptor: "Neighborhood Bakery",
    established: "Est. 2019 · Oakland",
    url: "hearthandgrain.com",
    handle: "hearthandgrain",
    phone: "(510) 555 0142",
    email: "hello@hearthandgrain.com",
    address: "4120 Telegraph Ave, Oakland",
  },

  brand: {
    /** Optional logo image. When empty, the wordmark above is typeset instead. */
    logo: null as ImageAsset | null,
    typefaces: {
      primary: {
        role: "Primary typeface",
        name: "DM Serif Display",
        family: "'DM Serif Display', 'Noto Serif Display', Georgia, serif",
        sample: "Aa",
      } satisfies Typeface,
      secondary: {
        role: "Secondary typeface",
        name: "Inter",
        family: "'Inter', ui-sans-serif, system-ui, sans-serif",
        sample: "Aa",
      } satisfies Typeface,
    },
    palette: [
      { name: "Rye", hex: "#2B2420" },
      { name: "Crust", hex: "#9A6B43" },
      { name: "Wheat", hex: "#D9C3A0" },
      { name: "Oat", hex: "#EFE7DA" },
      { name: "Sage", hex: "#8C9A84" },
    ] satisfies Swatch[],
  },

  website: {
    /**
     * Optional full screenshot of the finished site (16:10). When set it
     * replaces the typeset mock below. Prefer AVIF/WebP at 2x (1600x1000).
     */
    screenshot: null as ImageAsset | null,
    nav: ["Menu", "Visit", "Catering", "Journal"],
    navCta: "Order ahead",
    eyebrow: "Fresh daily from 7 AM",
    headline: "Bread worth waking up for.",
    body: "Naturally leavened loaves, laminated pastry and good coffee, baked in small batches on Telegraph Avenue.",
    cta: "See today's bake",
    secondaryCta: "Find us",
    hero: { src: websiteHero, alt: "Placeholder hero image of a country loaf" } as ImageAsset,
    highlights: ["Country sourdough", "Morning buns", "Weekend pre-orders"],
  },

  instagram: {
    stats: [
      { value: "248", label: "Posts" },
      { value: "12.4K", label: "Followers" },
      { value: "310", label: "Following" },
    ],
    bio: "Small batch bread & pastry. Open daily 7 to 3.",
    /** 3x3 grid inside the phone. Repeats are fine for placeholders. */
    grid: [post01, post02, post03, post04, post05, post06, post02, post03, post01].map(
      (src, i) => ({ src, alt: `Placeholder Instagram post ${i + 1}` }),
    ) as ImageAsset[],
    /** Two standalone posts that slide out beside the phone. */
    featured: [
      { image: { src: post05, alt: "Placeholder featured post" } as ImageAsset, caption: "Saturday bake is up." },
      { image: { src: post04, alt: "Placeholder featured post" } as ImageAsset, caption: "New: rye morning bun." },
    ],
  },

  ads: [
    { image: { src: ad01, alt: "Placeholder ad creative, loaf" } as ImageAsset, headline: "The loaf the neighborhood lines up for.", cta: "Order ahead" },
    { image: { src: ad02, alt: "Placeholder ad creative, arch" } as ImageAsset, headline: "Weekend pre-orders now open.", cta: "Reserve" },
    { image: { src: ad03, alt: "Placeholder ad creative, pastry" } as ImageAsset, headline: "Catering for teams of 10 to 100.", cta: "Get a quote" },
  ],

  search: {
    query: "bakery near me",
    title: "Hearth & Grain",
    rating: 4.9,
    reviews: 312,
    category: "Bakery",
    price: "$$",
    status: "Open",
    hours: "Closes 3 PM",
    map: { src: mapTile, alt: "Placeholder map tile" } as ImageAsset,
    actions: ["Website", "Directions", "Call"],
  },
};
