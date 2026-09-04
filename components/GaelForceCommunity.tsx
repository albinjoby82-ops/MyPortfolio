import SocialPost from './SocialPost';
import './GaelForceCommunity.css';

const APPLICATIONS_POST =
  'https://www.linkedin.com/posts/gaelforceucd_great-news-applications-are-now-open-for-activity-7448115698758946816-NNCI';

const HARD_LAUNCH_POST =
  'https://www.linkedin.com/posts/gaelforceucd_what-a-great-official-hard-launch-for-gaelforce-activity-7453171490084081664-5dJD';

const SCHOOL_SUPPORT_POST =
  'https://www.linkedin.com/posts/ucd-electrical-and-electronic-engineering_engineering-vex-robotics-activity-7478378174746279936-1X3f';

export default function GaelForceCommunity() {
  return (
    <section
      className="gaelForceCommunity gutter"
      aria-labelledby="galeforce-community-title"
    >
      <div className="gaelForceCommunityInner">
        <div className="gaelForceCommunityIntro">
          <div>
            <span className="galeForceKicker">03 · Becoming established</span>
            <h2 id="galeforce-community-title">
              We stopped looking like an idea and started showing up as a team.
            </h2>
          </div>

          <div className="gaelForceCommunityCopy">
            <p>
              With the school&apos;s backing and our first sponsors in place,
              GaelForce was moving from a promising idea into an established
              student engineering team. The next step was to become visible:
              show the work, meet the wider engineering community and prove
              that we intended to stay.
            </p>
            <p>
              We began attending events run by other engineering societies,
              including UCD ElecSoc&apos;s RoboExpo. These events gave us a chance
              to meet students, teams and industry contributors, demonstrate
              an early prototype and build recognition around GaelForce.
            </p>
            <p>
              At the same time, we opened applications to grow beyond the
              founding group. We recruited across mechanical engineering,
              operations, programming and electrical/electronic engineering,
              welcoming people with different levels of experience. As a
              co-founder, I helped turn our early momentum into a public
              presence and a recruitment pipeline for a multidisciplinary team.
            </p>
          </div>
        </div>

        <div className="gaelForceLinkedInHeading">
          <span>Building the team in public</span>
          <p>
            Three moments from GaelForce&apos;s first recruitment, outreach and
            university-support push.
          </p>
        </div>

        <div className="gaelForceLinkedInGrid">
          <SocialPost
            network="linkedin"
            post={APPLICATIONS_POST}
            height={760}
            caption="Opening applications was the step from a founding group to a multidisciplinary team built for a full VEX U season."
          />
          <SocialPost
            network="linkedin"
            post={HARD_LAUNCH_POST}
            height={760}
            caption="Our official hard launch put GaelForce, its early prototype and its ambitions in front of UCD's wider engineering community."
          />
          <SocialPost
            network="linkedin"
            post={SCHOOL_SUPPORT_POST}
            height={760}
            caption="UCD's School of Electrical and Electronic Engineering publicly announced its support for GaelForce, giving the team visible institutional backing."
          />
        </div>
      </div>
    </section>
  );
}
