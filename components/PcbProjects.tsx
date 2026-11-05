import type { ReactNode } from "react";
import SnowflakePcb from "./SnowflakePcb";

type PcbProject = {
  id: string;
  no: string;
  title: string;
  blurb: string;
  todo?: boolean;
};

// One entry per build on the PCB & embedded page. Add the next one here.
const PROJECTS: PcbProject[] = [
  {
    id: "odom-pod",
    no: "Project 1",
    title: "ODOM POD",
    blurb:
      "An ESP32-S3 odometry and localization pod for GaelForce. Two PCB revisions so far.",
  },
  {
    id: "project-2",
    no: "Project 2",
    title: "Snowflake",
    blurb:
      "A simple 5 V snowflake-shaped PCB with six LEDs, each with its own resistor. All through-hole.",
  },
];

export default function PcbProjects({ odom }: { odom: ReactNode }) {
  return (
    <>
      <section className="pb-11 gutter" aria-label="Projects on this page">
        <h2 className="eyebrow mb-[18px] block">Projects on this page</h2>
        <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
          {PROJECTS.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className="block rounded-[16px] border-2 border-ink bg-card p-6 shadow-[var(--shadow-hard)] transition-all duration-[120ms] hover:-translate-y-[2px] hover:shadow-[var(--shadow-hard-lifted)]"
            >
              <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-rust">
                {p.no}
              </span>
              <h3 className="mt-1 text-[26px] font-bold tracking-[-0.02em]">
                {p.title}
              </h3>
              <p className="pretty mt-2 text-[15px] leading-[1.6]">{p.blurb}</p>
            </a>
          ))}
        </div>
      </section>

      <div id="odom-pod" className="scroll-mt-6">
        <div className="gutter pb-2">
          <span className="inline-block rounded-[6px] bg-ink px-3 py-[5px] text-[12px] font-bold uppercase tracking-[0.1em] text-paper">
            {PROJECTS[0].no} · {PROJECTS[0].title}
          </span>
        </div>
        {odom}
      </div>

      <div id="project-2" className="scroll-mt-6 pb-14">
        <div className="gutter pb-2">
          <span className="inline-block rounded-[6px] bg-ink px-3 py-[5px] text-[12px] font-bold uppercase tracking-[0.1em] text-paper">
            {PROJECTS[1].no} · {PROJECTS[1].title}
          </span>
        </div>
        <SnowflakePcb />
      </div>
    </>
  );
}
