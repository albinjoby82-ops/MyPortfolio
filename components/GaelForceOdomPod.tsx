import './GaelForceOdomPod.css';

const REPO = 'https://github.com/albinjoby82-ops/ODOM-Wirte-UP';
const gh = (path: string, kind: 'blob' | 'tree' = 'blob') =>
  `${REPO}/${kind}/HEAD/${path}`;
const IMG = '/projects/galeforce/odom';

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

const COMPONENTS: { tag: string; title: string; body: string[] }[] = [
  {
    tag: 'Brain',
    title: 'ESP32-S3',
    body: [
      'The S3 has hardware quadrature decoding (PCNT) and two cores that map directly onto the I/O and math split the design needs. It also brings three UARTs (console, BNO085, RS-485), ESP-IDF/FreeRTOS, and comes as a cheap, compact module with no exotic sourcing. The N8R8 module has 8 MB of PSRAM, but the build leaves it off: the particle filter is only about 19 KB and runs faster in internal SRAM.',
      'The alternatives were rejected for concrete reasons. A Raspberry Pi has scheduler jitter and no hardware quadrature decoder. An AVR Arduino counts on interrupts, does software float and has too little RAM. A Teensy 4.1 has a genuinely better encoder peripheral, but it is single-core and a costly rewrite for a problem that is not currently compute-bound. The RT1170 is best on paper, but there is no board suitable for a competition robot. The ESP32-P4 is the upgrade path if compute ever does become the limit.',
      'Two liabilities need to stay visible. PCNT is 16-bit, so it wraps roughly every 4 revolutions at 8192 CPR, which means the overflow ISR has to be high-priority and sanity-checked. And there is no double-precision FPU, so accidental doubles in the math path are a real failure mode, not a style nitpick.',
    ],
  },
  {
    tag: 'Odometry',
    title: '2× AMT102-V encoders',
    body: [
      'These give 8192 CPR (2048 PPR × 4), which on a 2.75" wheel works out to roughly 0.027 mm per count, against 0.054 mm for the V5 Rotation Sensor and 0.61 mm for the ADI optical encoder.',
      'But resolution is not actually the win. Both smart-sensor options already sit far below the real error floor of the system, so squeezing more counts out of them would not move the needle. The real win is zero transport delay versus smart-port polling, and that only exists because the encoders go through the ESP32. Wired into ADI ports instead, they would have to be throttled to 96 PPR, which throws away the entire reason for buying them.',
      'The trade-off worth naming: these are incremental encoders, with no absolute position across power cycles. That is fine here, because pose is seeded with SET_POSE at the start rather than recovered from the encoders. Their 5 V outputs go through an SN74LVC245 buffer down to 3.3 V logic. The physical setup is two-pod diamond odometry, with heading supplied separately by the IMU.',
    ],
  },
  {
    tag: 'Heading',
    title: 'BNO085 IMU, UART-RVC mode',
    body: [
      'The deciding factor is bias handling under this robot’s usage pattern. The BNO085’s SH-2 firmware re-estimates gyro bias whenever the robot is stationary, and this robot stops every couple of seconds, so it gets frequent bias refreshes for free. The V5’s own IMU calibrates once at init and then runs open-loop as it warms up. Since heading error couples directly into position error, that matters more than raw sensor specs.',
      'Timing tells the same story: the BNO085 free-runs at 100 Hz and the ESP32 timestamps every frame, versus a polled V5 IMU whose jitter is never observable from outside. It also holds up under hard impacts in a way the V5 IMU does not.',
      'RVC mode was chosen because it sends unsolicited 19-byte frames at 115200 baud with no host protocol overhead, and because it does not share the I²C bus with the ToF sensors, which keeps the IMU’s timing independent of whatever the ToF chain is doing. Two wiring details are deliberate: PS0 is tied to the rail via the breakout’s own solder jumper rather than a GPIO, to avoid a power-sequencing race, and RST goes to GPIO 38 so firmware can re-latch the mode if needed.',
      'Two parts were rejected on paper, not in practice. The ICM-42688-P and ADIS16505 both have better raw bias stability, but neither has onboard sensor fusion. Given how often this robot stops, the plan is to keep the BNO085 and add zero-velocity updates (ZUPTs) on top, rather than chase raw IMU specs that matter less for this usage pattern.',
    ],
  },
  {
    tag: 'Ground truth',
    title: '4× TMF8821 ToF sensors',
    body: [
      'These exist to bound odometry drift by giving the particle filter absolute corrections. Odometry alone only ever gets worse over time, and something has to anchor it back to the field.',
      'Multizone sensing matters because a single TMF8821 yields both perpendicular distance and wall angle from one reading. That angle constrains heading directly, which is what is needed to hit the ±2° target, but only if the zones are pre-processed into a (distance, angle) pair before they reach the filter. Feeding raw zones in as independent measurements breaks the math.',
      'One sensor faces each direction (front, right, rear, left), so some wall is visible from almost anywhere on the field, and they are staggered at 90° phase offsets to smooth corrections over time and spread CPU load. They are at their best near walls at close to normal incidence, which is exactly where Gate 2 is measured. They have no moving parts to take hits, and each reading is a single snapshot with no scan skew to correct for.',
      'The known weaknesses are real: each zone covers roughly 10°, so readings start blending in clutter at range; readings are biased at oblique angles; and the sensor only delivers about 15 Hz in 4×4 mode. A 2D lidar (LD06 or STL-27L) is the fallback, but only if the characterization matrix actually fails.',
    ],
  },
  {
    tag: 'Link',
    title: 'RS-485 to the V5',
    body: [
      'The smart port is physically RS-485 under the hood, so the ESP32 side uses an SP3485 half-duplex transceiver with hardware DE/RE control to match. The brain stays bus master throughout, using request/response framing to avoid bus contention.',
      'The link runs at 230400 baud rather than the 460800 the latency analysis assumed, because the V5’s oscillator carries roughly 1.5% error at 460800 against a 2–3% total error budget, which is not enough margin to run that fast safely. kLinkBaud lives in link.hpp as the single source of truth. The latency numbers quoted above were measured at 460800 and still need re-running at 230400.',
    ],
  },
];

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

