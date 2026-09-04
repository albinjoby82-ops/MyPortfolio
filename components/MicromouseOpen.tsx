import './MicromouseOpen.css';

/**
 * Dublin Micromouse Open — the parts of the story that are better shown than
 * described: the issued kit, the shape of the day, the poster campaign and how
 * the sponsorship was structured.
 *
 * Every fact here comes from the event material in the AJ_HackClub_267 repo.
 * Nothing is inferred. If a detail isn't in that source, it isn't on this page.
 */

const KIT = [
  { no: '01', name: 'ESP32', role: 'The microcontroller every mouse is built around.' },
  { no: '02', name: 'Encoded motors', role: 'Drive wheels that also report how far they have turned.' },
  { no: '03', name: 'Motor driver', role: 'Switches motor current from the controller’s logic signals.' },
  { no: '04', name: 'IMU', role: 'Measures rotation, so a turn can be held straight.' },
  { no: '05', name: 'Distance sensors', role: 'Find the walls the maze is made of.' },
  { no: '06', name: 'Battery management system', role: 'Keeps the cells balanced and protected.' },
  { no: '07', name: 'Buck converter', role: 'Steps the pack voltage down to the logic rail.' },
  { no: '08', name: 'Battery pack', role: 'On-board power for the whole run.' },
];

const DAY = [
  {
    stamp: '30 minutes',
    title: 'Opening briefing',
    body: 'Every electronics diagram prepared in advance: the encoded motors, the motor driver, the IMU, the distance sensors, why the kit carries a battery management system and a buck converter, and how the battery packs actually work. GitHub basics for anyone who has not used it, then a walk through the maze-solving strategies so teams choose an approach instead of guessing at one.',
  },
  {
    stamp: 'Six hours',
    title: 'Design, solder, code',
    body: 'The whole build happens on the day, from the same box of parts. ElecSoc committee members and postgraduate demonstrators stay on the floor throughout, so a stuck team has someone standing next to them within a minute.',
  },
  {
    stamp: 'Then race it',
    title: 'Timed runs',
    body: 'The main award goes to the fastest verified run to the centre of the maze, with further awards for design and reliability — so a mouse that is quick once does not beat one that works every time.',
  },
];

const POSTERS = [
  {
    src: '/projects/micromouse/campaign/start-line.jpg',
    alt: 'Square poster: the ElecSoc logo above "Dublin Micromouse Open 2026" with a chequered start line along the bottom',
    caption: 'Start line',
  },
  {
    src: '/projects/micromouse/campaign/radar-contact.jpg',
    alt: 'Square poster: radar sweep rings around a single orange contact, headline "It knows the way out"',
    caption: 'One contact detected',
  },
  {
    src: '/projects/micromouse/campaign/cv-dull-dark.jpg',
    alt: 'Dark portrait poster: "CV looking dull? Add a robot", with a CV line entry reading "Autonomous micro-mouse — designed, built, programmed, raced"',
    caption: 'Add a robot',
  },
  {
    src: '/projects/micromouse/campaign/weve-got-robots-alt.jpg',
    alt: 'Dark portrait poster: "We’ve got robots, you’ve got squat", with a photo of a student holding a printed walking robot',
    caption: 'Design · Solder · Code · Race',
  },
  {
    src: '/projects/micromouse/campaign/figure-it-out-poster.jpg',
    alt: 'Cream poster: "You’re not supposed to know how. You’re supposed to figure it out", beside a photo of a cluttered electronics bench',
    caption: 'Get stuck. Get curious. Get unstuck.',
  },
  {
    src: '/projects/micromouse/campaign/figure-it-out-wide.jpg',
    alt: 'Two-panel poster splitting "You’re not supposed to know how" on cream from "Figure it out" on black',
    caption: 'Build it. Break it. Debug it. Try again.',
  },
  {
    src: '/projects/micromouse/campaign/figure-it-out-photo.jpg',
    alt: 'Poster built over a photograph of a home electronics desk at night, with three black-and-white workbench shots below it',
    caption: 'Real projects. Real dead ends. Real Tuesday nights.',
  },
];

type Tier = {
  no: string;
  name: string;
  price: string;
  body: string;
  status?: string;
  lead: boolean;
};

const TIERS: Tier[] = [
  {
    no: '01 · Headline',
    name: 'Presenting Event Partner',
    price: '€1,200+ · cash, or cash and product',
    body: 'Naming rights, the largest logo on every poster and on the awards backdrop, a mention in every major announcement, and an award presented on the day.',
    lead: true,
  },
  {
    no: '02 · One company',
    name: 'Official Prize Partner',
    price: '€500–1,000 · cash or agreed products',
    body: 'Ring-fenced entirely for the prize pool — nothing else touches it. The partner owns the prize pool, the prize graphics and every winner announcement that follows.',
    lead: false,
  },
  {
    no: '03 · One of three',
    name: 'Official Technical Partner',
    price: '€200–500 each, or components in kind',
    body: 'Goes to sensors, motors, batteries, PCBs, filament, tools and printing. Each partner owns one technical category, in students’ hands on the day.',
    status: 'Anthropic confirmed',
    lead: false,
  },
];

