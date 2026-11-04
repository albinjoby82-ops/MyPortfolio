import SocialPost from './SocialPost';
import SummerMeetingWindow, { type FlickPhoto } from './SummerMeetingWindow';
import './GaelForceCommunity.css';
import './GaelForceRecruiting.css';

// Instagram story highlights (instagram.com/s/...) cannot be embedded, so each
// one renders as a story-shaped card that opens the highlight on Instagram.
// Add `cover` (a path under /public) to fill the card with a photo or still.
type Highlight = {
  href: string;
  title: string;
  place: string;
  cover?: string;
};

const HIGHLIGHTS: Highlight[] = [
  {
    href: 'https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTExMzg1NjQ5NDY2MjQy?story_media_id=3988187872678984236_40217018357&srtk=YTNoNWJpdWdvY2do',
    title: 'Timmy at Freshers',
    place: 'UCD Freshers tent',
  },
  // TODO: Techsesh highlight or post, once Albin sends the link.
];

// Normal Instagram posts and reels (instagram.com/p/... or /reel/...) can be
// embedded. Paste their URLs here and they render after the highlights.
const INSTAGRAM_POSTS: { post: string; caption?: string }[] = [];

const INFO_NIGHT_POST =
  'https://www.linkedin.com/feed/update/urn:li:activity:7511758924631412738/';

const ANNOUNCEMENT_VIDEO_ID = 'sb7UXM1dktI';

// Photos of the team building Timmy. Captions only describe what is in each shot.
const TIMMY_PHOTOS: FlickPhoto[] = [
  {
    src: '/projects/galeforce/timmy/team-with-timmy.jpeg',
    alt: 'Five GaelForce members around a table in a UCD study room, with Timmy and a laptop showing the VEX website',
    caption: 'The team around the table with Timmy.',
  },
  {
    src: '/projects/galeforce/timmy/parts-table.jpeg',
    alt: 'A table covered in laser-cut wooden wheels, omni wheels, green 3D-printed channels and tools while team members work',
  },
  {
    src: '/projects/galeforce/timmy/working-on-lift.jpeg',
    alt: 'A GaelForce member kneeling beside the robot, pointing at its lift and drivetrain',
    caption: 'Going over the lift and drivetrain.',
  },
];

const FIELD_PHOTOS: FlickPhoto[] = [
  {
    src: '/projects/galeforce/field/unpacking.jpg',
    alt: 'Two GaelForce members in a dark room with open boxes and a red VEX bag on the floor, one holding a red and black part',
    caption: 'Unpacking the VEX delivery.',
  },
  {
    src: '/projects/galeforce/field/laying-tiles.jpg',
    alt: 'Two GaelForce members beside the half-built field, with grey foam tiles laid out on the floor',
    caption: 'Laying the field tiles.',
  },
  {
    src: '/projects/galeforce/field/field-built.jpg',
    alt: 'The finished VEX field with its checkered walls and tall stacks of red, yellow and blue cups on their bases',
    caption: 'The field, built for the first time.',
  },
];

