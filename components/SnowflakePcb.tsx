import './GaelForceOdomPod.css';

const IMG = '/projects/pcb/snowflake';
const REPO =
  'https://github.com/ENGARCH-Design-Challenge/26-27_Challange/tree/main/samples/snowflake';

function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="odomFigure">
      <img src={src} alt={alt} loading="lazy" />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export default function SnowflakePcb() {
  return (
    <section className="odomPod gutter" aria-label="Snowflake PCB">
      <div className="odomInner">
        <div className="odomCopy odomWide">
          <p>
            A super simple snowflake-shaped PCB, designed in KiCad. It runs
            from 5 V and has six 3 mm through-hole LEDs, each with its own
            through-hole resistor, plus two plated-hole pads for 5 V and
            ground. Everything is through-hole, so it is a good one to solder
            as a beginner.
          </p>
          <div className="odomLinks">
            <a href={REPO} target="_blank" rel="noreferrer">
              Design files &amp; write-up on GitHub ↗
            </a>
          </div>
        </div>

        <div className="odomGrid2">
          <Figure
            src={`${IMG}/snowflake-3d.png`}
            alt="A 3D render of the snowflake PCB from KiCad: a dark green snowflake-shaped board with six red LEDs on its arms, each next to a resistor, and two plated holes in the centre"
            caption="A 3D render of the board from KiCad."
          />
          <Figure
            src={`${IMG}/snowflake-layout.png`}
            alt="The snowflake PCB layout in KiCad, with 5 V traces in red and ground traces in blue running out to six LEDs and their resistors"
            caption="The layout. 5 V traces are red and ground traces are blue."
          />
        </div>

        <Figure
          src={`${IMG}/snowflake-schematic.png`}
          alt="The snowflake schematic: six LEDs, each in series with its own resistor, between 5 V and ground"
          caption="The schematic."
        />
      </div>
    </section>
  );
}
