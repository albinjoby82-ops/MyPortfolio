import './MicromousePortal.css';

const EVENT_URL = 'https://hackclub.ucdelecsoc.com/micromouse?nav=2';

export default function MicromousePortal() {
  return (
    <section className="mmPortalSection gutter" aria-labelledby="mm-portal-title">
      <div className="mmPortalInner">
        <span className="eyebrow">01 · The event</span>
        <div className="mmPortalIntro">
          <h2 id="mm-portal-title">First, a look at what I was organising.</h2>
          <p>Explore the event website below for the competition details.
            The journal that follows is my account of putting it together.</p>
        </div>
        <div className="mmPortalWindow">
          <div className="mmPortalBar">
            <span>Dublin Micromouse Open · Event website</span>
            <a href={EVENT_URL} target="_blank" rel="noreferrer">Open website ↗</a>
          </div>
          <iframe src={EVENT_URL} title="Dublin Micromouse Open event website" loading="lazy" allowFullScreen />
        </div>
        {/* Journal entries will follow as Albin supplies them. */}
      </div>
    </section>
  );
}