export default function GaelForceRecruiting() {
  return (
    <section
      className="gaelForceCommunity gutter"
      aria-labelledby="galeforce-recruiting-title"
    >
      <div className="gaelForceCommunityInner">
        <div className="gaelForceCommunityIntro">
          <div>
            <span className="galeForceKicker">05 · Recruiting again</span>
            <h2 id="galeforce-recruiting-title">
              Semester 1 started, and we needed more people.
            </h2>
          </div>

          <div className="gaelForceCommunityCopy">
            <p>
              When the new semester began, recruitment became our main focus.
              We put a lot of effort into our social media, and we opened
              applications again.
            </p>
            <p>
              By this point we had received some of the VEX material, so we
              made something to help us get noticed: Timmy, a friendly robot
              with a drivetrain, a claw and a lift. He wasn&apos;t the
              competition robot. He was there to get people&apos;s attention.
            </p>
            <p>
              We took Timmy to the UCD Freshers tent and to the Techsesh, and
              he also became part of our social media posts.
            </p>
          </div>
        </div>

        <div className="timmyBlock">
          <div className="timmyStories">
            {HIGHLIGHTS.map(({ href, title, place, cover }) => (
              <a
                key={href}
                className={`timmyStory${cover ? ' timmyStory--cover' : ''}`}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${title}: watch the highlight on Instagram`}
              >
                {cover && <img className="timmyStoryCover" src={cover} alt="" />}

                <div className="timmyStoryTop">
                  <div className="timmyStoryBars" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className="timmyStoryUser">
                    <span className="timmyStoryAvatar" aria-hidden="true">
                      GF
                    </span>
                    <span>GaelForce</span>
                    <span className="timmyStoryTag">Highlight</span>
                  </div>
                </div>

                <div className="timmyStoryBody">
                  <span className="timmyStoryPlace">{place}</span>
                  <strong>{title}</strong>
                </div>

                <span className="timmyStoryCta">Watch on Instagram ↗</span>
              </a>
            ))}
          </div>

          <div className="timmyFlick">
            <SummerMeetingWindow
              photos={TIMMY_PHOTOS}
              label="GAELFORCE · BUILDING TIMMY"
              noun="Timmy photo"
            />
          </div>

          <figure className="timmyVlog">
            <div className="timmyVlogBar">
              <span>GAELFORCE · OVERNIGHT BUILD</span>
              <span>Vlog</span>
            </div>
            <video
              controls
              playsInline
              preload="none"
              poster="/projects/galeforce/timmy/vlog-poster.jpg"
            >
              <source src="/projects/galeforce/timmy/vlog.mp4" type="video/mp4" />
            </video>
            <figcaption>A short vlog from building Timmy overnight.</figcaption>
          </figure>
        </div>

        {/* A new moment on the same timeline: the competition announcement. */}
        <div className="gaelForceSummerBlock">
          <div className="gaelForceSummerHeading">
            <span className="galeForceKicker">Meanwhile, during the build</span>
            <h3>The competition was announced. It&apos;s in Las Vegas.</h3>
          </div>

          <div className="gaelForceSummerDetails">
            <div className="gaelForceSummerCopy">
              <p>
                While we were building Timmy overnight, the competition was
                announced, and it&apos;s in Las Vegas.
              </p>
            </div>

            <figure className="timmyClip">
              <div className="timmyClipBar">
                <span>GAELFORCE · OUR REACTION</span>
                <span>Video</span>
              </div>
              <video
                controls
                playsInline
                preload="none"
                poster="/projects/galeforce/timmy/reaction-poster.jpg"
              >
                <source src="/projects/galeforce/timmy/reaction.mp4" type="video/mp4" />
              </video>
              <figcaption>Our reaction when the announcement came in.</figcaption>
            </figure>

            <figure className="timmyClip">
              <div className="timmyClipBar">
                <span>THE ANNOUNCEMENT</span>
                <a
                  href={`https://www.youtube.com/watch?v=${ANNOUNCEMENT_VIDEO_ID}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open on YouTube ↗
                </a>
              </div>
              <div className="timmyClipFrame">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${ANNOUNCEMENT_VIDEO_ID}?rel=0`}
                  title="The competition announcement"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </figure>
          </div>
        </div>

        {/* Next moment on the timeline: the info night. */}
        <div className="gaelForceSummerBlock">
          <div className="gaelForceSummerHeading">
            <span className="galeForceKicker">Then, the info night</span>
            <h3>60 people came to our info night.</h3>
          </div>

          <div className="gaelForceSummerDetails">
            <div className="gaelForceSummerCopy">
              <p>
                We took on two new members for the operations team, and we
                kept pushing our media and growing our presence on campus. We
                held an info night, and 60 people attended.
              </p>
              <p>
                In total we had 86 applications across all departments, and
                our once small team of 6 grew to 23.
              </p>
            </div>
          </div>
        </div>

        <div className="timmyPair">
          <figure className="timmyClip">
            <div className="timmyClipBar">
              <span>GAELFORCE · BEHIND THE REELS</span>
              <span>Photo</span>
            </div>
            <img
              src="/projects/galeforce/timmy/making-reel.jpg"
              alt="Four GaelForce members at a table covered in GaelForce flyers, with a multimeter and robot parts, making a reel"
              loading="lazy"
            />
            <figcaption>Making an iconic reel.</figcaption>
          </figure>

          <SocialPost
            network="linkedin"
            post={INFO_NIGHT_POST}
            height={760}
            caption="Our LinkedIn post about the info night."
          />
        </div>

        <dl className="timmyStats" aria-label="Recruitment results">
          <div>
            <dt>Info night</dt>
            <dd>60 attended</dd>
          </div>
          <div>
            <dt>Applications</dt>
            <dd>86 across all departments</dd>
          </div>
          <div>
            <dt>Team size</dt>
            <dd>6 → 23</dd>
          </div>
        </dl>

        {/* Next moment on the timeline: the VEX field and electronics arrive. */}
        <div className="gaelForceSummerBlock">
          <div className="gaelForceSummerHeading">
            <span className="galeForceKicker">Finally, the field</span>
            <h3>Our VEX field and electronics arrived.</h3>
          </div>

          <div className="gaelForceSummerDetails">
            <div className="gaelForceSummerCopy">
              <p>
                Our field and electronics from VEX finally arrived, and we
                built the field for the first time.
              </p>
            </div>

            <SummerMeetingWindow
              photos={FIELD_PHOTOS}
              label="GAELFORCE · THE FIELD"
              noun="field photo"
            />
          </div>
        </div>

        {INSTAGRAM_POSTS.length > 0 && (
          <div className="gaelForceLinkedInGrid timmyPosts">
            {INSTAGRAM_POSTS.map(({ post, caption }) => (
              <SocialPost
                key={post}
                network="instagram"
                post={post}
                caption={caption}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
