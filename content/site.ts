/**
 * Everything about you that isn't a project.
 * This is the file to edit when details change — nothing here is
 * hardcoded into a component.
 */

export const site = {
  /** Nav wordmark. */
  wordmark: "ALBIN J.",
  name: "Albin Andrews Joby",
  /** Live origin. Link previews (Open Graph) build absolute URLs from this. */
  url: "https://myportfolio.albinjoby82.workers.dev", // TODO: change once a custom domain is attached
  /** Image shown when the home page (or a project with no cover) is shared. */
  shareImage: "/projects/galeforce/galeforce-main.jpg",

  /** Rotated yellow tag above the hero headline. */
  heroTag: "Stage 2 at UCD · builds things that move",

  /** 86px display headline. Keep it short — it wraps at 12ch. */
  heroHeadline: "Robots, circuit boards, and a team built from scratch.",

  heroLede:
    "Stage 2 Electrical and Electronic Engineering student at University College Dublin. I'm Co-founder and Head of Electronics at GaelForce UCD, Ireland's first VEX U robotics team, and an Electrical Engineer at UCD Formula Student, where I'm developing the accumulator (the car's high-voltage battery pack). My focus is embedded systems, PCB design, motor control, 3D printing and rapid prototyping.",

  /** Hero buttons. */
  primaryCta: { label: "See what I've built", href: "#projects" },
  secondaryCta: { label: "Email me", href: "mailto:albin.andrewsjoby@ucdconnect.ie" },

  resume: { label: "Résumé ↓", href: "/albin-joby-cv.pdf" },

  /**
   * The "On the bench" panel — a snapshot of right now.
   * Update these freely; they're meant to look current.
   */
  bench: [
    { key: "Right now", value: "Odometry pod V2 firmware · FS accumulator" },
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
      { label: "LinkedIn", href: "https://www.linkedin.com/in/albin-andrews-joby-94a045404", accent: false },
    ],
  },
} as const;

/** Filter chips on the home page, in display order. */
export const KINDS = ["Robotics", "Hardware", "Electronics", "Events", "Software"] as const;
export type Kind = (typeof KINDS)[number];
