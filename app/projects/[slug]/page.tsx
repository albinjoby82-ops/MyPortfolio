import Link from "next/link";
import { notFound } from "next/navigation";
import Panel from "@/components/Panel";
import Prose from "@/components/Prose";
import MicromouseChapters from "@/components/MicromouseChapters";
import HeroFlipbook from "@/components/HeroFlipbook";
import ProjectMedia from "@/components/ProjectMedia";
import SocialPost from "@/components/SocialPost";
import { getGallery, getVideos } from "@/lib/gallery";
import CubiPortal from "@/components/CubiPortal";
import CubiLogoLab from "@/components/CubiLogoLab";
import CubiColourLab from "@/components/CubiColourLab";
import CubiWorkflow from "@/components/CubiWorkflow";
import GaleForceChapterOne from "@/components/GaleForceChapterOne";
import GaelForceCommunity from "@/components/GaelForceCommunity";
import GaelForcePrototyping from "@/components/GaelForcePrototyping";
import GaelForceRecruiting from "@/components/GaelForceRecruiting";
import GaelForceOdomPod from "@/components/GaelForceOdomPod";
import RobotArmTesting from "@/components/RobotArmTesting";
import PcbProjects from "@/components/PcbProjects";
import AiExperiments from "@/components/AiExperiments";
import { getProject, getProjects } from "@/lib/projects";
import { site } from "@/content/site";

// Instagram posts shown at the top of the Robo Expo page.
const ROBO_EXPO_POSTS = [
  "https://www.instagram.com/reel/DXM2VrEjPCj/",
  "https://www.instagram.com/p/DXUlCELjBl-/",
  "https://www.instagram.com/p/DXXOJ9-DFSW/",
];

const ROBO_EXPO_ALTS = [
  "The four presenters with their arms round each other behind the sand art machine and a small robot",
  "Two presenters leaning over a small robot, one pointing at it and laughing",
  "Someone playing a game on a laptop with a hand-built controller wired to an Arduino",
  "A close-up of a hand holding a custom controller board with two thumb joysticks",
];

const CARS_GO_BURR_ALTS = [
  "A crowd gathered round the race table as the cars go head to head",
  "Someone talking through the setup at the whiteboard, laptop in hand",
  "Two decorated cars on a lab bench",
  "A blue car with red lights driving across the carpet",
  "A car on the race track, seen from the side",
];

export function generateStaticParams() {
  return getProjects({ includeHidden: true }).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Not found" };

  const title = `${project.title} | ${site.name}`;
  // Link previews need a still image: the cover photo, a video's poster,
  // or the site-wide fallback when the project has neither yet.
  const image =
    (project.media.type === "video"
      ? project.media.poster
      : project.media.src) ?? site.shareImage;

  return {
    title,
    description: project.blurb,
    openGraph: {
      type: "article",
      siteName: site.name,
      title,
      description: project.blurb,
      url: `/projects/${project.slug}/`,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.blurb,
      images: [image],
    },
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
  const gallery = getGallery(project.slug);

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
            <div className="mb-[18px] flex flex-wrap items-center gap-[10px]">
              <span
                className="inline-block rounded-[6px] px-3 py-[5px] text-[12px] font-bold uppercase tracking-[0.1em] text-ink"
                style={{ backgroundColor: project.tint }}
              >
                {project.no ? `${project.no} · ` : ""}{project.kind}
              </span>
              {project.status && (
                <span className="inline-block rounded-full border border-rust/40 bg-rust/10 px-3 py-[5px] text-[12px] font-bold uppercase tracking-[0.1em] text-rust">
                  {project.status}
                </span>
              )}
            </div>

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

      {project.slug === "dublin-micromouse-open" && (
        <section className="pb-11 gutter">
          <img
            src="/projects/micromouse/cover.webp"
            alt="The finished 16 × 16 maze laid out on the floor beneath the welcome slide"
            className="aspect-[16/8] w-full rounded-[16px] border-2 border-ink object-cover object-[50%_55%] shadow-[var(--shadow-hard)]"
          />
        </section>
      )}

      {/* Hero media — real video/image when supplied, tinted block until then. */}
      {project.slug === "robo-expo" && (
        <section className="pb-11 gutter">
          <h2 className="eyebrow mb-[18px] block">From the day</h2>
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3 [&_.socialWindow]:m-0">
            {ROBO_EXPO_POSTS.map((url) => (
              <SocialPost key={url} network="instagram" post={url} height={640} />
            ))}
          </div>
        </section>
      )}

      {project.slug !== "dublin-micromouse-open" && project.slug !== "robo-expo" && (<section className="pb-11 gutter">
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
        ) : project.media.src && project.media.portrait ? (
          // Portrait photos are shown as a 4:5 card instead of being blown up across the page.
          // A project with a gallery folder gets a flipbook of those photos beside it.
          <div className="flex flex-wrap items-start gap-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.media.src}
              alt={project.title}
              className="aspect-[4/5] w-full max-w-[440px] rounded-[16px] border-2 border-ink object-cover shadow-[var(--shadow-hard)]"
              style={{ objectPosition: project.media.position }}
            />
            {gallery.length > 0 && (
              <div className="w-full max-w-[440px] [&_.hfb]:mt-0">
                <HeroFlipbook pages={gallery} />
              </div>
            )}
          </div>
        ) : (
          <div
            className="flex aspect-[16/8] items-center justify-center rounded-[16px] border-2 border-ink bg-cover bg-center"
            style={{
              backgroundColor: project.tint,
              backgroundImage: project.media.src
                ? `url(${project.media.src})`
                : undefined,
              backgroundPosition: project.media.position,
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
      </section>)}

      {project.slug === "ai-experiments" && <AiExperiments />}

      {project.slug === "serial-bus-robot-arm" && <RobotArmTesting />}

      {project.slug === "cubi" && <CubiPortal />}

      {project.slug === "cubi" && <CubiLogoLab />}

      {project.slug === "cubi" && <CubiColourLab />}

      {project.slug === "cubi" && <CubiWorkflow />}

      {project.slug === "gaelforce-ucd" && <GaleForceChapterOne />}

      {project.slug === "gaelforce-ucd" && <GaelForceCommunity />}

      {project.slug === "gaelforce-ucd" && <GaelForcePrototyping />}

      {project.slug === "gaelforce-ucd" && <GaelForceRecruiting />}

      {project.slug === "pcb-embedded-builds" && (
        <PcbProjects odom={<GaelForceOdomPod />} />
      )}

      {/* Micromouse is told as a three-chapter book (copy lives in the
          component; the MDX body is kept as the plain-text source). */}
      {project.slug === "dublin-micromouse-open" && <MicromouseChapters />}

      {project.body && project.slug !== "dublin-micromouse-open" && (
        <section className="pb-14 gutter">
          <h2 className="eyebrow mb-6 block">The build</h2>
          <Prose>{project.body}</Prose>
        </section>
      )}

      {project.slug === "robo-expo" && (
        <ProjectMedia
          photos={gallery.map((g, i) => ({ ...g, alt: ROBO_EXPO_ALTS[i] ?? "A photo from the Robo Expo" }))}
          videos={getVideos(project.slug)}
          photosTitle="On the day"
        />
      )}

      {project.slug === "cars-go-burr" && (
        <ProjectMedia
          photos={gallery.map((g, i) => ({ ...g, alt: CARS_GO_BURR_ALTS[i] ?? "A photo from Cars Go Burr" }))}
          videos={getVideos(project.slug)}
          photosTitle="On the night"
          videosTitle="The cars"
        />
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