export default function GaelForceOdomPod() {
  return (
    <section className="odomPod gutter" aria-labelledby="odom-pod-title">
      <div className="odomInner">
        {/* ── Intro ───────────────────────────────────────────── */}
        <div className="odomIntro">
          <div>
            <span className="galeForceKicker">05 · The ODOM POD</span>
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
              This is the whole story so far, from choosing the parts, to a
              breadboard that worked, to a first PCB that taught us something,
              to a second PCB that has now been made and soldered. The design files,
              Gerbers, firmware and the original write-up live on GitHub.
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

        {/* ── 1. Components ───────────────────────────────────── */}
        <div className="odomChapter">
          <div className="odomChapterHead">
            <span className="odomNo">Part 1</span>
            <h3>Why these components</h3>
          </div>

          <div className="odomCopy odomWide">
            <h4>Sensing on an ESP32-S3, motion control on the V5</h4>
            <p>
              Every choice in this pod traces back to one split. The V5
              can&apos;t host these sensors well. Smart ports run a closed
              RS-485 protocol, the brain exposes no user I²C, SPI or UART for
              a BNO085 or TMF8821s, and the ADI 3-wire quadrature path was
              designed around 360 CPR encoders and drops counts once
              you&apos;re running 8192 CPR. Even where the brain can read a
              sensor, smart-port devices are polled on the same bus as motor
              commands, with a 10 ms default and a 5 ms floor, so the data a
              controller sees is stale and jittery by the time it arrives. On
              the ESP32, an encoder read is a direct register access, the IMU
              is a timestamped 100 Hz stream, and dt is known exactly rather
              than inferred.
            </p>
            <p>
              That precision needs somewhere to run without interference. Core
              0 handles all I/O; Core 1 runs the math, including 200 Hz MCL
              prediction, with nothing from the PROS scheduler competing for
              cycles. That two-core split is the design intent. The first
              breadboard build runs everything in one task at 100 Hz, which was
              enough to prove the sensors and the link.
            </p>
            <p>
              None of this makes the V5 obsolete as a pose source. It never was
              one. The brain carries no IMU and no tracking encoders of its
              own. LinkPoseSource is its only pose source, and the custom PROS
              motion code consumes it through IPoseSource, which is why
              runMotion gates on healthy(), staleness and bootId: it has to
              assume the link can go bad. Motion control itself stays on the
              V5 for two reasons that aren&apos;t up for debate. Motors must be
              VEX, and you never put a network link inside a feedback loop.
            </p>
            <p>
              It&apos;s worth being honest about what this buys. End-to-end
              latency over the link is roughly at parity with reading native
              V5 sensors over the smart port (about 13 ms mean and 26 ms tail
              in the 460800 baud, 200 Hz analysis). The real advantage
              isn&apos;t speed, it&apos;s determinism: synchronous sampling,
              timestampable delay, and access to sensors the brain physically
              cannot read. And it&apos;s legal, because VUR12 explicitly
              allows external electronics and non-VEX sensors.
            </p>
          </div>

          <div className="odomCards">
            {COMPONENTS.map((c) => (
              <article key={c.title} className="odomCard">
                <span>{c.tag}</span>
                <h4>{c.title}</h4>
                {c.body.map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
              </article>
            ))}
          </div>
        </div>

        {/* ── 2. Breadboard ───────────────────────────────────── */}
        <div className="odomChapter">
          <div className="odomChapterHead">
            <span className="odomNo">Part 2</span>
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
                When the parts arrived, we wired every component from Part 1
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
                It differs from the design intent in Part 1 in three ways: one
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

        {/* ── 3. PCB V1 ───────────────────────────────────────── */}
        <div className="odomChapter">
          <div className="odomChapterHead">
            <span className="odomNo">Part 3</span>
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

        {/* ── 4. PCB V2 ───────────────────────────────────────── */}
        <div className="odomChapter">
          <div className="odomChapterHead">
            <span className="odomNo">Part 4</span>
            <h3>PCB V2</h3>
            <span className="odomStatus">Made and soldered · awaiting tests</span>
          </div>

          <div className="odomCopy odomWide">
            <p>
              V2 fixes what went wrong with V1. It has two changes: a fixed
              IMU ground, and a pin map that follows where the cables leave
              the board.
            </p>
          </div>

          <div className="odomThree odomTwo">
            <div>
              <span>The IMU ground</span>
              <p>
                On V1, the ground trace for the IMU was on the top layer when
                it should have been on the bottom. V2 has it on the bottom
                layer.
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

          <div className="odomCallout odomStatusBox">
            <span>Where it stands</span>
            <p>
              The V2 board is soldered and finished. It is waiting to be
              tested, so there are no results to show yet. That is the next
              chapter.
            </p>
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
      </div>
    </section>
  );
}
