import Panel from "@/components/Panel";
import ProjectList from "@/components/ProjectList";
import ContactBand from "@/components/ContactBand";
import { getProjects } from "@/lib/projects";
import { site } from "@/content/site";

export default function Home() {
  const projects = getProjects();

  return (
    <>
      {/* Hero */}
      <section className="grid grid-cols-1 items-start gap-14 pb-13 pt-[70px] gutter lg:grid-cols-[1fr_400px]">
        <div>
          <span className="mb-6 inline-block -rotate-[1.2deg] rounded-[6px] bg-sun px-3 py-[6px] text-[13px] font-bold uppercase tracking-[0.06em] text-ink">
            {site.heroTag}
          </span>

          <h1 className="max-w-[12ch] text-[clamp(40px,8vw,86px)] font-extrabold leading-[0.94] tracking-[-0.04em]">
            {site.heroHeadline}
          </h1>

          <p className="pretty mt-6 max-w-[56ch] text-[19px] leading-[1.6]">
            {site.heroLede}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={site.primaryCta.href}
              className="rounded-[10px] bg-rust px-[26px] py-[14px] text-[16px] font-bold text-white transition-colors duration-[120ms] hover:bg-rust-hover"
            >
              {site.primaryCta.label}
            </a>
            <a
              href={site.secondaryCta.href}
              className="rounded-[10px] border-2 border-ink px-[26px] py-[14px] text-[16px] font-bold text-ink transition-colors duration-[120ms] hover:bg-ink hover:text-paper"
            >
              {site.secondaryCta.label}
            </a>
          </div>
        </div>

        <Panel header="On the bench" rows={site.bench} />
      </section>

      <ProjectList projects={projects} />

      <ContactBand />
    </>
  );
}
