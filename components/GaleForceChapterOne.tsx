import './GaleForceChapterOne.css';

const VIDEO_ID = '68NxYIAzbkY';

export default function GaleForceChapterOne() {
  return (
    <section className="galeForceChapterOne gutter" aria-labelledby="galeforce-chapter-one-title">
      <div className="galeForceChapterIntro">
        <div>
          <span className="galeForceKicker">01 · The idea</span>
          <h2 id="galeforce-chapter-one-title">
            We started GaleForce because Ireland had no VEX U team.
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
            I co-founded GaleForce, so my role reaches across the whole
            project: engineering, prototyping, sponsor communication, PR,
            school coordination and making sure the team has what it needs to
            reach the competition.
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
            A short introduction to the competition we built GaleForce to enter.
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
            GaleForce could bring something valuable to the university. It was
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
            title="GaleForce initial pitch deck"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
