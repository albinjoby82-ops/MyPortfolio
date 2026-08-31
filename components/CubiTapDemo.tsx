'use client';

import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';

function CubiWordmark() {
  return <span className="cubiWordmark">cubi<span className="cubiBrandDot" /></span>;
}

/**
 * The interactive NFC tap demo from the homepage hero: a CSS-built board with
 * two tap tiles and a floating phone the visitor can drag (or tap) to play a
 * simulated tap. Extracted so the /for/<slug> outreach page can show the same
 * animated demo personalised with the society's crest instead of a static
 * product photo.
 *
 * The component renders the chip + board + phone; the parent supplies the
 * positioned stage wrapper (e.g. `.cubiHeroStage`), which the phone and chip
 * anchor to via `position: absolute`.
 */

export type TapDemoTarget = 'website' | 'instagram';

export type TapDemoHandle = {
  /** Play a full tap sequence on demand (used by external buttons). */
  play: (target: TapDemoTarget) => void;
};

export type TapDemoTargetContent = {
  /** Notification line shown under "Cubi" when the tap lands. */
  notification: string;
  /** Browser address-bar text. */
  url: string;
  /** Content of the opened page (rendered inside `.cubiDemoBrowserPage`). */
  page: ReactNode;
};

type TapDemoProps = {
  /** Small caption printed at the bottom of the board. */
  boardText: string;
  /** The cubi-wordmark tile (left). */
  website: TapDemoTargetContent;
  /** The Instagram tile (right). */
  instagram: TapDemoTargetContent;
  /** Override the narrator chip per phase; unset phases keep the defaults. */
  chipText?: Partial<Record<DemoPhase, string>>;
  /** Imperative handle so surrounding UI can trigger taps. */
  controlRef?: RefObject<TapDemoHandle | null>;
};

