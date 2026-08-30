import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static HTML — no SSR anywhere on this site.
  // Produces ./out, which Cloudflare Pages serves directly.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
