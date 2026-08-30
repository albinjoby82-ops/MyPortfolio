/**
 * Everything about you that isn't a project.
 * This is the file to edit when details change — nothing here is
 * hardcoded into a component.
 */

export const site = {
  /** Nav wordmark. */
  wordmark: "ALBIN J.",
  name: "Albin Andrews Joby",
  url: "https://albinjoby.com", // TODO: set once a custom domain is attached

  /** Rotated yellow tag above the hero headline. */
  heroTag: "First year at UCD · builds things that move",

  /** 86px display headline. Keep it short — it wraps at 12ch. */
  heroHeadline: "Robots, circuit boards, and a team built from scratch.",

  heroLede:
    "Engineering student at UCD. I co-founded Ireland's first VEX U robotics team, started a small NFC hardware company, and set up a national micromouse competition.",

  /** Hero buttons. */
  primaryCta: { label: "See what I've built", href: "#projects" },
  secondaryCta: { label: "Email me", href: "mailto:albin.andrewsjoby@ucdconnect.ie" },

  resume: { label: "Résumé ↓", href: "/albin-joby-cv.pdf" },

  /**
   * The "On the bench" panel — a snapshot of right now.
   * Update these freely; they're meant to look current.
   */
  bench: [
    { key: "Right now", value: "GaelForce robot v2" },
    { key: "Learning", value: "Embedded control" },
    { key: "Tools", value: "Fusion 360 · KiCad" },
    { key: "Where", value: "Dublin, Ireland" },
  ],

  /** Dark contact band at the foot of the home page. */
  contact: {
    heading: "Want to see something in person?",
    lede: "I'm always up for talking about a build, joining a team, or helping someone else get started.",
    links: [
      {
        label: "albin.andrewsjoby@ucdconnect.ie",
        href: "mailto:albin.andrewsjoby@ucdconnect.ie",
        accent: true,
      },
      { label: "GitHub", href: "https://github.com/albinjoby82-ops", accent: false },
      // TODO: swap for your LinkedIn / Instagram handle
      { label: "LinkedIn", href: "#", accent: false },
    ],
  },
} as const;

/** Filter chips on the home page, in display order. */
export const KINDS = ["Robotics", "Hardware", "Electronics", "Events"] as const;
export type Kind = (typeof KINDS)[number];
