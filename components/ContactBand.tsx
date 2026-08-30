import { site } from "@/content/site";

export default function ContactBand() {
  const { heading, lede, links } = site.contact;

  return (
    <div className="grid grid-cols-1 items-center gap-14 bg-ink py-14 gutter lg:grid-cols-2">
      <div>
        <h2 className="text-[clamp(32px,5vw,46px)] font-extrabold leading-[1.02] tracking-[-0.03em] text-paper">
          {heading}
        </h2>
        <p className="pretty mt-[18px] max-w-[44ch] text-[17px] leading-[1.6] text-footer-muted">
          {lede}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className={
              "flex items-center justify-between gap-4 rounded-[12px] px-[22px] py-[18px] text-[17px] font-bold transition-colors duration-[120ms] " +
              (l.accent
                ? "bg-sun text-ink hover:bg-paper"
                : "border-2 border-footer-border text-paper hover:border-paper")
            }
          >
            <span className="break-all">{l.label}</span>
            <span aria-hidden>↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
