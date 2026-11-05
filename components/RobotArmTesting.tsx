"use client";

import { useEffect, useRef } from "react";
import "./RobotArmTesting.css";

const base = "/projects/serial-bus-robot-arm/testing";

type Entry = {
  id: string;
  kind: "video" | "photo";
  tag: string;
  title: string;
  note?: string;
  controls?: boolean;
  tilt: number;
};

// Captions describe only what is visible, or quote Albin's own on-video text.
const entries: Entry[] = [
  { id: "bench-a", kind: "photo", tag: "Bench", title: "Arm on its board", note: "Printed, assembled and wired to the driver board.", tilt: -1.4 },
  { id: "sweep", kind: "video", tag: "Control loop", title: "First run of the PID-style script", note: "Code meant to act like a PID loop, using live feedback and corrections to hit all three black tape dots.", tilt: 1.1 },
  { id: "realise", kind: "video", tag: "Realisation", title: "Realising I needed limits", note: "Realising in real time that the code needed limits.", tilt: -1.1 },
  { id: "reach", kind: "video", tag: "Replay", title: "Replaying a taught motion", tilt: -0.8 },
  { id: "peak", kind: "video", tag: "Moment", title: "Peak", tilt: 1.6 },
  { id: "servo-bench", kind: "video", tag: "Hardware", title: "A servo overheating", tilt: -1.2 },
  { id: "bench-b", kind: "photo", tag: "Bench", title: "Same arm, another angle", note: "Controller, power lead and servo wiring.", tilt: 0.9 },
  { id: "desk-a", kind: "video", tag: "Replay + PID", title: "Taught motion, with PID correction", note: "The arm replaying a taught motion with feedback correcting it.", tilt: -1.5 },
  { id: "desk-b", kind: "video", tag: "Replay + PID", title: "Taught motion, with PID correction", note: "The arm replaying a taught motion with feedback correcting it.", tilt: 1.3 },
  { id: "desk-c", kind: "video", tag: "Bug", title: "A bug", tilt: -0.7 },
  { id: "limits", kind: "video", tag: "Teach & replay", title: "Teach and replay", tilt: 0.6 },
];

function Clip({ e }: { e: Entry }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || e.controls) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [e.controls]);

  return (
    <video
      ref={ref}
      muted
      loop={!e.controls}
      playsInline
      controls={e.controls}
      preload={e.controls ? "none" : "metadata"}
      poster={`${base}/${e.id}.jpg`}
      aria-label={e.title}
    >
      <source src={`${base}/${e.id}.mp4`} type="video/mp4" />
    </video>
  );
}

export default function RobotArmTesting() {
  return (
    <section className="armTest gutter" aria-labelledby="arm-test-title">
      <div className="armTestInner">
        <header className="armTestHead">
          <span className="armTestKicker">Lab notebook &middot; no sound</span>
          <h2 id="arm-test-title">Testing &amp; learning</h2>
          <p>
            Software that works isn&apos;t the same as an arm that works. These
            are the clips and photos from the bench: moving it, breaking it and
            working out why.
          </p>
        </header>

        <ol className="armTestGrid">
          {entries.map((e, i) => (
            <li
              key={e.id}
              className={"armTestCard" + (e.id === "bus-debug" ? " isWide" : "")}
              style={{ ["--tilt" as string]: `${e.tilt}deg` }}
            >
              <div className="armTestMedia">
                {e.kind === "video" ? (
                  <Clip e={e} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`${base}/${e.id}.jpg`} alt={e.title} loading="lazy" />
                )}
                <span className="armTestNo">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="armTestCaption">
                <span className="armTestTag">{e.tag}</span>
                <strong>{e.title}</strong>
                {e.note && <span>{e.note}</span>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
