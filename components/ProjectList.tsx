"use client";

import { useMemo, useState } from "react";
import ProjectRow from "./ProjectRow";
import { KINDS } from "@/content/site";
import type { Project } from "@/lib/projects";

/**
 * Project index with client-side filtering. Chips filter in place —
 * no navigation, no layout animation beyond a simple fade.
 */
export default function ProjectList({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<string>("All");

  // Only show a chip if something actually uses that kind.
  const chips = useMemo(
    () => ["All", ...KINDS.filter((k) => projects.some((p) => p.kind === k))],
    [projects],
  );

  const visible = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.kind === filter)),
    [projects, filter],
  );

  return (
    <>
      <div
        id="projects"
        className="flex scroll-mt-8 flex-wrap items-baseline justify-between gap-4 border-t-2 border-ink pb-6 pt-5 gutter"
      >
        <h2 className="eyebrow">
          {projects.length} things I&rsquo;ve made
        </h2>

        <div
          role="group"
          aria-label="Filter projects by kind"
          className="flex flex-wrap gap-2 text-[13px] font-semibold"
        >
          {chips.map((c) => {
            const active = c === filter;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(c)}
                className={
                  active
                    ? "rounded-full bg-ink px-[14px] py-[6px] text-paper"
                    : "rounded-full border border-hairline px-[14px] py-[6px] text-sub-text transition-colors duration-[120ms] hover:border-ink"
                }
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-[18px] pb-14 gutter">
        {visible.map((p) => (
          <ProjectRow key={p.slug} project={p} />
        ))}
      </div>
    </>
  );
}
