import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Kind } from "@/content/site";

export type Spec = { key: string; value: string };
export type Note = { heading: string; body: string };
export type ProjectLink = { label: string; href: string };

export type Media = {
  type: "video" | "photo";
  src?: string;
  poster?: string;
  caption?: string;
};

export type Project = {
  /** Display index, "01".."99". Derived from sort order, not authored. */
  no: string;
  slug: string;
  kind: Kind;
  title: string;
  blurb: string;
  tags: string[];
  year: string;
  /** Sort key — the numeric year the work started. */
  sortYear: number;
  /** Manual ordering. Lower sorts first; unset falls back to year. */
  order: number;
  tint: string;
  lede: string;
  media: Media;
  specs: Spec[];
  notes: Note[];
  photos: string[];
  /** Optional outbound links — live site, repo, write-up. */
  links: ProjectLink[];
  /** Optional long-form MDX body. */
  body: string;
};

const DIR = path.join(process.cwd(), "content", "projects");

/**
 * Reads every .mdx file in content/projects, newest first.
 * Adding a project is dropping a file in that folder — the home page,
 * filters and detail routes all follow automatically.
 */
export function getProjects(): Project[] {
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".mdx"));

  const parsed = files.map((file) => {
    const raw = fs.readFileSync(path.join(DIR, file), "utf8");
    const { data, content } = matter(raw);
    return {
      slug: data.slug ?? file.replace(/\.mdx$/, ""),
      kind: data.kind,
      title: data.title,
      blurb: data.blurb ?? "",
      tags: data.tags ?? [],
      year: data.year ?? "",
      sortYear: Number(data.sortYear ?? 0),
      order: Number(data.order ?? Number.MAX_SAFE_INTEGER),
      tint: data.tint ?? "#E4DDCC",
      lede: data.lede ?? data.blurb ?? "",
      media: data.media ?? { type: "photo" },
      specs: data.specs ?? [],
      notes: data.notes ?? [],
      photos: data.photos ?? [],
      links: data.links ?? [],
      body: content.trim(),
    };
  });

  // Explicit `order` wins so the strongest work can lead regardless of date;
  // anything without one falls back to newest-first.
  parsed.sort(
    (a, b) =>
      a.order - b.order ||
      b.sortYear - a.sortYear ||
      a.title.localeCompare(b.title),
  );

  return parsed.map((p, i) => ({
    ...p,
    no: String(i + 1).padStart(2, "0"),
  }));
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}
