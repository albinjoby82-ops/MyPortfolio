'use client';

import CubiTapDemo from './CubiTapDemo';
import './CubiTapDemo.css';

function WebsitePreview() {
  return (
    <>
      <span className="cubiDemoWebsiteBrand">
        cubi<span className="cubiBrandDot" />
      </span>
      <p className="cubiDemoWebsiteEyebrow">Your product is live</p>
      <h3 className="cubiDemoWebsiteHeading">Everything people need, one tap away.</h3>
      <span className="cubiDemoWebsiteButton">Open site</span>
    </>
  );
}

function InstagramPreview() {
  return (
    <>
      <div className="cubiDemoInstagramHeader">
        <span className="cubiDemoInstagramAvatar" />
        <span className="cubiDemoInstagramHandle">yourbrand</span>
        <span className="cubiDemoInstagramFollow">Follow</span>
      </div>
      <div className="cubiDemoInstagramGrid">
        <span /><span /><span /><span /><span /><span />
      </div>
    </>
  );
}

export default function CubiPortal() {
  return (
    <section className="cubiPortfolioPortal gutter" aria-labelledby="cubi-portal-title">
      <div className="cubiPortfolioIntro">
        <span className="cubiPortfolioKicker">01 · How Cubi works</span>
        <h2 id="cubi-portal-title">A physical shortcut to anywhere online.</h2>
        <p>
          Each removable tile contains an NFC tag. A customer chooses what it
          opens, designs the surrounding product in the browser and receives a
          finished Cubi ready to use. No app and no camera: touch a phone to a
          tile and the right page opens.
        </p>
        <ol className="cubiPortfolioSteps">
          <li><span>01</span><strong>Choose a tile</strong></li>
          <li><span>02</span><strong>Tap with a phone</strong></li>
          <li><span>03</span><strong>Open the link</strong></li>
        </ol>
      </div>

      <div className="cubiSite cubiPortfolioDemoShell">
        <div className="cubiHeroStage">
          <CubiTapDemo
            boardText="Your brand. Your links."
            website={{
              notification: 'Opening your website…',
              url: 'yourbrand.ie',
              page: <WebsitePreview />,
            }}
            instagram={{
              notification: 'Opening your Instagram…',
              url: 'instagram.com',
              page: <InstagramPreview />,
            }}
          />
        </div>
        <p className="cubiPortfolioDemoHint">
          This is the original working demo from cubi-3d.com. Tap the phone or
          drag its top edge onto either tile.
        </p>
      </div>
    </section>
  );
}
