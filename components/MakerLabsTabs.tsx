import Link from 'next/link';
import './MakerLabsTabs.css';

/**
 * Tab bar shared by the MakerLabs page and the event pages under it, so the
 * events read as chapters of one story and are not missed.
 */
const TABS: { slug: string; label: string; bg: string; href: string; external?: boolean }[] = [
  { slug: 'makerlabs', label: 'MakerLabs', bg: '#fbf8f1', href: '/projects/makerlabs' },
  { slug: 'cars-go-burr', label: 'Cars Go Burr', bg: '#f3a98f', href: '/projects/cars-go-burr' },
  { slug: 'robo-expo', label: 'The Robo Expo', bg: '#c6e4f5', href: '/projects/robo-expo' },
  { slug: 'patch-makerthon', label: 'The Patch-Makerthon', bg: '#bfd3f5', href: '/projects/patch-makerthon' },
  {
    slug: 'good-waves',
    label: 'Good Waves, Bad Vibes ↗',
    bg: '#f5c63c',
    href: 'https://ucdelecsoc.github.io/MakerLabs26/docs/Lab5/',
    external: true,
  },
];

export const MAKERLABS_TAB_SLUGS = TABS.filter((t) => !t.external).map((t) => t.slug);

export default function MakerLabsTabs({ active }: { active: string }) {
  return (
    <nav className="mlTabs" aria-label="MakerLabs pages">
      <span className="mlTabsLabel">MakerLabs, page by page</span>
      <div className="mlTabList">
        {TABS.map((t, i) => {
          const on = t.slug === active;
          const props = {
            className: 'mlTab',
            'data-active': on,
            style: { background: t.bg, borderBottomColor: on ? t.bg : undefined },
          };
          const inner = (
            <>
              <span className="mlTabNum">0{i + 1}</span>
              {t.label}
            </>
          );
          return t.external ? (
            <a key={t.slug} href={t.href} target="_blank" rel="noopener noreferrer" {...props}>
              {inner}
            </a>
          ) : (
            <Link key={t.slug} href={t.href} aria-current={on ? 'page' : undefined} {...props}>
              {inner}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
