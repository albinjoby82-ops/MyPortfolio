import type { Metadata } from "next";
import { Bricolage_Grotesque, Public_Sans } from "next/font/google";
import Nav from "@/components/Nav";
import { site } from "@/content/site";
import "./globals.css";

// Self-hosted by next/font — no CDN request, no layout shift.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-public-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} — Engineering portfolio`,
  description: site.heroLede,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${publicSans.variable}`}>
      <body>
        {/* The page shell: a 1440px sheet of paper floating on the desk. */}
        <div className="mx-auto max-w-[1440px] px-0 py-0 md:p-[26px]">
          <div className="overflow-hidden rounded-[20px] bg-paper shadow-[var(--shadow-shell)]">
            <Nav />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
