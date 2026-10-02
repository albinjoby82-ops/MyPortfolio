'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import './MicromousePosters.css';

/**
 * Poster flipbook for the Dublin Micromouse Open page.
 *
 * A real book: every leaf carries one poster on its front and the next on its
 * back, and turning it swings it over the spine. On narrow screens the book
 * becomes single-page (one poster per leaf, blank on the back).
 * Add a poster by appending to POSTERS; `bg` is the ground behind it so posters
 * that don't fill the 4:5 page still read as one sheet.
 */
const POSTERS = [
  {
    src: '/projects/micromouse/posters/micromouse-open-2026.png',
    alt: 'Dark square poster: the ElecSoc logo above "Dublin Micromouse Open 2026" in outlined orange, "Build it. Code it. Race it.", a chequered start line along the bottom',
    caption: 'Dublin Micromouse Open 2026',
    bg: '#06131a',
  },
  {
    src: '/projects/micromouse/posters/something-is-learning-the-maze.webp',
    alt: 'Dark teaser poster: a glowing route through a 16 by 16 maze, headline "Something is learning the maze"',
    caption: 'The teaser',
    bg: '#030508',
  },
  {
    src: '/projects/micromouse/posters/it-knows-the-way-out.png',
    alt: 'Dark square poster: radar rings around one orange contact, headline "It knows the way out", Dublin Micromouse Open ’26',
    caption: 'It knows the way out',
    bg: '#02070a',
  },
  {
    src: '/projects/micromouse/posters/the-walls-are-going-up.jpg',
    alt: 'Dark poster: a green laser cutting interlocking wall pieces engraved "Dublin Micromouse Open 2026", headline "The walls are going up", coming September',
    caption: 'The walls are going up',
    bg: '#030805',
  },
  {
    src: '/projects/micromouse/posters/cv-looking-dull.webp',
    alt: 'Light poster: "CV looking dull? Add a robot", with a CV line reading "Autonomous micro-mouse: designed, built, programmed, raced"',
    caption: 'CV looking dull?',
    bg: '#edf4f1',
  },
  {
    src: '/projects/micromouse/posters/weve-got-robots.webp',
    alt: 'Dark poster: "We’ve got robots, you’ve got squat", with a photo of a student holding a printed walking robot',
    caption: 'We’ve got robots',
    bg: '#05090d',
  },
  {
    src: '/projects/micromouse/posters/weve-got-robots-2.webp',
    alt: 'Dark poster: "We’ve got robots, you’ve got squat", with a photo of a smiling student holding a small wheeled robot with a screen face',
    caption: 'We’ve got robots, take two',
    bg: '#05090d',
  },
  {
    src: '/projects/micromouse/posters/figure-it-out-photo.webp',
    alt: 'Poster: "You’re not supposed to know how" over a photo of a cluttered electronics desk, three black-and-white bench photos below, then "You’re supposed to figure it out"',
    caption: 'Figure it out',
    bg: '#efece3',
  },
  {
    src: '/projects/micromouse/posters/figure-it-out-desk.webp',
    alt: 'Cream poster: "You’re not supposed to know how", a tilted photo of a cluttered electronics desk with notes like "why is this not working", then "You’re supposed to figure it out"',
    caption: 'Get stuck. Get curious. Get unstuck.',
    bg: '#efece3',
  },
  {
    src: '/projects/micromouse/posters/figure-it-out-split.webp',
    alt: 'Two-panel poster: "You’re not supposed to know how" on cream with a taped photo of a desk, above "You’re supposed to figure it out" on black',
    caption: 'Build it. Break it. Debug it. Try again.',
    bg: '#efece3',
  },
];

type Poster = (typeof POSTERS)[number];

function Face({ poster, visible, back }: { poster?: Poster; visible: boolean; back?: boolean }) {
  return (
    <div
      className={back ? 'mmbFace mmbBack' : 'mmbFace mmbFront'}
      style={{ background: poster?.bg ?? '#efece3' }}
      aria-hidden={!visible}
    >
      {poster && <img src={poster.src} alt={poster.alt} draggable={false} />}
      <span className="mmbShade" aria-hidden="true" />
    </div>
  );
}

