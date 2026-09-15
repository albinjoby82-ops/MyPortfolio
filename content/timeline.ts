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

export const timeline: TimelineEntry[] = [];
