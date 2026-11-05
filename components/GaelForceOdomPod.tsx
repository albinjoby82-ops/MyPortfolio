import './GaelForceOdomPod.css';
import SummerMeetingWindow, { type FlickPhoto } from './SummerMeetingWindow';

const REPO = 'https://github.com/albinjoby82-ops/ODOM-Wirte-UP';
const gh = (path: string, kind: 'blob' | 'tree' = 'blob') =>
  `${REPO}/${kind}/HEAD/${path}`;
const IMG = '/projects/galeforce/odom';
const CAD_REPO =
  'https://github.com/albinjoby82-ops/claude-made-cad-files/tree/main/projects';
const V_POD_REPO = `${CAD_REPO}/2026-11-03-v-odom-pod`;
const LINEAR_POD_REPO = `${CAD_REPO}/2026-11-03-linear-odom-pods`;
const BRACE_REPO =
  'https://github.com/albinjoby82-ops/claude-made-cad-files/tree/main/projects/2026-10-31-odom-wheel-brace';

type Row = string[];

function Table({ head, rows }: { head: string[]; rows: Row[] }) {
  return (
    <div className="odomTableWrap">
      <table className="odomTable">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.join('|')}>
              {r.map((c, i) => (
                <td key={i}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Figure({
  src,
  alt,
  caption,
  href,
  className,
}: {
  src: string;
  alt: string;
  caption: string;
  href?: string;
  className?: string;
}) {
  const img = <img src={src} alt={alt} loading="lazy" />;
  return (
    <figure className={'odomFigure ' + (className ?? '')}>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer">
          {img}
        </a>
      ) : (
        img
      )}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function Details({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="odomDetails">
      <summary>{title}</summary>
      <div>{children}</div>
    </details>
  );
}

const PIN_MAP: Row[] = [
  ['Vertical encoder', 'A', '1'],
  ['Vertical encoder', 'B', '2'],
  ['Horizontal encoder', 'A', '4'],
  ['Horizontal encoder', 'B', '5'],
  ['IMU (BNO085, UART-RVC)', 'RX', '8'],
  ['RS-485', 'TX (DI)', '17'],
  ['RS-485', 'RX (RO)', '18'],
  ['RS-485', 'DE + RE (tied)', '21'],
  ['ToF I²C (all 4 sensors)', 'SDA', '15'],
  ['ToF I²C (all 4 sensors)', 'SCL', '16'],
  ['ToF enable', 'Front', '11'],
  ['ToF enable', 'Right', '12'],
  ['ToF enable', 'Rear', '14'],
  ['ToF enable', 'Left', '13'],
  ['Console UART', 'TX / RX', '43 / 44 (921600 baud)'],
];

const SETTINGS: Row[] = [
  ['Encoder resolution', '8192 counts per revolution (AMT102-V at 2048 PPR, all four edges counted)'],
  ['Encoder glitch filter', '1 µs'],
  ['Pod mounting', 'Diamond, 45°'],
  ['IMU link', '115200 baud, 19-byte frames'],
  ['Loop rate', '10 ms (100 Hz)'],
  ['ToF I²C speed', '100 kHz to set up, 400 kHz to run'],
  ['ToF ranging', '70 ms period, staggered 17 ms between sensors, custom 4-zone map'],
  ['Particle filter', '300 particles'],
  ['Pose report', '56 bytes from the pod, 23-byte status reply from the brain'],
];

const V1_PINS: Row[] = [
  ['Vertical encoder', 'A / B', '1 / 2'],
  ['Horizontal encoder', 'A / B', '3 / 4'],
  ['IMU (BNO085)', 'RX', '8'],
  ['RS-485', 'TX / RX / DE+RE', '17 / 18 / 21'],
  ['ToF I²C', 'SDA / SCL', '16 / 15'],
  ['ToF enable', 'Front / Right / Rear / Left', '11 / 12 / 14 / 13'],
];

const V2_PINS: Row[] = [
  ['Vertical encoder A', '1', '40', 'Encoders grouped on four adjacent header pins'],
  ['Vertical encoder B', '2', '42', ''],
  ['Horizontal encoder A', '3', '39', ''],
  ['Horizontal encoder B', '4', '41', ''],
  ['ToF enable, front', '11', '4', 'Uses a pin the encoders freed up'],
  ['ToF enable, rear', '14', '1', 'Uses a pin the encoders freed up'],
  ['ToF enable, left', '13', '2', 'Uses a pin the encoders freed up'],
  ['RS-485 DE/RE', '21', '7', 'Nearest free pin that is not a strapping pin'],
];

const LINK_PHOTOS: FlickPhoto[] = [
  {
    src: `${IMG}/05-link-bad.jpg`,
    alt: 'The V5 brain screen showing X, Y and H all at 0.0 and LINK: BAD',
  },
  {
    src: `${IMG}/05-link-brain-screen-land.jpg`,
    alt: 'The V5 brain screen showing the gaelforce program',
  },
  {
    src: `${IMG}/05-link-debugging-land.jpg`,
    alt: 'Two people debugging the pod wiring with a multimeter',
  },
];

export default function GaelForceOdomPod() {
  return (
    <section className="odomPod gutter" aria-labelledby="odom-pod-title">
      <div className="odomInner">
        {/* ── Intro ───────────────────────────────────────────── */}
        <div className="odomIntro">
          <div>
            <span className="galeForceKicker">The ODOM POD</span>
            <h2 id="odom-pod-title">
              The V5 is a good motor controller and a poor sensor platform.
            </h2>
          </div>

          <div className="odomCopy">
            <p>
              The ODOM POD is an ESP32-S3 odometry and localization pod. It
              reads the sensors the V5 brain can&apos;t, works out where the
              robot is, and sends that pose to the brain over an RS-485 link.
              Motion control stays on the V5. The pod is a pose source and
              never touches a motor command.
            </p>
            <p>
              This page starts at the breadboard that worked, then goes to a
              first PCB that taught us something, a second PCB that needed a
              few hand fixes but now works, and the pods for the drivetrain.
              Why I chose each part is in the full write-up on GitHub, along
              with the design files, Gerbers and firmware.
            </p>
            <div className="odomLinks">
              <a href={REPO} target="_blank" rel="noreferrer">
                Full write-up on GitHub ↗
              </a>
              <a href={gh('hardware', 'tree')} target="_blank" rel="noreferrer">
                Design files &amp; Gerbers ↗
              </a>
              <a href={gh('code', 'tree')} target="_blank" rel="noreferrer">
                Firmware ↗
              </a>
            </div>
          </div>
        </div>

        <div className="odomTracks" aria-label="How the pod is split">
          <div>
            <span>Sensing</span>
            <strong>ESP32-S3 pod</strong>
          </div>
          <div>
            <span>The link</span>
            <strong>RS-485 · pose only</strong>
          </div>
          <div>
            <span>Motion control</span>
            <strong>Stays on the V5</strong>
          </div>
        </div>

        {/* ── 1. Breadboard ───────────────────────────────────── */}
        <div className="odomChapter">
          <div className="odomChapterHead">
            <span className="odomNo">Part 1</span>
            <h3>What we built on the breadboard</h3>
          </div>

          <div className="odomSplit">
            <Figure
              className="odomTall"
              src={`${IMG}/02-breadboard-photo.jpg`}
              alt="The breadboard: an ESP32-S3 dev board in the centre, a level converter and the BNO085 across the top, and ToF sensors on Qwiic cables off the right edge"
              caption="The breadboard build. The ToF sensors sit off the board on their Qwiic cables."
            />
            <div className="odomCopy">
              <p>
                When the parts arrived, we wired every component from the{' '}
                <a href={REPO} target="_blank" rel="noreferrer">
                  write-up
                </a>{' '}
                onto a breadboard and flashed one firmware image to the
                ESP32-S3.
              </p>
              <p>
                The firmware reads the two AMT102-V encoders (through the
                level converter), the BNO085 IMU, and the four TMF8821 ToF
                sensors. It runs a 300-particle Monte Carlo localization
                filter and sends the resulting pose to the V5 brain over
                RS-485 every 10 ms (100 Hz). The brain replies with its
                status, and the pod uses that reply to measure round-trip time
                and to stop trusting ToF readings while the robot is driving
                hard. Everything runs in a single task, and the firmware
                prints its own timing, link and per-sensor diagnostics about
                once a second.
              </p>
              <p>
                It differs from the design intent in the write-up in three ways: one
                task at 100 Hz instead of the two-core split, PSRAM left off,
                and one median distance per ToF sensor going to the filter
                instead of a distance-and-angle pair.
              </p>
            </div>
          </div>

          <h4 className="odomSub">Circuit diagrams</h4>
          <p className="odomLead">
            The breadboard was wired from these four diagrams.
          </p>
          <div className="odomGrid2">
            <Figure
              src={`${IMG}/02-encoder-wiring.jpg`}
              alt="Two AMT102-V encoders into an SN74LVC245A level converter, through 33 ohm resistors, to four ESP32-S3 GPIOs"
              caption="Encoders. The 5 V outputs go through the SN74LVC245A to 3.3 V logic, with a 33 Ω resistor in each line. The encoders get their 5 V from the robot rail, not from the level converter. Unused B5–B8 inputs are tied to ground, and OE is tied low."
            />
            <Figure
              src={`${IMG}/02-imu-wiring.jpg`}
              alt="BNO085 in UART-RVC mode wired to ESP32-S3 GPIO 8, with its mode pins tied off"
              caption="IMU. One data wire from the BNO085 to GPIO 8, plus power and ground. P0 selects RVC mode, so it is tied to 3.3 V or bridged with the solder jumper on the back of the Adafruit breakout. The mode pins are only read at reset, so the BNO085 has to be power-cycled, not just the ESP32."
            />
            <Figure
              src={`${IMG}/02-tof-chain.jpg`}
              alt="Four TMF8821 sensors daisy-chained over Qwiic from the ESP32-S3, each with its own enable line"
              caption="ToF sensors. Four TMF8821s on one Qwiic chain, each with its own enable wire. All four boot at 0x41, so they are enabled one at a time and given new addresses (0x42 front, 0x43 right, 0x44 rear, 0x45 left). The enable pin is not on the Qwiic connector, so one wire is soldered to each sensor’s EN pad. I²C pull-ups are left on for one board only."
            />
            <Figure
              src={`${IMG}/02-rs485-wiring.jpg`}
              alt="ESP32-S3 to SP3485 transceiver to the V5 smart port, with board notes on termination and bias"
              caption="RS-485 link. The ESP32’s UART drives an SP3485 transceiver, which connects to the V5 smart port’s two differential lines. The 5 V line on the smart port is not connected, but the cable ground is, because RS-485 needs the common reference."
            />
          </div>

          <div className="odomVideo">
            <video
              controls
              playsInline
              preload="none"
              poster={`${IMG}/02-breadboard-bringup-thumb.jpg`}
            >
              <source src={`${IMG}/02-breadboard-bringup.mp4`} type="video/mp4" />
            </video>
            <p>
              Working on it. A 5-second clip of the breadboard being worked
              on, with the firmware&apos;s console output on the laptop. All
              four ToF sensors worked on the breadboard with this firmware.
            </p>
          </div>

          <Details title="Breadboard pin map">
            <Table head={['Function', 'Signal', 'GPIO']} rows={PIN_MAP} />
            <ul className="odomNotes">
              <li>The SP3485 has DE and RE tied together and driven as the UART&apos;s RTS pin, so the hardware handles the send/receive turnaround.</li>
              <li>The BNO085 is receive-only. Its P0 jumper must be bridged to select UART-RVC mode, otherwise it starts in I²C mode and the RX pin stays silent.</li>
              <li>The ToF enable pins are in harness order, not numeric order.</li>
              <li>GPIO 0/45/46, 19/20, 26–37 and 48 are not used on this module (strapping, USB, flash, PSRAM and the on-board LED).</li>
            </ul>
          </Details>

          <Details title="Key firmware settings">
            <Table head={['Setting', 'Value']} rows={SETTINGS} />
          </Details>

          <p className="odomSource">
            The firmware is Ronan Hawkins&apos; <code>gaelforce_esp32</code> at
            commit <code>f9613c0</code>. A copy is in the write-up repo at{' '}
            <a href={gh('code/breadboard', 'tree')} target="_blank" rel="noreferrer">
              code/breadboard ↗
            </a>
            . Build it with PlatformIO (ESP-IDF) for the ESP32-S3-DevKitC-1
            with the N8R8 module.
          </p>
        </div>

        {/* ── 2. PCB V1 ───────────────────────────────────────── */}
        <div className="odomChapter">
          <div className="odomChapterHead">
            <span className="odomNo">Part 2</span>
            <h3>PCB V1</h3>
          </div>

          <div className="odomCopy odomWide">
            <h4>The idea</h4>
            <p>
              The breadboard worked, so the first PCB was a direct copy of it:
              the same schematic, the same parts and the same connections, laid
              out on a board. The schematic and the PCB were designed in KiCad,
              the board was made in the Elecworkshop, and the parts were
              soldered on.
            </p>
          </div>

          <div className="odomGrid2 odomPhotos">
            <Figure
              src={`${IMG}/03-pcb-v1-printed.jpg`}
              alt="The bare V1 board after it was made, copper side, with the pin labels printed mirrored"
              caption="The bare V1 board, copper side."
            />
            <Figure
              className="odomTall"
              src={`${IMG}/03-pcb-v1-soldering.jpg`}
              alt="Soldering parts onto the V1 board at a workbench with a microscope, solder and wire cutters"
              caption="Soldering the V1 board."
            />
          </div>

          <div className="odomCallouts">
            <div className="odomCallout odomBad">
              <span>What went wrong</span>
              <p>
                On a breadboard, any signal can go to any pin, because you just
                plug in a jumper wire. On a PCB that freedom is gone, and the
                wiring that matters is the wiring that leaves the board. Both
                encoders and all four ToF sensors connect to the pod by cables,
                so every one of those cables had to leave the board somewhere.
              </p>
              <p>
                The pin assignments came straight from the breadboard, where
                they had been chosen for convenience, so on the PCB they ended
                up scattered across the ESP32&apos;s headers. The cables coming
                off the board for the encoders and the ToF sensors were a
                tangled mess. Copying the breadboard exactly turned out not to
                be the right way to get a PCB. A good layout starts from where
                the connectors and cables go, and picks the pins to suit.
              </p>
            </div>
            <div className="odomCallout odomGood">
              <span>What worked</span>
              <p>
                The board worked. The ToF sensors and the rest of the pod ran
                the V1 firmware. There was one layout mistake: the ground trace
                for the IMU was on the top layer when it should have been on
                the bottom. V2 fixes it.
              </p>
              <span>What it taught us</span>
              <p>
                The problem was never the parts or the schematic. It was the
                pin layout. That led to V2, which starts from where the cables
                leave the board and groups the pins to match.
              </p>
            </div>
          </div>

          <h4 className="odomSub">Design files</h4>
          <div className="odomGrid2">
            <Figure
              src={`${IMG}/03-pcb-v1-3d.png`}
              alt="A 3D render of the V1 board from KiCad: the ESP32-S3 dev board footprint on the left, the IMU breakout at the top right, the level converter and four resistors in the middle, and single-pin connectors around the edges"
              caption="A 3D render of the V1 board from KiCad. The ESP32-S3 dev board sits on the left, the IMU breakout at the top right, and the level converter and the four series resistors in the middle. The single-pin connectors are scattered around the edges and the corners."
            />
            <Figure
              src={`${IMG}/03-pcb-v1-layout.png`}
              href={gh('hardware/v1/ODOM-V1-pcb-layout.pdf')}
              alt="The V1 board layout in KiCad, front copper in red and back copper in blue, with traces from the ESP32-S3 pins running out to single-pin connectors around the edges"
              caption="The V1 layout from the KiCad PCB editor. Front copper is red and back copper is blue. The traces fan out from the ESP32-S3’s pins to the single-pin connectors around the edges. Click for the PDF on GitHub."
            />
          </div>
          <Figure
            className="odomWideFig"
            src={`${IMG}/03-pcb-v1-schematic.png`}
            href={gh('hardware/v1/ODOM-V1-schematic.pdf')}
            alt="The V1 schematic: the ESP32-S3 dev board, a level converter with series resistors on the four encoder lines, the IMU breakout, and single-pin connectors for the off-board wires"
            caption="The V1 schematic: the ESP32-S3 dev board, the level converter with series resistors on the four encoder lines, the IMU breakout, and a single-pin connector for each off-board wire. Click for the PDF on GitHub."
          />

          <Details title="V1 firmware and pin map">
            <p>
              Ronan Hawkins wrote all of the V1 firmware: his{' '}
              <code>gaelforce_esp32</code> at commit <code>f138950</code>{' '}
              (Sep 30, &ldquo;pin changes&rdquo;). It differs from the breadboard firmware in the pin numbers only.
              Two signals moved: the horizontal encoder from GPIO 4/5 to 3/4,
              and the ToF I²C pins from SDA/SCL 15/16 to 16/15.
            </p>
            <Table head={['Function', 'Signal', 'GPIO']} rows={V1_PINS} />
          </Details>

          <p className="odomSource">
            Download the{' '}
            <a href={gh('hardware/v1/ODOM-V1-schematic.pdf')} target="_blank" rel="noreferrer">schematic</a>,{' '}
            <a href={gh('hardware/v1/ODOM-V1-pcb-layout.pdf')} target="_blank" rel="noreferrer">PCB layout</a>,{' '}
            <a href={gh('hardware/v1/gerbers.zip')} target="_blank" rel="noreferrer">Gerbers</a> and the{' '}
            <a href={gh('hardware/v1', 'tree')} target="_blank" rel="noreferrer">KiCad project</a> from GitHub.
          </p>
        </div>

        {/* ── 3. PCB V2 ───────────────────────────────────────── */}
        <div className="odomChapter">
          <div className="odomChapterHead">
            <span className="odomNo">Part 3</span>
            <h3>PCB V2</h3>
            <span className="odomStatus">Tested · fixed by hand</span>
          </div>

          <div className="odomCopy odomWide">
            <p>
              V2 was meant to fix what went wrong with V1. It has two changes:
              an IMU ground fix, and a pin map that follows where the cables
              leave the board. It needed a few hand fixes after testing, but we
              ended up with a working V2, so the next step is testing the MCL
              firmware on it.
            </p>
          </div>

          <div className="odomThree odomTwo">
            <div>
              <span>The IMU ground</span>
              <p>
                On V1, the ground trace for the IMU was on the top layer when
                it should have been on the bottom. V2 was meant to put it on the
                bottom layer, but the ground doesn&apos;t exist on the built
                board, so I fixed it by soldering.
              </p>
            </div>
            <div>
              <span>The pins</span>
              <p>
                V1 kept the breadboard&apos;s pin numbers, which left the
                encoder and ToF cables scattered around the board. V2
                regroups the pins so each set of cables leaves from one place.
                Eight pins moved. Everything else is the same.
              </p>
            </div>
          </div>

          <Table
            head={['Signal', 'V1 GPIO', 'V2 GPIO', 'Why']}
            rows={V2_PINS}
          />

          <div className="odomCopy odomWide">
            <p>
              These stay the same: the IMU receive pin on GPIO 8, RS-485 TX and
              RX on 17 and 18, I²C SDA and SCL on 16 and 15, and the right ToF
              enable on 12. The level converter&apos;s B pins are also wired to
              make the cabling easier: B1 and B2 carry the encoders&apos; B
              channels, and B3 and B4 carry their A channels. If an encoder
              counts backwards, the firmware has a reverse flag for each one,
              so the wiring does not need to change.
            </p>
            <h4>The V2 firmware</h4>
            <p>
              The V2 firmware is Ronan&apos;s V1 code with my changes on top,
              at commit <code>986a2f3</code>. I made the V2 pin changes, fixed
              the order the ToF mask is downloaded in, and added a ToF bench
              test. V1 and V2 firmware are not interchangeable: GPIO 1, 2 and 4 were
              encoder inputs on V1 and are ToF enable outputs on V2, so
              flashing the wrong firmware drives the wrong wire.
            </p>
          </div>

          <h4 className="odomSub">Status</h4>
          <div className="odomGrid2 odomPhotos">
            <Figure
              className="odomTall"
              src={`${IMG}/04-pcb-v2-board.jpg`}
              alt="The bare V2 board, a tall narrow green board with white copper traces and silkscreen labels such as 5V, GND, B4 and B3 along the bottom"
              caption="The V2 board right after it came off the machine at the Elecworkshop."
            />
            <Figure
              src={`${IMG}/04-pcb-v2-soldering.jpg`}
              alt="Two people soldering parts onto a V2 board held on a breadboard strip, one holding a part in place and the other using a soldering iron"
              caption="Soldering the V2 board with Selma."
            />
          </div>

          <h4 className="odomSub">Design files</h4>
          <div className="odomGrid2">
            <Figure
              src={`${IMG}/04-pcb-v2-3d.png`}
              alt="A 3D render of the V2 board from KiCad: a tall green board with the IMU breakout outline at the top, the ESP32-S3 outline in the middle, four resistors and the level converter below it, and rows of single-pin connectors at the bottom and along the sides"
              caption="A 3D render of the V2 board from KiCad. The board is long and narrow. The IMU breakout is at the top, the ESP32-S3 is in the middle, and the four resistors and the level converter are below it. The ESP32-S3 and the IMU show only as outlines, because their 3D models are not in the project."
            />
            <Figure
              className="odomTall odomContain"
              src={`${IMG}/04-pcb-v2-layout.png`}
              href={gh('hardware/v2/ODOM-V2-pcb-layout.pdf')}
              alt="The V2 board layout in KiCad, front copper in red and back copper in blue, with traces running from the ESP32-S3 pins to single-pin connectors at the bottom and along the sides"
              caption="The V2 layout from the KiCad PCB editor. Front copper is red and back copper is blue. Traces run from the ESP32-S3 pins and the level converter to the single-pin connectors at the bottom and along the sides. Click for the PDF on GitHub."
            />
          </div>
          <Figure
            className="odomWideFig"
            src={`${IMG}/04-pcb-v2-schematic.png`}
            href={gh('hardware/v2/ODOM-V2-schematic.pdf')}
            alt="The V2 schematic: the ESP32-S3 dev board, the IMU breakout, the level converter with four resistors, and a column of single-pin connectors on the right"
            caption="The V2 schematic: the ESP32-S3 dev board, the IMU breakout, the level converter and four resistors, and a single-pin connector for each off-board wire. Click for the PDF on GitHub."
          />

          <p className="odomSource">
            Download the{' '}
            <a href={gh('hardware/v2/ODOM-V2-schematic.pdf')} target="_blank" rel="noreferrer">schematic</a>,{' '}
            <a href={gh('hardware/v2/ODOM-V2-pcb-layout.pdf')} target="_blank" rel="noreferrer">PCB layout</a>,{' '}
            <a href={gh('hardware/v2/gerbers.zip')} target="_blank" rel="noreferrer">Gerbers</a> and the{' '}
            <a href={gh('hardware/v2', 'tree')} target="_blank" rel="noreferrer">KiCad project</a> from GitHub.
          </p>

          <p className="odomSource">
            Every pin move with its reason is in{' '}
            <a href={gh('code/pcb-v2/PIN_CHANGES.md')} target="_blank" rel="noreferrer">PIN_CHANGES.md ↗</a>
            , and the V2 wiring tables are in the{' '}
            <a href={gh('code/pcb-v2/README.md')} target="_blank" rel="noreferrer">firmware README ↗</a>
            . The{' '}
            <a href={gh('docs', 'tree')} target="_blank" rel="noreferrer">full write-up ↗</a>{' '}
            is on GitHub.
          </p>
        </div>

        {/* ── 4. The link to the brain ────────────────────────── */}
        <div className="odomChapter">
          <div className="odomChapterHead">
            <span className="odomNo">Part 4</span>
            <h3>The link to the brain</h3>
            <span className="odomStatus">Working</span>
          </div>

          <div className="odomCopy odomWide">
            <p>
              Once the PCB was working with the ESP32, Ronan and I started on
              the link between the pod and the V5 brain. It needed connecting
              up, and once it was, the brain could read the pod&apos;s data.
            </p>
          </div>

          <div className="mt-6 max-w-[680px]">
            <SummerMeetingWindow
              photos={LINK_PHOTOS}
              label="ODOM POD · THE LINK"
              noun="link photo"
            />
          </div>
        </div>

        {/* ── 5. On the drivetrain ────────────────────────────── */}
        <div className="odomChapter">
          <div className="odomChapterHead">
            <span className="odomNo">Part 5</span>
            <h3>On the drivetrain</h3>
            <span className="odomStatus">Waiting for the field</span>
          </div>

          <div className="odomCopy odomWide">
            <p>
              The next step is testing MCL on the real drivetrain, out on the
              field. For that I designed and 3D printed the odom pods. They
              are printed and we are waiting for a slot to test them on the
              field.
            </p>
            <p>
              For the small drivetrain I also made a test brace. It holds two
              2.75&Prime; tracking wheels at 90&deg; to each other, one for
              each direction, between the drivetrain&apos;s C-channels and the
              motors, with an encoder mount built in for each wheel. It is only
              there so we can test MCL. It is not the final one.
            </p>
            <div className="odomLinks">
              <a href={BRACE_REPO} target="_blank" rel="noreferrer">
                Brace CAD and design process ↗
              </a>
            </div>
          </div>

          <div className="odomGrid2">
            <Figure
              src={`${IMG}/06-odom-brace-onshape-1.png`}
              href={BRACE_REPO}
              alt="An Onshape screenshot of the test brace: a light T-shaped brace between four black motors and two C-channels, with an omni wheel under the arm"
              caption="The test brace between the motors on the small drivetrain, in Onshape."
            />
            <Figure
              src={`${IMG}/06-odom-brace-onshape-2.png`}
              href={BRACE_REPO}
              alt="The same Onshape assembly of the test brace from another angle"
              caption="The same assembly from another angle."
            />
          </div>

          <div className="odomCopy odomWide">
            <h4>Two designs for the big bot</h4>
            <p>
              The big bot is a different drivetrain, with a CNC&apos;d
              baseplate, so it needs its own pods. I have two designs for it,
              plus a newer version further down. The first two are CAD only so
              far and neither is printed.
            </p>
          </div>

          <div className="odomGrid2">
            <Figure
              src={`${IMG}/07-v-odom-pod-onshape.png`}
              href={V_POD_REPO}
              alt="An Onshape screenshot of the V odom pod: two omni wheels in a V under a flat plate, each with its own housing and a bar across the top"
              caption="The V pod. Two 2.75″ wheels in a 90° V, each on its own spring-loaded swing arm, bolted on top of the baseplate with the wheels dropping through slots in it. This was the first idea, and the linear pods replaced it."
            />
            <Figure
              src={`${IMG}/07-linear-odom-pods-onshape.png`}
              href={LINEAR_POD_REPO}
              alt="An Onshape screenshot of a linear odom pod: a blue carriage inside a frame with a cap, with an omni wheel dropping through the plate and a spring at the axle"
              caption="The linear pods. Two separate single-wheel pods, placed at 90° to each other wherever there is room. Each wheel is on a carriage that slides on two sprung rails printed into the frame, so the spring force goes straight down instead of through a hinge."
            />
          </div>

          <p className="odomSource">
            CAD and design process for the{' '}
            <a href={V_POD_REPO} target="_blank" rel="noreferrer">V pod ↗</a>{' '}
            and the{' '}
            <a href={LINEAR_POD_REPO} target="_blank" rel="noreferrer">linear pods ↗</a>.
          </p>

          <div className="odomCopy odomWide">
            <h4>Another version</h4>
            <p>
              I have since made another version of the pod. It keeps one
              wheel per pod, but the wheel now sits in a window in a flat
              orange arm, with a vertical guide post at each end of the arm
              and a base flange under each end that bolts down.
            </p>
          </div>

          <Figure
            className="odomWideFig"
            src={`${IMG}/08-odom-pod-another-version-onshape.jpg`}
            alt="An Onshape screenshot of another odom pod version: a 2.75 inch omni wheel in a window in a flat orange arm, with a vertical guide post and cap at each end of the arm and a light blue base flange with screw holes under each end"
            caption="The other version of the pod, in Onshape. The omni wheel sits in a window in the orange arm, with a guide post and cap at each end, and a blue base flange under each end."
          />
        </div>
      </div>
    </section>
  );
}