export default function MicromouseOpen() {
  return (
    <section className="mmSection gutter" aria-labelledby="micromouse-open-title">
      <div className="mmBlock mmIntro">
        <div>
          <span className="mmKicker">01 · The event</span>
          <h2 id="micromouse-open-title">Ireland had never run one. So we ran one.</h2>
        </div>
        <div className="mmCopy">
          <p>
            Micromouse is one of the oldest challenges in robotics: a small robot
            that solves a maze entirely on its own, with no remote control and no
            driver once the run starts. Ireland had never run a national one.
          </p>
          <p>
            The Dublin Micromouse Open is the first. It runs for a single day at
            UCD Village, hosted by UCD ElecSoc, and the entire competition
            &mdash; design, build, program, race &mdash; happens inside that one
            day.
          </p>

          <dl className="mmFacts">
            <div>
              <dt>Date</dt>
              <dd>Saturday 26 September 2026</dd>
            </div>
            <div>
              <dt>Venue</dt>
              <dd>UCD Village, University College Dublin</dd>
            </div>
            <div>
              <dt>Hosted by</dt>
              <dd>UCD ElecSoc</dd>
            </div>
          </dl>

          <div className="mmPartners">
            <span className="mmPartnerLabel">Supported by</span>
            <div className="mmPartnerRow">
              <img
                className="mmPartnerLogo"
                src="/projects/micromouse/anthropic-logo.svg"
                alt="Anthropic"
              />
              <span className="mmPartnerRule" aria-hidden="true" />
              <span className="mmPartnerName">
                UCD School of Electrical &amp; Electronic Engineering
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mmBlock mmKitBlock">
        <div>
          <span className="mmKicker">02 · The kit</span>
          <h3>Same box of parts. Every team.</h3>
          <div className="mmCopy">
            <p>
              Every team receives an identical modular kit. Fixing the parts list
              is what makes the six-hour format fair: nobody can buy an advantage
              in advance, and the technical rules only have to describe what you
              may do with the kit rather than what you may bring to it.
            </p>
            <p>
              It is modular on purpose. There is no single correct mouse design,
              and very different machines are expected to come out of the same
              box.
            </p>
          </div>
        </div>

        <ul className="mmKitGrid">
          {KIT.map((part) => (
            <li className="mmKitPart" key={part.no}>
              <span>{part.no}</span>
              <strong>{part.name}</strong>
              <em>{part.role}</em>
            </li>
          ))}
        </ul>
      </div>

      <div className="mmBlock">
        <span className="mmKicker">03 · The day</span>
        <h3>Six hours, start to start line.</h3>

        <div className="mmDayGrid">
          {DAY.map((step) => (
            <div className="mmDayStep" key={step.title}>
              <b>{step.stamp}</b>
              <h4>{step.title}</h4>
              <p>{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mmMazeNote">
          <h4>Practice mazes are open all day.</h4>
          <p>
            Full size and mini mazes sit alongside the build floor from the
            start, so a team can tune its algorithm against real walls instead of
            against an assumption about walls &mdash; and find out what is wrong
            before the run that counts.
          </p>
        </div>
      </div>

      <div className="mmBlock mmCampaign">
        <span className="mmKicker">04 · The campaign</span>
        <h3>It knows the way out.</h3>
        <p className="mmCampaignLede">
          The poster series ElecSoc ran in the build-up. One promise repeated
          across all of it: no experience needed, nothing to bring, just show up
          &mdash; because the people this competition was designed for are the
          ones who would otherwise assume it was not for them.
        </p>

        <div className="mmPosterGrid">
          {POSTERS.map((poster) => (
            <figure className="mmPoster" key={poster.src}>
              <img src={poster.src} alt={poster.alt} loading="lazy" />
              <figcaption>{poster.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="mmBlock">
        <div className="mmHeadRow">
          <div>
            <span className="mmKicker">05 · Backing the build</span>
            <h3>Three tiers, running together.</h3>
          </div>
          <div className="mmCopy">
            <p>
              A competition where every team is handed the same kit only works
              if somebody pays for the kits. I contacted engineering companies
              directly and built the sponsorship around three tiers that run
              alongside each other rather than compete, with support accepted as
              cash, product or in kind &mdash; which matters when what you
              actually need is a box of distance sensors rather than a transfer.
            </p>
          </div>
        </div>

        <div className="mmTierGrid">
          {TIERS.map((tier) => (
            <div
              className={tier.lead ? 'mmTier mmTierLead' : 'mmTier'}
              key={tier.name}
            >
              <span className="mmTierNo">{tier.no}</span>
              <h4>{tier.name}</h4>
              <p className="mmTierPrice">{tier.price}</p>
              <p>{tier.body}</p>
              {tier.status && <p className="mmTierStatus">{tier.status}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="mmBlock">
        <div className="mmHeadRow">
          <div>
            <span className="mmKicker">06 · Before the day</span>
            <h3>Nobody is handed a bag of components and left to it.</h3>
          </div>
          <div className="mmCopy">
            <p>
              &ldquo;No experience needed&rdquo; is easy to put on a poster and
              hard to deliver in six hours. Teams get a pre-recorded video series
              on driving the sensors with the ESP32, plus written documentation
              and setup docs published in advance, so the first hour of the build
              goes into the robot rather than into a toolchain. Two of the
              written guides exist because of what actually goes wrong on a
              build day.
            </p>
          </div>
        </div>

        <div className="mmGuideGrid">
          <div className="mmGuide">
            <b>Resource hub · C2</b>
            <h4>Git and GitHub Basics</h4>
            <p>
              Four people editing firmware can lose a working robot faster than
              one person can. Clone, branch, commit, pull, resolve the merge
              conflict, and get back to the version that worked twenty minutes
              ago without deleting the team&apos;s history.
            </p>
          </div>
          <div className="mmGuide">
            <b>Resource hub · C3</b>
            <h4>Working with AI Agents on Hardware</h4>
            <p>
              An agent cannot see a loose wire, measure a voltage or know that a
              component is hot. The guide covers building a hardware context pack
              &mdash; pinout card, datasheets, library versions, wiring table
              &mdash; so the answers you get are about your robot rather than a
              plausible one.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
