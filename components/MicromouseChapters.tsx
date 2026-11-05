'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import MicromousePosters from './MicromousePosters';
import MicromouseDeck from './MicromouseDeck';
import './MicromouseChapters.css';

/**
 * The Dublin Micromouse Open story as a three-chapter book. Photo, reel and
 * vlog tiles are placeholders until the event media is added: pass `src` to a
 * <Slot> / `src` + `poster` to a <Video> to swap one in (files go in
 * public/projects/micromouse/).
 */

const MouseCadViewer = dynamic(() => import('./MouseCadViewer'), {
  ssr: false,
  loading: () => <div className="mmcCad" />,
});

type Chapter = 1 | 2 | 3;

const CHAPTERS: { n: Chapter; tab: string; bg: string }[] = [
  { n: 1, tab: 'The idea', bg: '#fbf8f1' },
  { n: 2, tab: 'Design & prep', bg: '#ee8570' },
  { n: 3, tab: 'The hype & the day', bg: '#f5f3ed' },
];

/* ---- Media primitives ------------------------------------------------ */

function Slot({
  label,
  src,
  ratio,
  className = '',
}: {
  label: string;
  src?: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <div className={`mmcSlot ${className}`} style={ratio ? { aspectRatio: ratio } : undefined}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={label} loading="lazy" />
      ) : (
        // TODO: add the real photo for this slot.
        <span className="mmcSlotLabel">{label}</span>
      )}
    </div>
  );
}

function Video({
  label,
  chip,
  ratio,
  size = 54,
  rust = false,
  src,
  poster,
  className = '',
}: {
  label: string;
  chip: string;
  ratio: string;
  size?: number;
  rust?: boolean;
  src?: string;
  poster?: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={`mmcVideo ${className}`} style={{ aspectRatio: ratio }}>
      {playing && src ? (
        <video src={src} poster={poster} controls autoPlay playsInline />
      ) : (
        <>
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt={label} loading="lazy" />
          ) : (
            // TODO: add the cover frame for this video.
            <span className="mmcSlotLabel">{label}</span>
          )}
          <button
            type="button"
            className="mmcPlay"
            style={{ width: size, height: size, fontSize: size * 0.33 }}
            aria-label={`Play: ${label}`}
            disabled={!src}
            onClick={() => setPlaying(true)}
          >
            ▶
          </button>
          <span className={rust ? 'mmcChip mmcChipRust' : 'mmcChip'}>{chip}</span>
        </>
      )}
    </div>
  );
}

function Post({
  title,
  tag,
  media,
  heading,
  children,
}: {
  title?: string;
  tag?: string;
  media: ReactNode;
  heading?: string;
  children?: ReactNode;
}) {
  return (
    <article className="mmcPost">
      {title && (
        <header className="mmcPostBar">
          <span>{title}</span>
          {tag && <span>{tag}</span>}
        </header>
      )}
      {media}
      {(heading || children) && (
        <div className="mmcPostFoot">
          {heading && <h4>{heading}</h4>}
          {children && <p>{children}</p>}
        </div>
      )}
    </article>
  );
}

function Step({
  num,
  label,
  sub,
  accent = false,
  children,
}: {
  num: string;
  label: string;
  sub?: string;
  accent?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="mmcRow">
      <div className="mmcStamp">
        <span className={accent ? 'mmcStampNum mmcStampAccent' : 'mmcStampNum'}>{num}</span>
        <span className="mmcStampText">
          <span>{label}</span>
          {sub && <small>{sub}</small>}
        </span>
      </div>
      {children}
    </div>
  );
}

function ChapterHead({
  n,
  name,
  title,
  rust = false,
  aside,
}: {
  n: string;
  name: string;
  title: string;
  rust?: boolean;
  aside?: string;
}) {
  return (
    <div className="mmcHead">
      <div>
        <span className="mmcKicker">Chapter {n} · {name}</span>
        <h2>{title}</h2>
      </div>
      <div className="mmcHeadRight">
        {aside && <p className="mmcAside">{aside}</p>}
        <span className={rust ? 'mmcNumeral mmcNumeralRust' : 'mmcNumeral'}>{n}</span>
      </div>
    </div>
  );
}

