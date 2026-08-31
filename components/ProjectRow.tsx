import Link from "next/link";
import type { Project } from "@/lib/projects";

const cubiBadgeIcons: Record<string, string> = {
  Claude: "/brands/claude.svg",
  Codex: "/brands/codex.svg",
  Stripe: "/brands/stripe.svg",
  "Bambu Studio": "/brands/bambu-studio.svg",
  Cloudflare: "/brands/cloudflare.svg",
  GitHub: "/brands/github.svg",
  "VS Code": "/brands/vs-code.svg",
  React: "/brands/react.svg",
  TypeScript: "/brands/typescript.svg",
  Firebase: "/brands/firebase.svg",
  WebAssembly: "/brands/webassembly.svg",
  Fusion: "/brands/fusion.svg",
  Obsidian: "/brands/obsidian.svg",
};

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
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[10px] bg-cover bg-center text-[13px] font-bold text-[rgba(22,24,29,0.45)]"
        style={{
          backgroundColor: project.tint,
          backgroundImage: project.media.src && project.slug !== "cubi"
            ? `url(${project.media.src})`
            : undefined,
        }}
      >
        {project.slug === "cubi" && project.media.src && (
          <div className="absolute inset-0 grid grid-cols-[58%_42%] bg-[#111525]">
            <img
              src={project.media.src}
              alt="Finished Cubi Base beside the printer used to manufacture it"
              className="h-full w-full object-cover object-center"
            />
            <div className="flex flex-col justify-between bg-sun p-4 text-ink">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.15em]">
                Built end to end
              </span>
              <div>
                <span className="block font-display text-[28px] font-extrabold leading-[0.82] tracking-[-0.06em]">
                  CUBI
                </span>
                <span className="mt-2 block text-[9px] font-bold uppercase leading-[1.35] tracking-[0.08em]">
                  Browser<br />to Bambu<br />to product
                </span>
              </div>
              <span className="text-[16px] leading-none">↘</span>
            </div>
          </div>
        )}
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
          {project.tags.map((t) =>
            project.slug === "cubi" && cubiBadgeIcons[t] ? (
              <span
                key={t}
                title={t}
                aria-label={t}
                className="flex h-10 w-10 items-center justify-center rounded-[9px] border border-hairline bg-chip-bg"
              >
                <img
                  src={cubiBadgeIcons[t]}
                  alt=""
                  aria-hidden="true"
                  className="h-[21px] w-[21px] object-contain"
                />
              </span>
            ) : (
              <span
                key={t}
                className="rounded-[6px] bg-chip-bg px-3 py-[5px] text-[13px] font-semibold text-sub-text"
              >
                {t}
              </span>
            ),
          )}
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
