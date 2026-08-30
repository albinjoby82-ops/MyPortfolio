import Link from "next/link";

export default function NotFound() {
  return (
    <section className="pb-14 pt-13 gutter">
      <span className="eyebrow">404</span>
      <h1 className="mt-4 max-w-[14ch] text-[clamp(34px,6.5vw,68px)] font-extrabold leading-[0.96] tracking-[-0.035em]">
        That page doesn&rsquo;t exist.
      </h1>
      <p className="pretty mt-[22px] max-w-[52ch] text-[19px] leading-[1.6]">
        The link may be out of date, or the project may have been renamed.
      </p>
      <Link
        href="/"
        className="mt-9 inline-block rounded-[10px] bg-rust px-[26px] py-[14px] text-[16px] font-bold text-white transition-colors duration-[120ms] hover:bg-rust-hover"
      >
        Back to projects
      </Link>
    </section>
  );
}
