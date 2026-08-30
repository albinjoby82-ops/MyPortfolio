import Link from "next/link";
import type { Project } from "@/lib/projects";

/**
 * One project row. The whole card is a single link to the detail page.
 * Hover lifts it and grows the hard shadow — the motion is dropped
 * automatically under prefers-reduced-motion (see globals.css).
 */
export default function ProjectRow({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group grid grid-cols-1 items-center gap-7 rounded-[16px] border-2 border-ink bg-card p-[18px] shadow-[var(--shadow-hard)] transition-[transform,box-shadow] duration-[120ms] ease-out hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[var(--shadow-hard-lifted)] md:grid-cols-[300px_1fr_130px]"
    >
      {/* Media — real image when supplied, tinted placeholder until then. */}
      <div
        className="flex aspect-[4/3] items-center justify-center rounded-[10px] bg-cover bg-center text-[13px] font-bold text-[rgba(22,24,29,0.45)]"
        style={{
          backgroundColor: project.tint,
          backgroundImage: project.media.src
            ? `url(${project.media.src})`
            : undefined,
        }}
      >
        {!project.media.src &&
          (project.media.type === "video" ? "video ▶" : "photo")}
      </div>

      <div>
        <div className="mb-2 flex items-center gap-[10px]">
          <span className="font-display text-[13px] font-bold text-rust">
            {project.no}
          </span>
          <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-muted">
            {project.kind}
          </span>
          {/* On narrow screens the year joins the kind label. */}
          <span className="font-display ml-auto text-[13px] font-bold text-ink md:hidden">
            {project.year}
          </span>
        </div>

        <h3 className="font-display text-[34px] font-bold leading-none tracking-[-0.025em]">
          {project.title}
        </h3>

        <p className="pretty mb-[14px] mt-2 max-w-[60ch] text-[15.5px] leading-[1.55]">
          {project.blurb}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-[6px] bg-chip-bg px-3 py-[5px] text-[13px] font-semibold text-sub-text"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="hidden text-right md:block">
        <div className="font-display text-[15px] font-bold text-ink">
          {project.year}
        </div>
        <div className="mt-[10px] text-[24px] leading-none text-ink">↗</div>
      </div>
    </Link>
  );
}
