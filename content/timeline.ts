/**
 * Chronology of work — events run and things built, newest first.
 * No job titles by design: entries describe what was done, which
 * stays true permanently in a way a position doesn't.
 *
 * `slug` links an entry through to its project page.
 */

export type TimelineEntry = {
  year: string;
  title: string;
  body: string;
  slug?: string;
};

export const timeline: TimelineEntry[] = [
  {
    year: "2026",
    title: "Set up the Dublin Micromouse Open",
    body: "Wrote the competition format and technical rules for a national micromouse competition hosted by UCD ElecSoc, secured sponsorship and prize support from engineering companies, and set up how the event ran.",
    slug: "dublin-micromouse-open",
  },
  {
    year: "2026",
    title: "Co-hosted Robo Expo",
    body: "A robotics exhibition at UCD — logistics, live demos and student project showcases, aimed at getting more students across campus interested in robotics.",
    slug: "robo-expo",
  },
  {
    year: "2026",
    title: "Founded Hack Club at UCD",
    body: "Set it up to guide UCD teams into external hackathons and engineering challenges, and to give students the support they needed to form teams and compete.",
  },
  {
    year: "2025",
    title: "Co-founded GaelForce UCD",
    body: "Ireland's first VEX U robotics team, built from nothing. I took the mechanical side of the competition robot: CAD, 3D printing, prototyping and testing.",
    slug: "gaelforce-ucd",
  },
  {
    year: "2025",
    title: "Started Cubi",
    body: "A custom NFC hardware product — housing designed in CAD and printed myself, a web configurator for customers to personalise their own, plus firmware, manufacturing and the business side.",
    slug: "cubi",
  },
  {
    year: "2025",
    title: "Began running MakerLabs workshops",
    body: "Hands-on sessions in electronics, robotics and rapid prototyping. I plan and run them, write the material and demos, and help beginners get unstuck.",
    slug: "makerlabs",
  },
  {
    year: "2025",
    title: "Started Engineering at UCD",
    body: "Entered University College Dublin with 589 points in the Leaving Certificate from St Aidan's CBS, Dublin 9.",
  },
  {
    year: "2025",
    title: "Led a Green Schools campaign",
    body: "As part of the Green Schools Committee at St Aidan's, helped lead the school to its first Green Flag for Global Citizenship & Energy.",
  },
];
