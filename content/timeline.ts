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
    title: "Lock-In study repos",
    body: "Made up a study method and built a repo for each module with it: Solid State Devices, then Digital Electronics with its own quiz site.",
    slug: "lock-in",
  },
  {
    year: "2026",
    title: "Teamly at Hack UCD",
    body: "Built a prototype in one day with Team 5: a team flowchart that routes purchases, budgets and shared equipment.",
    slug: "teamly",
  },
];