export default function MicromousePosters() {
  const [spread, setSpread] = useState(false);
  const [turned, setTurned] = useState(0);
  const drag = useRef<number | null>(null);
  const bookRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)');
    const sync = () => {
      setSpread(mq.matches);
      setTurned(0);
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const n = POSTERS.length;
  // Spread: leaf i = posters 2i (front) and 2i+1 (back). Single: leaf i = poster i.
  const leaves = spread ? Math.ceil(n / 2) : n;
  const max = spread ? leaves : n - 1;

  const go = useCallback(
    (to: number) => setTurned((t) => Math.min(max, Math.max(0, to === t ? t : to))),
    [max],
  );
  const next = useCallback(() => setTurned((t) => Math.min(max, t + 1)), [max]);
  const prev = useCallback(() => setTurned((t) => Math.max(0, t - 1)), []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    if (e.key === 'Home') { e.preventDefault(); go(0); }
    if (e.key === 'End') { e.preventDefault(); go(max); }
  };

  const onPointerDown = (e: React.PointerEvent) => { drag.current = e.clientX; };
  const onPointerUp = (e: React.PointerEvent) => {
    if (drag.current === null) return;
    const dx = e.clientX - drag.current;
    drag.current = null;
    if (dx < -45) next();
    else if (dx > 45) prev();
  };

  // What is on show right now, for the caption.
  const shown: Poster[] = spread
    ? [turned > 0 ? POSTERS[2 * turned - 1] : undefined, turned < leaves ? POSTERS[2 * turned] : undefined].filter(
        (p): p is Poster => Boolean(p),
      )
    : [POSTERS[turned]];
  const pageLabel = spread
    ? shown.length === 2
      ? `${2 * turned}–${2 * turned + 1}`
      : turned === 0
        ? '1'
        : String(n)
    : String(turned + 1);

  return (
    <section className="mmbSection gutter" aria-labelledby="mmb-title">
      <span className="eyebrow mb-3 block">The posters</span>
      <h2 id="mmb-title" className="mmbTitle">Every poster, designed by me.</h2>
      <p className="mmbLede">
        I designed every poster for the event, and directed two long-form videos
        and three short reels alongside them. Turn the pages: click an edge, drag,
        or use the arrow keys.
      </p>

      <div
        className={spread ? 'mmbBook mmbSpread' : 'mmbBook mmbSingle'}
        data-open={turned > 0 ? 'true' : 'false'}
        data-end={turned >= leaves && spread ? 'true' : 'false'}
        ref={bookRef}
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        aria-roledescription="book"
        aria-label="Poster flipbook. Use the left and right arrow keys to turn pages."
      >
        <div className="mmbCover">
          <div className="mmbPages">
            {Array.from({ length: leaves }, (_, i) => {
              const isTurned = i < turned;
              const frontPoster = spread ? POSTERS[2 * i] : POSTERS[i];
              const backPoster = spread ? POSTERS[2 * i + 1] : undefined;
              const frontVisible = i === turned;
              const backVisible = i === turned - 1;
              return (
                <div
                  key={i}
                  className={isTurned ? 'mmbLeaf mmbTurned' : 'mmbLeaf'}
                  style={{ zIndex: isTurned ? i : leaves - i }}
                >
                  <Face poster={frontPoster} visible={frontVisible} />
                  <Face poster={backPoster} visible={backVisible} back />
                </div>
              );
            })}
            <span className="mmbSpine" aria-hidden="true" />
            {spread && (
              <>
                <button type="button" className="mmbHit mmbHitL" tabIndex={-1} aria-hidden="true" onClick={prev} disabled={turned === 0} />
                <button type="button" className="mmbHit mmbHitR" tabIndex={-1} aria-hidden="true" onClick={next} disabled={turned >= max} />
              </>
            )}
            {!spread && (
              <button type="button" className="mmbHit mmbHitAll" tabIndex={-1} aria-hidden="true" onClick={next} disabled={turned >= max} />
            )}
          </div>
        </div>
      </div>

      <div className="mmbBar">
        <button type="button" className="mmbBtn" onClick={prev} disabled={turned === 0} aria-label="Previous page">
          ←
        </button>
        <div className="mmbMeta" aria-live="polite">
          <span className="mmbCaption">{shown.map((p) => p.caption).join('  ·  ')}</span>
          <span className="mmbCount">Page {pageLabel} of {n}</span>
        </div>
        <button type="button" className="mmbBtn" onClick={next} disabled={turned >= max} aria-label="Next page">
          →
        </button>
      </div>
    </section>
  );
}
