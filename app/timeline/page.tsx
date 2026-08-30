import Link from "next/link";
import type { Metadata } from "next";
import { timeline } from "@/content/timeline";

export const metadata: Metadata = {
  title: "Timeline — Albin Andrews Joby",
  description: "What I've built and run, in order.",
};

export default function TimelinePage() {
  // Group consecutive entries under a single year heading.
  const years = [...new Set(timeline.map((e) => e.year))];

  return (
    <>
      <section className="pb-9 pt-13 gutter">
        <span className="eyebrow">Timeline</span>
        <h1 className="mt-4 max-w-[16ch] text-[clamp(34px,6.5vw,68px)] font-extrabold leading-[0.96] tracking-[-0.035em]">
          What I&rsquo;ve built and run, in order.
        </h1>
        <p className="pretty mt-[22px] max-w-[56ch] text-[19px] leading-[1.6]">
          Projects, competitions and events — described by what I actually did
          on them.
        </p>
      </section>

      <section className="pb-14 gutter">
        {years.map((year) => (
          <div key={year} className="border-t-2 border-ink pt-6 pb-2">
            <div className="grid grid-cols-1 gap-7 md:grid-cols-[130px_1fr]">
              <h2 className="font-display text-[34px] font-bold leading-none tracking-[-0.025em] text-ink">
                {year}
              </h2>

              <div className="flex flex-col gap-[18px] pb-8">
                {timeline
                  .filter((e) => e.year === year)
                  .map((entry) => {
                    const card = (
                      <>
                        <h3 className="text-[26px] font-bold tracking-[-0.02em]">
                          {entry.title}
                        </h3>
                        <p className="pretty mt-3 max-w-[66ch] text-[16px] leading-[1.65]">
                          {entry.body}
                        </p>
                        {entry.slug && (
                          <span className="mt-4 inline-block text-[13px] font-bold text-rust">
                            See the project ↗
                          </span>
                        )}
                      </>
                    );

                    return entry.slug ? (
                      <Link
                        key={entry.title}
                        href={`/projects/${entry.slug}`}
                        className="block rounded-[16px] border-2 border-ink bg-card p-7 shadow-[var(--shadow-hard)] transition-[transform,box-shadow] duration-[120ms] ease-out hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[var(--shadow-hard-lifted)]"
                      >
                        {card}
                      </Link>
                    ) : (
                      <div
                        key={entry.title}
                        className="rounded-[16px] border-2 border-ink bg-card p-7 shadow-[var(--shadow-hard)]"
                      >
                        {card}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