/* ---- Chapter 1 ------------------------------------------------------- */

const BACKERS = [
  { id: 'anthropic', label: 'Prize sponsor', name: 'Anthropic', text: 'Came on board as prize sponsor, with $250 in credits.', stat: '$250', unit: 'in credits', logo: true, dark: true },
  { id: 'redbull', label: '96 cans', name: 'Red Bull', text: 'Sent 96 cans.', stat: '96', unit: 'cans' },
  { id: 'ucd', label: 'Purchasing + 40 pizzas', name: 'UCD School of EEE', text: 'Did all the purchasing for the event, and bought 40 large pizzas.', stat: '40', unit: 'large pizzas', lead: true },
  { id: 'makerspace', label: 'Maze materials', name: 'UCD Innovation Academy & Makerspace', text: 'Gave us the materials to manufacture the maze.', stat: '16×16', unit: 'maze, built from their materials' },
];

function ChapterOne() {
  return (
    <section id="ch1" className="mmcChapter mmcCh1">
      <div className="mmcInner">
        <ChapterHead n="01" name="The idea" title="Nobody needed to know anything already." />

        <div className="mmcIntro">
          <div className="mmcProse">
            <p>I designed the whole event around one rule: nobody should need to know anything already. No robotics, no embedded programming, no soldering. Most people assume a robot competition is for people who have already built robots, so I wanted to make one for the people who haven&apos;t.</p>
            <p>That rule decided almost everything else. Every team got the same kit, so nobody could get ahead by buying better parts. There was a briefing to start the day, mentors and postgraduate demonstrators on the floor throughout, and learning material published before the day.</p>
            <p>It also decided where I spent my time. I presoldered the components with the team, so that beginners were not learning to solder on the day, and I worked on the help section of the website, making sure there was a step-by-step plan anyone could follow. That is what let teams spend the six hours building a robot instead of working out the tools.</p>
          </div>
          <article className="mmcPost mmcLuma">
            <header className="mmcPostBar">
              <span>Where it started</span>
              <span>The event page</span>
            </header>
            <div className="mmcLumaBody">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="mmcLumaPoster"
                src="/projects/micromouse/posters/micromouse-open-2026.png"
                alt="Dublin Micromouse Open 2026 poster"
              />
              <div className="mmcLumaInfo">
                <h3>Dublin Micromouse Open 2026</h3>
                <p className="mmcLumaHost">Hosted by UCD ElecSoc</p>
                <div className="mmcLumaRow">
                  <span className="mmcLumaDate"><small>SEP</small>26</span>
                  <span><b>Saturday, September 26</b>12:00 PM – 6:00 PM</span>
                </div>
                <div className="mmcLumaRow">
                  <span className="mmcLumaDate">📍</span>
                  <span><b>UCD Engineering and Materials Science Centre</b>Dublin 4, County Dublin</span>
                </div>
                <a className="mmcLumaBtn" href="https://luma.com/la0rkr9w" target="_blank" rel="noopener noreferrer">
                  View the event on Luma ↗
                </a>
              </div>
            </div>
            <div className="mmcPostFoot">
              <p>One rule first, then everything else: the format, the kit, the briefing and the help pages all came out of it.</p>
            </div>
          </article>
        </div>

        <div className="mmcSell">
          <div>
            <span className="mmcEyebrow">Selling the vision</span>
            <h3>I threw out the old deck and built one for the event.</h3>
          </div>
          <div className="mmcProse">
            <p>ElecSoc already had a sponsorship deck. It described the society, and what I needed to sell was the vision for one event. So I designed a new deck from the ground up for Micromouse.</p>
            <p>It makes the case in a fixed order: why Ireland needs a competition like this, proof that ElecSoc can deliver, how Micromouse works, and then the ask. The ask was three tiers of partnership, from €200 to €1,200+, accepted as cash, product or in kind.</p>
          </div>
        </div>

        <div className="mmcDeck">
          <MicromouseDeck />
        </div>

        <div className="mmcSubHead">
          <span>The deck sold our credibility.</span>
          <p>I did not land any cash sponsors. What the deck did was make the event look credible enough that people backed it in other ways.</p>
        </div>
        <div className="mmcBackers">
          {BACKERS.map((b) => (
            <article key={b.id} className={b.lead ? 'mmcBacker mmcBackerLead' : 'mmcBacker'}>
              <div className={b.dark ? 'mmcStatTile mmcStatDark' : 'mmcStatTile'}>
                {b.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src="/projects/micromouse/anthropic-logo.svg" alt="" className="mmcStatLogo" />
                )}
                <strong>{b.stat}</strong>
                <span>{b.unit}</span>
              </div>
              <div className="mmcBackerBody">
                <b>{b.label}</b>
                <h4>{b.name}</h4>
                <p>{b.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- Help portal (mirrors the Resource Hub on hackclub.ucdelecsoc.com) -- */

const HUB_URL = 'https://hackclub.ucdelecsoc.com/micromouse-resources?nav=2';
const HUB_FILTERS = ['All', 'Strategy', 'Hardware', 'Software', 'Debug kit'] as const;
const HUB_ITEMS: { tag: string; cat: (typeof HUB_FILTERS)[number]; title: string; text: string }[] = [
  { tag: '01', cat: 'Debug kit', title: 'Onboard LED', text: 'USB only; red LED and alive serial messages.' },
  { tag: '02', cat: 'Debug kit', title: 'IMU on its own', text: 'Wire four connections and check heading as you turn.' },
  { tag: '08', cat: 'Debug kit', title: 'Both motors', text: 'Test forward, backward, spin left and spin right.' },
  { tag: 'S3', cat: 'Strategy', title: 'Flood fill and routing', text: 'The algorithm that finds the centre — and how to make it take diagonals.' },
  { tag: 'S5', cat: 'Strategy', title: 'Playbook and failures', text: 'An hour-by-hour plan for the six-hour build, and the failure modes to design against.' },
  { tag: 'H4', cat: 'Hardware', title: '3 × VL53L0X distance sensors', text: 'XSHUT GPIO18/19/20; left 0x30, front 0x31, right 0x29.' },
  { tag: 'H2', cat: 'Hardware', title: 'DFRobot DRI0044 motor driver', text: 'DIR/PWM on GPIO0/2 and GPIO3/10, with the supplied motor tests.' },
  { tag: 'C2', cat: 'Software', title: 'Git and GitHub basics', text: 'Clone, commit, branch — enough to not lose your work at hour five.' },
  { tag: 'C3', cat: 'Software', title: 'Working with AI agents on hardware', text: 'Prompting, wiring up context, and debugging with an agent on the bench.' },
];

function HelpPortal() {
  const [filter, setFilter] = useState<(typeof HUB_FILTERS)[number]>('All');
  const items = HUB_ITEMS.filter((i) => filter === 'All' || i.cat === filter);
  return (
    <article className="mmcPost mmcPostDark">
      <header className="mmcPostBar">
        <span>The help section</span>
        <span>Published before the day</span>
      </header>
      <div className="mmcHelp">
        <div className="mmcHub" aria-label="Preview of the Resource Hub">
          <div className="mmcHubTop">
            <span className="mmcHubLogo">HC</span>
            <b>Build Hub</b>
            <span className="mmcHubCount">28 resources</span>
          </div>
          <div className="mmcHubBody">
            <small>Dublin Micromouse Open 2026</small>
            <h5>Resource <em>Hub</em></h5>
            <div className="mmcHubSearch">/ &nbsp;Search resources — wiring, debug, IMU, motors…</div>
            <div className="mmcHubChips" role="tablist">
              {HUB_FILTERS.map((f) => (
                <button key={f} type="button" role="tab" aria-selected={filter === f} data-on={filter === f} onClick={() => setFilter(f)}>
                  {f}
                </button>
              ))}
            </div>
            <div className="mmcHubStart">
              <small>START HERE</small>
              <div>
                <b>Test your mouse, one part at a time</b>
                <span>Eight checks with exact wiring, expected output and code you can copy straight into Arduino IDE.</span>
              </div>
            </div>
            <ul className="mmcHubList">
              {items.map((i) => (
                <li key={i.tag}>
                  <span className="mmcHubTag">{i.tag}</span>
                  <span><small>{i.cat.toUpperCase()}</small><b>{i.title}</b><em>{i.text}</em></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h4>A portal with the whole build already written up.</h4>
          <p>
            Every team got a link to a resource hub: 28 pages covering the strategy, the hardware and the software, searchable and filterable. Each part of the kit has its own page with the exact pin assignments, and the code to run is already written, ready to copy into Arduino IDE.
          </p>
          <p>
            It starts with eight checks that test the mouse one part at a time, from the onboard LED to both motors, each with the wiring, the output to expect and the sketch. Then come the strategy pages (the rules, flood fill, an hour-by-hour plan for the six hours), plus Git basics and working with AI agents. That is what let teams spend the six hours building a robot instead of working out the tools.
          </p>
          <a className="mmcHubBtn" href={HUB_URL} target="_blank" rel="noopener noreferrer">Open the Resource Hub ↗</a>
        </div>
      </div>
    </article>
  );
}

/* ---- Chapter 2 ------------------------------------------------------- */

const KIT = [
  ['ESP32-C6', 'the microcontroller.'],
  ['DFRobot DRI0044 motor driver', "switches the motor current from the controller's signals."],
  ['DFRobot SEN0142 IMU', 'measures rotation, so a turn can be held straight.'],
  ['3× VL53L0X distance sensors', 'find the walls of the maze.'],
  ['2S battery to 5V buck converter', 'steps the battery voltage down for the electronics.'],
  ['2× GA12-N20 micro gear motors with Hall encoders', 'drive the wheels and report how far they have turned.'],
];

function ChapterTwo() {
  return (
    <section id="ch2" className="mmcChapter mmcCh2">
      <div className="mmcInner">
        <ChapterHead
          n="02"
          name="Design & prep"
          title="Same box of parts. Every team."
          aside="My team designed and 3D printed the mouse itself. We made 25 kits for the 20 teams and presoldered every one, so all a team had to bring was a battery."
        />
        <div className="mmcTimeline">
          <span className="mmcSpine" aria-hidden="true" />

          <Step num="2.1" label="Design">
            <Post
              title="Designing the mouse"
              tag="CAD → print"
              heading="A printed case with three eyes."
              media={
                <div className="mmcGrid mmcFeature">
                  <div className="mmcSpan2" style={{ aspectRatio: '4 / 3' }}>
                    <MouseCadViewer />
                  </div>
                  <Slot label="The printed case with the IMU, motor driver and ESP32 laid out" src="/projects/micromouse/design/case-printed.webp" />
                  <Slot label="Wired up inside the case" src="/projects/micromouse/design/case-wired.webp" />
                </div>
              }
            >
              The printed case holds three distance sensors, one at the front, one on the left and one on the right, so the mouse can see the walls it is driving between.
            </Post>
          </Step>

          <Step num="2.2" label="The kit">
            <Post
              title="What every team got"
              tag="25 kits · 20 teams"
              media={
                <div className="mmcGrid mmcKit">
                  <Slot label="A mouse built from the kit parts on a breadboard" src="/projects/micromouse/design/kit-assembled.webp" ratio="1 / 1" />
                  <div className="mmcKitList">
                    <span>Inside each kit</span>
                    <ul>
                      {KIT.map(([name, what]) => (
                        <li key={name}><span><strong>{name}:</strong> {what}</span></li>
                      ))}
                      <li><span><strong>Wheels and the 3D printed case.</strong></span></li>
                    </ul>
                  </div>
                </div>
              }
            />
          </Step>

          <Step num="2.3" label="Presolder">
            <Post
              title="Presoldering every kit"
              tag="Photos"
              heading="Nobody learns to solder on the day."
              media={
                <div className="mmcGrid mmcPair">
                  <Slot label="Motor driver boards laid out beside the solder, flux and header pins" src="/projects/micromouse/design/presolder-boards.webp" ratio="4 / 5" />
                  <Slot label="Two teammates at the bench working on a mouse" src="/projects/micromouse/design/presolder-bench.webp" />
                </div>
              }
            >
              I presoldered the components with the team, so that beginners were not learning to solder on the day.
            </Post>
          </Step>

          <Step num="2.4" label="The maze">
            <Post
              title="Building the maze"
              tag="16 × 16"
              heading="Designed and laser cut by us."
              media={
                <div className="mmcGrid mmcMaze">
                  <Video label="The laser cutter cutting maze wall panels" chip="LASER CUTTING" ratio="16 / 9" size={64} className="mmcFull" src="/projects/micromouse/design/maze-laser-cut.mp4" poster="/projects/micromouse/design/maze-laser-cut-poster.jpg" />
                  <Slot label="The finished 16 × 16 maze, built on the floor" src="/projects/micromouse/design/maze-finished.webp" ratio="16 / 9" className="mmcFull" />
                  <Slot label="The wall panels drawn up flat in CAD" src="/projects/micromouse/design/maze-cad-walls.webp" ratio="4 / 3" />
                  <Slot label="The corner post drawn in CAD" src="/projects/micromouse/design/maze-cad-post.webp" ratio="4 / 3" />
                  <Slot label="Stacks of laser cut wall panels" src="/projects/micromouse/design/maze-wall-stacks.webp" ratio="4 / 3" />
                  <Slot label="Laser cut wall panels slotting into a printed corner post" src="/projects/micromouse/design/maze-corner.webp" ratio="4 / 3" />
                  <Slot label="3D printed posts and corner pieces" src="/projects/micromouse/design/maze-printed-posts.webp" ratio="4 / 3" />
                </div>
              }
            >
              We designed and laser cut the whole maze ourselves, to the world-standard 16 × 16 format, which made the competition properly hard. UCD Innovation Academy and Makerspace gave us the materials to manufacture it.
            </Post>
          </Step>

          <Step num="2.5" label="Help pages">
            <HelpPortal />
          </Step>
        </div>
      </div>
    </section>
  );
}

/* ---- Chapter 3 ------------------------------------------------------- */

const REELS = ['Reel 01', 'Reel 02', 'Reel 03'];
const VLOGS = ['Vlog 01', 'Vlog 02'];

function ChapterThree() {
  return (
    <section id="ch3" className="mmcChapter mmcCh3">
      <div className="mmcInner">
        <ChapterHead n="03" name="The hype & the day" title="It knows the way out." rust />

        <div className="mmcPosters">
          <MicromousePosters />
        </div>

        <div className="mmcSubHead mmcSubHeadPlain">
          <span>Three short reels.</span>
          <p>The build-up, in vertical. Drop each reel&apos;s cover frame here.</p>
        </div>
        <div className="mmcReels">
          {REELS.map((r) => (
            <figure key={r}>
              <Video label={`${r} cover`} chip={r.toUpperCase()} ratio="9 / 16" rust />
              {/* TODO: reel title */}
              <figcaption>Reel title</figcaption>
            </figure>
          ))}
        </div>

        <div className="mmcDay">
          <div>
            <span className="mmcEyebrow">Saturday 26 September 2026</span>
            <h3>Six hours, start to start line.</h3>
          </div>
          <p>20 teams and 110 participants built, programmed and raced their robots inside that one day, all from the same kit.</p>
        </div>

        <div className="mmcTimeline mmcTimeline3">
          <span className="mmcSpine" aria-hidden="true" />

          <Step num="3.1" label="Briefing" sub="30 minutes">
            <Post
              heading="Opening briefing"
              media={
                <div className="mmcGrid mmcThree">
                  <Slot label="The room during the briefing" ratio="4 / 3" />
                  <Slot label="Slides on screen" ratio="4 / 3" />
                  <Slot label="Teams listening" ratio="4 / 3" />
                </div>
              }
            >
              Every electronics diagram prepared in advance: the encoded motors, the motor driver, the IMU, the distance sensors, why the kit carries a buck converter, and how the battery packs actually work. GitHub basics for anyone who has not used it, then a walk through the maze-solving strategies so teams choose an approach instead of guessing at one.
            </Post>
          </Step>

          <Step num="3.2" label="The build" sub="Six hours">
            <Post
              heading="Design, solder, code"
              media={
                <div className="mmcGrid mmcBento">
                  <Slot label="Hero shot: the build floor" className="mmcSpan22" />
                  <Slot label="Wiring up" ratio="1 / 1" />
                  <Slot label="Laptop + code" ratio="1 / 1" />
                  <Slot label="Mentor helping" ratio="1 / 1" />
                  <Slot label="First mouse moving" ratio="1 / 1" />
                  <Slot label="Team portrait" ratio="1 / 1" />
                  <Slot label="Team portrait" ratio="1 / 1" />
                  <Slot label="Close-up of a mouse" ratio="1 / 1" />
                  <Slot label="Debugging" ratio="1 / 1" />
                </div>
              }
            >
              The whole build happens on the day, from the same box of parts. ElecSoc committee members and postgraduate demonstrators stayed on the floor throughout, so a stuck team had someone standing next to them within a minute.
            </Post>
          </Step>

          <Step num="3.3" label="Practice" sub="All day">
            <Post
              heading="Practice mazes were open all day."
              media={
                <div className="mmcGrid mmcReel5">
                  <Video label="Clip: a mouse on the practice maze" chip="CLIP" ratio="9 / 16" rust />
                  <div className="mmcStack mmcStackWide">
                    <Slot label="Full-size practice maze" />
                    <Slot label="Mini maze" />
                  </div>
                </div>
              }
            >
              Full size and mini mazes sat alongside the build floor from the start, so a team could tune its algorithm against real walls instead of against an assumption about walls — and find out what is wrong before the run that counts.
            </Post>
          </Step>

          <Step num="3.4" label="Race it" sub="Timed runs" accent>
            <Post
              heading="Timed runs"
              media={
                <div className="mmcGrid mmcMaze">
                  <Video label="Race footage cover: the winning run" chip="RACE FOOTAGE" ratio="16 / 9" size={72} rust className="mmcFull" />
                  <Slot label="Start line" ratio="4 / 3" />
                  <Slot label="Crowd around the maze" ratio="4 / 3" />
                  <Slot label="Reaching the centre" ratio="4 / 3" />
                </div>
              }
            >
              The main award goes to the fastest verified run to the centre of the maze, with further awards for design and reliability — so a mouse that is quick once does not beat one that works every time.
            </Post>
          </Step>

          <Step num="3.5" label="Awards" sub="End of the day">
            <Post
              heading="Fastest, best designed, most reliable."
              media={
                <div className="mmcGrid mmcThree">
                  <Slot label="Winners with the prize" ratio="4 / 5" />
                  <Slot label="Everyone, group photo" ratio="4 / 5" />
                  <Slot label="Pizza + Red Bull table" ratio="4 / 5" />
                </div>
              }
            >
              {/* TODO: replace with the winners and a line about the room at the end of the day. */}
              Add the winners and a line about the room at the end of the day.
            </Post>
          </Step>
        </div>

        <div className="mmcSubHead mmcSubHeadPlain">
          <span>The two long-form vlogs.</span>
          <p>The whole thing, start to finish, directed by me.</p>
        </div>
        <div className="mmcVlogs">
          {VLOGS.map((v) => (
            <figure key={v}>
              <div className="mmcVlogBar"><span>{v}</span><span>Watch ↗</span></div>
              <Video label={`${v} thumbnail`} chip={v.toUpperCase()} ratio="16 / 9" size={64} rust />
              {/* TODO: vlog title */}
              <figcaption>Vlog title</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- The book -------------------------------------------------------- */

export default function MicromouseChapters() {
  const [chapter, setChapter] = useState<Chapter>(1);
  const tabsRef = useRef<HTMLDivElement>(null);
  const leafRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  // Open on the chapter named in the URL hash (#ch1..#ch3).
  useEffect(() => {
    const read = () => {
      const m = /^#ch([123])$/.exec(window.location.hash);
      if (m) setChapter(Number(m[1]) as Chapter);
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);

  const go = useCallback(
    (to: Chapter) => {
      if (to === chapter) return;
      const forward = to > chapter;
      const from = chapter;

      const tabs = tabsRef.current;
      if (tabs) {
        const top = tabs.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY > top) window.scrollTo({ top, behavior: 'auto' });
      }
      setChapter(to);
      try {
        window.history.replaceState(null, '', `#ch${to}`);
      } catch {}

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const leaf = leafRef.current;
      const page = pageRef.current;
      if (leaf?.animate) {
        leaf.style.background = CHAPTERS[(forward ? from : to) - 1].bg;
        leaf.animate(
          forward
            ? [
                { transform: 'rotateY(0deg)', opacity: 1, boxShadow: '0 0 0 rgba(0,0,0,0)' },
                { transform: 'rotateY(-95deg)', opacity: 1, boxShadow: '-30px 0 60px rgba(0,0,0,.25)' },
              ]
            : [
                { transform: 'rotateY(-95deg)', opacity: 1 },
                { transform: 'rotateY(0deg)', opacity: 1, offset: 0.9 },
                { transform: 'rotateY(0deg)', opacity: 0 },
              ],
          { duration: 720, easing: 'cubic-bezier(.45,.05,.25,1)' },
        );
      }
      page?.animate?.([{ filter: 'brightness(.75)' }, { filter: 'brightness(1)' }], {
        duration: 720,
        easing: 'ease-out',
      });
    },
    [chapter],
  );

  const prev = CHAPTERS[chapter - 2];
  const next = CHAPTERS[chapter];

  return (
    <div className="mmc">
      <div ref={tabsRef} className="mmcTabs">
        <span className="mmcTabsLabel">The story in three chapters</span>
        <div className="mmcTabList" role="tablist">
          {CHAPTERS.map((c) => (
            <button
              key={c.n}
              type="button"
              role="tab"
              aria-selected={chapter === c.n}
              className="mmcTab"
              data-active={chapter === c.n}
              style={{ background: c.bg, borderBottomColor: chapter === c.n ? c.bg : undefined }}
              onClick={() => go(c.n)}
            >
              <span className="mmcTabNum">0{c.n}</span>
              {c.tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mmcStage">
        <div ref={leafRef} className="mmcLeaf" aria-hidden="true" />
        <div ref={pageRef} className="mmcPage">
          {chapter === 1 && <ChapterOne />}
          {chapter === 2 && <ChapterTwo />}
          {chapter === 3 && <ChapterThree />}
        </div>
      </div>

      <div className="mmcFoot">
        {prev ? (
          <button type="button" className="mmcFootBtn" onClick={() => go(prev.n)}>
            <span>← Previous chapter</span>
            <b>{prev.tab}</b>
          </button>
        ) : (
          <span />
        )}
        {next && (
          <button type="button" className="mmcFootBtn mmcFootNext" onClick={() => go(next.n)}>
            <span>Turn the page →</span>
            <b>{next.tab}</b>
          </button>
        )}
      </div>
    </div>
  );
}
