import './GaleForceChapterOne.css';

const VIDEO_ID = '68NxYIAzbkY';

export default function GaleForceChapterOne() {
  return (
    <section className="galeForceChapterOne gutter" aria-labelledby="galeforce-chapter-one-title">
      <div className="galeForceChapterIntro">
        <div>
          <span className="galeForceKicker">01 · The idea</span>
          <h2 id="galeforce-chapter-one-title">
            We started GaelForce because Ireland had no VEX U team.
          </h2>
        </div>
        <div className="galeForceChapterCopy">
          <p>
            In April 2026, me and a few friends decided to try something that
            did not exist yet: build Ireland&apos;s first VEX U robotics team and
            enter the season&apos;s competition.
          </p>
          <p>
            We did not begin with a robot, a workshop or a sponsor behind us.
            We began with an idea that had to be made real. Before we could
            design anything, we had to explain VEX U to the School of
            Electrical and Electronic Engineering, bring the school onboard,
            find funding and create a team that could actually operate.
          </p>
          <p>
            I co-founded GaelForce and serve as Head of the
            Electrical/Electronics department. I lead the team&apos;s electrical
            work while contributing across the wider project through
            engineering, prototyping, sponsor communication, PR, school
            coordination and making sure the team has what it needs to reach
            the competition.
          </p>
        </div>
      </div>

      <div className="galeForceVexBlock">
        <div className="galeForceVexCopy">
          <span className="galeForceKicker">The competition</span>
          <h3>What is VEX U?</h3>
          <p>
            VEX U is the university division of VEX Robotics. Teams design,
            build and program their own competition robots around a new game
            each season. The university rules make room for custom fabrication
            and additional electronics, so the challenge sits across mechanical
            design, electrical systems, software, strategy and teamwork.
          </p>
          <p>
            The matches are the visible part of it. Behind every robot is a
            cycle of reading the rules, choosing a strategy, modelling parts,
            manufacturing them, testing what breaks and changing the design
            before the next match.
          </p>
          <a
            className="galeForceSourceLink"
            href="https://www.vexrobotics.com/override-manual"
            target="_blank"
            rel="noreferrer"
          >
            Read the official VEX U rules ↗
          </a>
        </div>

        <div className="galeForceVideoWindow">
          <div className="galeForceWindowBar">
            <span>VEX U · EXPLAINED</span>
            <span>WATCH INLINE</span>
          </div>
          <div className="galeForceVideoFrame">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0`}
              title="VEX U Robotics explained"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <p className="galeForceWindowCaption">
            A short introduction to the competition we built GaelForce to enter.
          </p>
        </div>
      </div>

      <div className="galeForcePitchBlock">
        <div className="galeForcePitchHeading">
          <div>
            <span className="galeForceKicker">The first pitch</span>
            <h3>Before we built a robot, we had to make the case.</h3>
          </div>
          <p>
            This is the original deck we brought to the school. It explained
            what VEX U was, who we were, what support the team needed and why
            GaelForce could bring something valuable to the university. It was
            the first step in turning an idea between friends into an official
            team.
          </p>
        </div>

        <div className="galeForcePdfWindow">
          <div className="galeForceWindowBar">
            <span>GALEFORCE · INITIAL PITCH DECK</span>
            <a href="/projects/galeforce/initial-pitch-deck.pdf" download>
              Download PDF ↗
            </a>
          </div>
          <iframe
            src="/projects/galeforce/initial-pitch-deck.pdf#view=FitH"
            title="GaelForce initial pitch deck"
            loading="lazy"
          />
        </div>
      </div>

      <div className="galeForceSponsorshipBlock">
        <div className="galeForceSponsorshipHeading">
          <div>
            <span className="galeForceKicker">02 · Sponsorships</span>
            <h3>Official backing gave us momentum. Sponsorship made the build possible.</h3>
          </div>
          <div className="galeForceSponsorshipCopy">
            <p>
              Once GaelForce was officially backed by UCD&apos;s School of
              Electrical and Electronic Engineering, we got straight to work
              on the next challenge: raising the money and securing the
              materials needed to build two competitive robots.
            </p>
            <p>
              As a co-founder, it was my responsibility to help see that
              process through. Before the semester had even started, I had
              personally brought on three 3D-printing sponsors: SUNLU, 3DJake
              and eSUN.
            </p>
            <p>
              Each partnership came down to a combination of good timing, a
              strong sponsorship deck and an online meeting to close the deal.
              The timing opened the door, the deck made a clear case for the
              team, and the conversation turned that interest into practical
              support.
            </p>
            <a
              className="galeForceSourceLink"
              href="https://gaelforceucd.ie/#sponsors"
              target="_blank"
              rel="noreferrer"
            >
              See GaelForce&apos;s current sponsors ↗
            </a>
          </div>
        </div>

        <div className="galeForceSponsorNames" aria-label="3D-printing sponsors I secured">
          <span>Personally secured before semester</span>
          <strong>SUNLU</strong>
          <strong>3DJake</strong>
          <strong>eSUN</strong>
        </div>

        <div className="galeForcePdfWindow">
          <div className="galeForceWindowBar">
            <span>GALEFORCE · SPONSORSHIP DECK</span>
            <a href="/projects/galeforce/sponsorship-deck.pdf" download>
              Download PDF ↗
            </a>
          </div>
          <iframe
            src="/projects/galeforce/sponsorship-deck.pdf#view=FitH"
            title="GaelForce sponsorship deck"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
