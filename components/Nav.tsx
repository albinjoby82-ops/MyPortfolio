"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";

const links = [
  { label: "Projects", href: "/" },
  { label: "Timeline", href: "/timeline" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center justify-between gap-y-3 border-b-2 border-ink py-5 gutter">
      <Link
        href="/"
        className="font-display text-[21px] font-extrabold tracking-[-0.02em] text-ink"
      >
        {site.wordmark}
      </Link>

      <div className="flex flex-wrap items-center gap-x-[30px] gap-y-3 text-[15px] font-semibold text-sub-text">
        {links.map((l) => {
          // "Projects" owns the home page; Timeline owns its own route.
          const active =
            l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={
                active
                  ? "border-b-2 border-rust pb-[2px] text-ink"
                  : "pb-[2px] transition-colors duration-[120ms] hover:text-ink"
              }
            >
              {l.label}
            </Link>
          );
        })}

        <a
          href={site.resume.href}
          className="rounded-[10px] border-2 border-ink bg-sun px-5 py-[10px] font-bold text-ink transition-colors duration-[120ms] hover:bg-ink hover:text-paper"
        >
          {site.resume.label}
        </a>
      </div>
    </nav>
  );
}
