'use client';

import { useRef, useState } from 'react';
import './HeroFlipbook.css';

export type FlipPage = { src: string; alt: string; position?: string };

/**
 * A small page-turning photo book for the home hero. Click, swipe, or use the
 * arrows; going past the last page riffles back to the first.
 */
export default function HeroFlipbook({ pages }: { pages: FlipPage[] }) {
  const [state, setState] = useState({ turned: 0, prev: 0 });
  const down = useRef<{ x: number; swiped: boolean } | null>(null);
  const n = pages.length;
  if (n === 0) return null;

  const current = Math.min(state.turned, n - 1);
  const go = (to: number) => setState((s) => ({ turned: to, prev: Math.min(s.turned, n - 1) }));
  const next = () => go(current >= n - 1 ? 0 : current + 1);
  const prev = () => go(current <= 0 ? n - 1 : current - 1);

  // When several pages change at once (wrapping around), stagger them so the
  // book riffles instead of snapping.
  const delayFor = (i: number) => {
    const was = i < state.prev;
    const now = i < current;
    if (was === now) return 0;
    const changed = Math.abs(current - state.prev);
    if (changed <= 1) return 0;
    return (current < state.prev ? state.prev - 1 - i : i) * 26;
  };

  return (
    <div className="hfb" aria-roledescription="photo book" aria-label="Photos of me">
      <div
        className="hfbBook"
        onPointerDown={(e) => {
          down.current = { x: e.clientX, swiped: false };
        }}
        onPointerUp={(e) => {
          const d = down.current;
          if (!d) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 40) {
            d.swiped = true;
            if (dx < 0) next();
            else prev();
          }
        }}
      >
        {pages.map((p, i) => {
          const isTurned = i < current;
          return (
            <figure
              key={p.src}
              className={isTurned ? 'hfbPage hfbTurned' : 'hfbPage'}
              style={{ zIndex: isTurned ? i : n - i, transitionDelay: `${delayFor(i)}ms` }}
              aria-hidden={i !== current}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.alt}
                loading={i < 3 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
                style={{ objectPosition: p.position }}
              />
            </figure>
          );
        })}
        <button
          type="button"
          className="hfbHit"
          aria-label="Turn the page"
          onClick={() => {
            // A swipe already turned the page; ignore the click that follows it.
            if (down.current?.swiped) {
              down.current = null;
              return;
            }
            next();
          }}
        />
      </div>

      <div className="hfbBar">
        <button type="button" className="hfbBtn" onClick={prev} aria-label="Previous photo">
          ←
        </button>
        <span className="hfbCount">
          {current + 1} / {n}
        </span>
        <button type="button" className="hfbBtn" onClick={next} aria-label="Next photo">
          →
        </button>
      </div>
    </div>
  );
}