function TapTileIcon({ kind }: { kind: 'social' }) {
  void kind;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Screen state machine, mirroring a real NFC tap:
 * idle (lock screen) → armed (tile contact: banner drops, like the real
 * notification) → loading (browser sheet + skeleton) → opened (page hero).
 */
type DemoScreen =
  | { kind: 'idle' }
  | { kind: 'armed'; target: TapDemoTarget }
  | { kind: 'loading'; target: TapDemoTarget }
  | { kind: 'opened'; target: TapDemoTarget };

/** How close the phone's top edge (where the NFC antenna sits) must get to a tile centre. */
const TAP_RANGE_PX = 30;

type SpringAxis = { pos: number; vel: number; target: number };

type DemoEngine = {
  x: SpringAxis;
  y: SpringAxis;
  rot: SpringAxis;
  mode: 'follow' | 'glide' | 'return' | null;
  /** Slow, watchable glide for the self-running demo; snappy for user taps. */
  glideSlow: boolean;
  raf: number | null;
  lastTime: number;
  pointerStart: { x: number; y: number };
  base: { x: number; y: number };
  centerStart: { x: number; y: number };
  halfHeight: number;
  tiles: { target: TapDemoTarget; cx: number; cy: number; radius: number }[];
};

/**
 * The chip doubles as the demo's narrator: it explains the auto-played tap
 * while it happens, then hands over to the visitor.
 */
export type DemoPhase = 'intro' | 'autoGlide' | 'autoOpen' | 'invite' | 'user';

const DEMO_CHIP_TEXT: Record<DemoPhase, string> = {
  intro: 'Interactive demo — tap or drag the phone',
  autoGlide: 'Watch — a tap on a tile…',
  autoOpen: '…opens your Instagram. Instantly.',
  invite: 'Your turn — tap or drag the phone',
  user: 'Interactive demo — tap or drag the phone',
};

function makeAxis(pos = 0): SpringAxis {
  return { pos, vel: 0, target: pos };
}

function stepAxis(axis: SpringAxis, dt: number, stiffness: number, damping: number) {
  const accel = stiffness * (axis.target - axis.pos) - damping * axis.vel;
  axis.vel += accel * dt;
  axis.pos += axis.vel * dt;
}

function axisSettled(axis: SpringAxis) {
  return Math.abs(axis.target - axis.pos) < 0.15 && Math.abs(axis.vel) < 0.15;
}

export default function TapDemo({
  boardText,
  website,
  instagram,
  chipText,
  controlRef,
}: TapDemoProps) {
  const [screen, setScreen] = useState<DemoScreen>({ kind: 'idle' });
  const [bump, setBump] = useState(false);
  const [phase, setPhase] = useState<DemoPhase>('intro');

  const boardRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const websiteTileRef = useRef<HTMLDivElement>(null);
  const instagramTileRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);
  const armedRef = useRef<TapDemoTarget | null>(null);
  const tapCycleRef = useRef<TapDemoTarget>('website');
  const engineRef = useRef<DemoEngine>({
    x: makeAxis(),
    y: makeAxis(),
    rot: makeAxis(6),
    mode: null,
    glideSlow: false,
    raf: null,
    lastTime: 0,
    pointerStart: { x: 0, y: 0 },
    base: { x: 0, y: 0 },
    centerStart: { x: 0, y: 0 },
    halfHeight: 0,
    tiles: [],
  });

  const chip = { ...DEMO_CHIP_TEXT, ...chipText };
  const targetContent: Record<TapDemoTarget, TapDemoTargetContent> = {
    website,
    instagram,
  };

  useEffect(() => {
    return () => {
      const engine = engineRef.current;
      if (engine.raf !== null) cancelAnimationFrame(engine.raf);
      timersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  // Attract loop: shortly after the demo scrolls into view the phone taps the
  // Instagram tile by itself, so visitors see what the demo does before
  // touching anything. On the homepage the hero is visible on load, so this
  // behaves like the old load-delay; on the outreach page the demo sits below
  // the fold and must wait to be seen. Scheduled through timersRef so grabbing
  // the phone cancels a pending run.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }
    const node = boardRef.current;
    if (!node) return undefined;

    let fired = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (fired || !entries.some((entry) => entry.isIntersecting)) return;
        fired = true;
        observer.disconnect();
        const id = window.setTimeout(() => {
          const engine = engineRef.current;
          if (engine.mode !== null || armedRef.current !== null) return;
          if (!primeEngine()) return;
          setPhase('autoGlide');
          beginTap('instagram', 'auto');
        }, 2200);
        timersRef.current.push(id);
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!controlRef) return undefined;
    controlRef.current = {
      play: (target: TapDemoTarget) => {
        clearTimers();
        setBump(false);
        setPhase('user');
        armedRef.current = null;
        setScreen({ kind: 'idle' });
        stopLoop();
        if (!primeEngine()) return;
        beginTap(target);
      },
    };
    return () => {
      controlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlRef]);

  function clearTimers() {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }

  function schedule(fn: () => void, ms: number) {
    timersRef.current.push(window.setTimeout(fn, ms));
  }

  function setArmed(target: TapDemoTarget | null) {
    if (armedRef.current === target) return;
    armedRef.current = target;
    setScreen(target ? { kind: 'armed', target } : { kind: 'idle' });
  }

  /**
   * Take imperative control of the phone: read its current animated transform
   * so the spring starts exactly where the float animation left it (no jump),
   * and cache the geometry the per-frame proximity test needs.
   */
  function primeEngine() {
    const node = phoneRef.current;
    if (!node) return false;
    const engine = engineRef.current;

    const computed = getComputedStyle(node).transform;
    const matrix = computed && computed !== 'none' ? new DOMMatrix(computed) : new DOMMatrix();
    const angle = (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI;
    engine.x = makeAxis(matrix.e);
    engine.y = makeAxis(matrix.f);
    engine.rot = makeAxis(angle);
    engine.base = { x: matrix.e, y: matrix.f };

    const rect = node.getBoundingClientRect();
    engine.centerStart = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    engine.halfHeight = node.offsetHeight / 2;

    engine.tiles = (
      [
        ['website', websiteTileRef.current],
        ['instagram', instagramTileRef.current],
      ] as const
    )
      .filter((entry): entry is [TapDemoTarget, HTMLDivElement] => entry[1] !== null)
      .map(([target, el]) => {
        const tileRect = el.getBoundingClientRect();
        return {
          target,
          cx: tileRect.left + tileRect.width / 2,
          cy: tileRect.top + tileRect.height / 2,
          radius: Math.max(tileRect.width, tileRect.height) / 2 + TAP_RANGE_PX,
        };
      });

    node.style.animation = 'none';
    node.style.zIndex = '2';
    return true;
  }

  /**
   * Screen-space position of the phone's top-centre point (the NFC antenna).
   * `fromTarget` uses where the pointer is steering the phone rather than the
   * spring-lagged position — at release the user's intent is where they dropped.
   */
  function antennaPoint(fromTarget = false) {
    const engine = engineRef.current;
    const px = fromTarget ? engine.x.target : engine.x.pos;
    const py = fromTarget ? engine.y.target : engine.y.pos;
    const cx = engine.centerStart.x + px - engine.base.x;
    const cy = engine.centerStart.y + py - engine.base.y;
    const rad = (engine.rot.pos * Math.PI) / 180;
    return {
      x: cx + Math.sin(rad) * engine.halfHeight,
      y: cy - Math.cos(rad) * engine.halfHeight,
    };
  }

  function nearestTile(fromTarget = false): TapDemoTarget | null {
    const point = antennaPoint(fromTarget);
    let best: { target: TapDemoTarget; distance: number } | null = null;
    for (const tile of engineRef.current.tiles) {
      const distance = Math.hypot(point.x - tile.cx, point.y - tile.cy);
      if (distance <= tile.radius && (!best || distance < best.distance)) {
        best = { target: tile.target, distance };
      }
    }
    return best?.target ?? null;
  }

  function stopLoop() {
    const engine = engineRef.current;
    if (engine.raf !== null) {
      cancelAnimationFrame(engine.raf);
      engine.raf = null;
    }
    engine.mode = null;
  }

  /** Hand the phone back to the CSS float animation, which restarts at the dock pose. */
  function releaseToDock() {
    const node = phoneRef.current;
    stopLoop();
    if (node) {
      node.style.transform = '';
      node.style.animation = '';
      node.style.zIndex = '';
      node.style.cursor = '';
    }
  }

  function startLoop() {
    const engine = engineRef.current;
    if (engine.raf !== null) return;
    engine.lastTime = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - engine.lastTime) / 1000, 1 / 30);
      engine.lastTime = now;

      if (engine.mode === 'follow') {
        // Tilt into the direction of travel: lag distance is a proxy for velocity.
        engine.rot.target = Math.max(-10, Math.min(10, (engine.x.target - engine.x.pos) * 0.12));
        stepAxis(engine.x, dt, 460, 38);
        stepAxis(engine.y, dt, 460, 38);
        stepAxis(engine.rot, dt, 220, 26);
      } else {
        // The auto demo glides softly so the eye can follow; user-initiated
        // glides and the return trip keep the quicker spring.
        const slow = engine.mode === 'glide' && engine.glideSlow;
        const stiffness = slow ? 42 : 170;
        const damping = slow ? 12 : 21;
        stepAxis(engine.x, dt, stiffness, damping);
        stepAxis(engine.y, dt, stiffness, damping);
        stepAxis(engine.rot, dt, stiffness, damping);
      }

      const node = phoneRef.current;
      if (node) {
        node.style.transform = `translate3d(${engine.x.pos}px, ${engine.y.pos}px, 0) rotate(${engine.rot.pos}deg)`;
      }

      if (engine.mode === 'follow') {
        setArmed(nearestTile());
      }

      const settled = axisSettled(engine.x) && axisSettled(engine.y) && axisSettled(engine.rot);
      if (engine.mode === 'return' && settled) {
        releaseToDock();
        return;
      }
      if (engine.mode === 'glide' && settled) {
        stopLoop();
        return;
      }
      engine.raf = requestAnimationFrame(tick);
    };
    engine.raf = requestAnimationFrame(tick);
  }

  function returnToDock() {
    const engine = engineRef.current;
    engine.mode = 'return';
    engine.x.target = 0;
    engine.y.target = 0;
    engine.rot.target = 6; // Matches the float animation's 0% keyframe for a seamless handoff.
    startLoop();
  }

  /** Glide the phone so its top edge kisses the tile, then play the open sequence. */
  function beginTap(target: TapDemoTarget, pace: 'user' | 'auto' = 'user') {
    const engine = engineRef.current;
    const tile = engine.tiles.find((t) => t.target === target);
    if (!tile) return;

    // The self-running demo moves at "watch and understand" speed: a long
    // glide, screen states synced to the moment of contact, and the opened
    // page held long enough to read. User taps keep the original snap.
    const auto = pace === 'auto';
    const t = auto
      ? { arm: 1000, bumpOff: 1450, load: 1550, open: 2500, done: 7600 }
      : { arm: 160, bumpOff: 480, load: 480, open: 1150, done: 4300 };

    const antenna = antennaPoint();
    engine.mode = 'glide';
    engine.glideSlow = auto;
    engine.x.target = engine.x.pos + (tile.cx - antenna.x);
    engine.y.target = engine.y.pos + (tile.cy + 10 - antenna.y);
    engine.rot.target = -4;
    startLoop();

    if (auto) {
      schedule(() => {
        armedRef.current = target;
        setScreen({ kind: 'armed', target });
      }, t.arm);
    } else {
      armedRef.current = target;
      setScreen({ kind: 'armed', target });
    }
    schedule(() => setBump(true), t.arm); // the "haptic" buzz as contact lands
    schedule(() => setBump(false), t.bumpOff);
    schedule(() => setScreen({ kind: 'loading', target }), t.load);
    schedule(() => {
      setScreen({ kind: 'opened', target });
      if (auto) setPhase('autoOpen');
    }, t.open);
    schedule(() => {
      armedRef.current = null;
      setScreen({ kind: 'idle' });
      returnToDock();
      if (auto) setPhase('invite');
    }, t.done);
  }

  function handlePhonePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== undefined && event.button !== 0) return;
    clearTimers();
    setBump(false);
    setPhase('user');
    armedRef.current = null;
    setScreen({ kind: 'idle' });
    if (!primeEngine()) return;

    const engine = engineRef.current;
    engine.mode = 'follow';
    engine.pointerStart = { x: event.clientX, y: event.clientY };
    const node = event.currentTarget;
    node.style.cursor = 'grabbing';
    try {
      node.setPointerCapture(event.pointerId);
    } catch {
      // Synthetic events can't capture; dragging still works.
    }
    startLoop();
  }

  function handlePhonePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const engine = engineRef.current;
    if (engine.mode !== 'follow') return;
    engine.x.target = engine.base.x + (event.clientX - engine.pointerStart.x);
    engine.y.target = engine.base.y + (event.clientY - engine.pointerStart.y);
  }

  function handlePhonePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const engine = engineRef.current;
    if (engine.mode !== 'follow') return;
    const node = event.currentTarget;
    node.style.cursor = '';
    if (node.hasPointerCapture(event.pointerId)) {
      node.releasePointerCapture(event.pointerId);
    }

    // A plain tap (no real drag) plays the demo by itself — essential on
    // phones, where "drag onto a tile" is much less discoverable.
    const dragDistance = Math.hypot(
      event.clientX - engine.pointerStart.x,
      event.clientY - engine.pointerStart.y,
    );
    if (dragDistance < 8) {
      const target = tapCycleRef.current;
      tapCycleRef.current = target === 'website' ? 'instagram' : 'website';
      beginTap(target);
      return;
    }

    const target = nearestTile(true) ?? armedRef.current;
    if (target) {
      beginTap(target);
    } else {
      setArmed(null);
      returnToDock();
    }
  }

  function handlePhoneKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    if (screen.kind !== 'idle' || engineRef.current.mode !== null) return;
    clearTimers();
    if (!primeEngine()) return;
    beginTap('website');
  }

  return (
    <>
      <span
        className={`cubiChip cubiChipAccent cubiDemoTag${
          phase === 'invite' ? ' isInvite' : ''
        }`}
        role="status"
      >
        {chip[phase]}
      </span>
      <div className="cubiDemoBoard" aria-hidden="true" ref={boardRef}>
        <div className="cubiDemoBoardPlate">
          <span className="cubiDemoBoardLogo">
            <CubiWordmark />
          </span>
        </div>
        <div className="cubiDemoTiles">
          <div
            ref={websiteTileRef}
            className={`cubiDemoTile isTarget${screen.kind !== 'idle' && screen.target === 'website' ? ' isArmed' : ''}`}
          >
            <span className="cubiDemoTileMark">
              cubi<span className="cubiBrandDot" />
            </span>
            {(screen.kind === 'armed' || screen.kind === 'loading') && screen.target === 'website' && (
              <span className="cubiDemoRings">
                <i />
                <i />
                <i />
              </span>
            )}
          </div>
          <div
            ref={instagramTileRef}
            className={`cubiDemoTile${screen.kind !== 'idle' && screen.target === 'instagram' ? ' isArmed' : ''}`}
          >
            <TapTileIcon kind="social" />
            {(screen.kind === 'armed' || screen.kind === 'loading') && screen.target === 'instagram' && (
              <span className="cubiDemoRings">
                <i />
                <i />
                <i />
              </span>
            )}
          </div>
        </div>
        <span className="cubiDemoBoardText">{boardText}</span>
      </div>
      <div
        ref={phoneRef}
        className="cubiDemoPhone"
        onPointerDown={handlePhonePointerDown}
        onPointerMove={handlePhonePointerMove}
        onPointerUp={handlePhonePointerUp}
        onPointerCancel={handlePhonePointerUp}
        onKeyDown={handlePhoneKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Tap the phone or drag it onto a tile to simulate an NFC tap, or press Enter to preview a tap"
      >
        <div className={`cubiDemoScreen${bump ? ' isBumped' : ''}`}>
          <div className="cubiDemoLock">
            <span className="cubiDemoLockTime">9:41</span>
            <span className="cubiDemoLockHint">Tap or drag me</span>
          </div>
          {(screen.kind === 'armed' || screen.kind === 'loading') && (
            <div className="cubiDemoNotification">
              <span className="cubiDemoNotifIcon">c</span>
              <span className="cubiDemoNotifText">
                <strong>Cubi</strong>
                <small>{targetContent[screen.target].notification}</small>
              </span>
            </div>
          )}
          {(screen.kind === 'loading' || screen.kind === 'opened') && (
            <div className="cubiDemoBrowser">
              <div className="cubiDemoBrowserBar">
                <span className="cubiDemoBrowserLock" />
                {targetContent[screen.target].url}
              </div>
              {screen.kind === 'loading' && (
                <div className="cubiDemoBrowserSkeleton">
                  <span style={{ width: '46%' }} />
                  <span style={{ width: '82%' }} />
                  <span style={{ width: '68%' }} />
                  <span className="cubiDemoSkeletonBlock" />
                </div>
              )}
              {screen.kind === 'opened' && (
                <div className="cubiDemoBrowserPage">
                  {targetContent[screen.target].page}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
