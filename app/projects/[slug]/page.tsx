import Link from "next/link";
import { notFound } from "next/navigation";
import Panel from "@/components/Panel";
import Prose from "@/components/Prose";
import CubiPortal from "@/components/CubiPortal";
import CubiLogoLab from "@/components/CubiLogoLab";
import CubiColourLab from "@/components/CubiColourLab";
import CubiWorkflow from "@/components/CubiWorkflow";
import GaleForceChapterOne from "@/components/GaleForceChapterOne";
import GaleForceSocial from "@/components/GaleForceSocial";
import { getProject, getProjects } from "@/lib/projects";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  return {
    title: project ? `${project.title} | Albin Andrews Joby` : "Not found",
    description: project?.blurb,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const hasSpecs = project.specs.length > 0;

  return (
    <>
      <section className="pb-9 pt-13 gutter">
        <Link
          href="/#projects"
          className="mb-5 inline-block text-[13px] font-bold text-muted transition-colors duration-[120ms] hover:text-ink"
        >
          ← Back to projects
        </Link>

        <div
          className={
            "grid grid-cols-1 items-end gap-14 " +
            (hasSpecs ? "lg:grid-cols-[1fr_380px]" : "")
          }
        >
          <div>
            <span
              className="mb-[18px] inline-block rounded-[6px] px-3 py-[5px] text-[12px] font-bold uppercase tracking-[0.1em] text-ink"
              style={{ backgroundColor: project.tint }}
            >
              {project.no} · {project.kind}
            </span>

            <h1 className="text-[clamp(34px,6.5vw,68px)] font-extrabold leading-[0.96] tracking-[-0.035em]">
              {project.title}
            </h1>

            <p className="pretty mt-[22px] max-w-[56ch] text-[19px] leading-[1.6]">
              {project.lede}
            </p>

            {project.links.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-3">
                {project.links.map((l, i) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className={
                      "rounded-[10px] px-[22px] py-3 text-[15px] font-bold transition-colors duration-[120ms] " +
                      (i === 0
                        ? "bg-rust text-white hover:bg-rust-hover"
                        : "border-2 border-ink text-ink hover:bg-ink hover:text-paper")
                    }
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            )}
          </div>

          {hasSpecs && (
            <Panel header="The numbers" rows={project.specs} rowGap={13} />
          )}
        </div>
      </section>

      {/* Hero media — real video/image when supplied, tinted block until then. */}
      <section className="pb-11 gutter">
        {project.slug === "cubi" && project.media.src ? (
          <div className="grid overflow-hidden rounded-[16px] border-2 border-ink bg-[#111525] shadow-[var(--shadow-hard)] md:grid-cols-[44%_56%]">
            <div className="relative min-h-[520px] overflow-hidden md:min-h-[650px]">
              <img
                src={project.media.src}
                alt="Finished Cubi Base beside the Bambu Lab printer used to manufacture it"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <span className="absolute bottom-5 left-5 rounded-full border border-white/25 bg-black/55 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                Built in Dublin
              </span>
            </div>

            <div className="flex flex-col justify-between bg-sun p-8 text-ink md:p-12">
              <div className="flex items-center justify-between border-b-2 border-ink/20 pb-5 text-[11px] font-extrabold uppercase tracking-[0.14em]">
                <span>From pixels to plastic</span>
                <span>2025 to Present</span>
              </div>

              <div className="py-12 md:py-16">
                <p className="mb-5 text-[12px] font-extrabold uppercase tracking-[0.16em] text-ink/65">
                  One connected workflow
                </p>
                <p className="font-display text-[clamp(42px,6vw,86px)] font-extrabold leading-[0.88] tracking-[-0.065em] text-ink">
                  DESIGN IT.<br />PAY FOR IT.<br />PRINT IT.
                </p>
              </div>

              <div className="grid grid-cols-3 border-t-2 border-ink/20 pt-6">
                {[
                  ["01", "Upload"],
                  ["02", "Customise"],
                  ["03", "Manufacture"],
                ].map(([no, label]) => (
                  <div key={no} className="border-l-2 border-ink/20 pl-4 first:border-l-0 first:pl-0">
                    <span className="block text-[11px] font-extrabold text-ink/55">{no}</span>
                    <span className="mt-1 block text-[12px] font-bold uppercase tracking-[0.06em] md:text-[14px]">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : project.media.src && project.media.type === "video" ? (
          <video
            controls
            playsInline
            poster={project.media.poster}
            className="aspect-[16/8] w-full rounded-[16px] border-2 border-ink object-cover"
          >
            <source src={project.media.src} />
          </video>
        ) : (
          <div
            className="flex aspect-[16/8] items-center justify-center rounded-[16px] border-2 border-ink bg-cover bg-center"
            style={{
              backgroundColor: project.tint,
              backgroundImage: project.media.src
                ? `url(${project.media.src})`
                : undefined,
            }}
          >
            {!project.media.src && project.media.type === "video" && (
              <div className="flex h-[74px] w-[74px] items-center justify-center rounded-full bg-ink text-[22px] text-paper">
                ▶
              </div>
            )}
          </div>
        )}

        {project.media.caption && (
          <p className="mt-[10px] text-[13.5px] font-semibold text-muted">
            {project.media.caption}
          </p>
        )}
      </section>

      {project.slug === "cubi" && <CubiPortal />}

      {project.slug === "cubi" && <CubiLogoLab />}

      {project.slug === "cubi" && <CubiColourLab />}

      {project.slug === "cubi" && <CubiWorkflow />}

      {project.slug === "gaelforce-ucd" && <GaleForceChapterOne />}

      {project.slug === "gaelforce-ucd" && <GaleForceSocial />}

      {project.body && (
        <section className="pb-14 gutter">
          <h2 className="eyebrow mb-6 block">The build</h2>
          <Prose>{project.body}</Prose>
        </section>
      )}

      {project.photos.length > 0 && (
        <section className="pb-14 gutter">
          <h2 className="eyebrow mb-[18px] block">Build photos</h2>
          <div className="grid grid-cols-2 gap-[14px] md:grid-cols-4">
            {project.photos.map((src) => (
              <div
                key={src}
                className="aspect-square rounded-[12px] border-2 border-ink bg-chip-bg bg-cover bg-center"
                style={{ backgroundImage: `url(${src})` }}
              />
            ))}
          </div>
        </section>
      )}

      {project.notes.length > 0 && (
        <section className="grid grid-cols-1 gap-[18px] pb-14 gutter md:grid-cols-2">
          {project.notes.map((n) => (
            <div
              key={n.heading}
              className="rounded-[16px] border-2 border-ink bg-card p-7 shadow-[var(--shadow-hard)]"
            >
              <h2 className="mb-3 text-[26px] font-bold tracking-[-0.02em]">
                {n.heading}
              </h2>
              <p className="pretty text-[16px] leading-[1.65]">{n.body}</p>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
