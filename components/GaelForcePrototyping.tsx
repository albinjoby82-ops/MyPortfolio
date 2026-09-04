import './GaelForcePrototyping.css';

export default function GaelForcePrototyping() {
  return (
    <section
      className="gaelForcePrototyping gutter"
      aria-labelledby="galeforce-prototyping-title"
    >
      <div className="gaelForcePrototypingInner">
        <div className="gaelForcePrototypingIntro">
          <div>
            <span className="galeForceKicker">04 · Prototyping</span>
            <h2 id="galeforce-prototyping-title">
              We couldn&apos;t buy the final components yet, but we could start
              engineering.
            </h2>
          </div>

          <div className="gaelForcePrototypingCopy">
            <p>
              It took until September to raise enough money and establish an
              approved purchasing route with UCD&apos;s School of Electrical and
              Electronic Engineering. Only then could we begin ordering
              official VEX components. Rather than waiting for the procurement
              process to finish, we used that time to explore ideas and begin
              prototyping.
            </p>
            <p>
              We laser-cut and 3D-printed physical mock-ups of several important
              systems, including the drivetrain, odometry system and claw.
              These early prototypes allowed us to investigate dimensions,
              movement, mounting points and assembly before committing money
              to final hardware.
            </p>
            <p>
              Alongside the physical prototypes, the team developed exploratory
              CAD models for mechanisms such as a cascade lift, omni wheels and
              other potential robot components. These models were not intended
              to be final designs; they helped us compare concepts, identify
              problems and understand how the different systems might fit
              together.
            </p>
            <p>
              A large part of this phase was also research and design
              reconnaissance. We studied previous VEX robots, competition
              footage, common mechanisms and different approaches taken by
              experienced teams. We regularly came together to present ideas,
              challenge assumptions and discuss the advantages and limitations
              of each design.
            </p>
            <p>
              By the time purchasing became possible, we had already built a
              much clearer understanding of the robot we wanted to create. The
              delay became useful engineering time: a chance to test cheaply,
              learn quickly and make better-informed decisions before working
              with the official components.
            </p>
          </div>
        </div>

        <div className="gaelForcePrototypeTracks" aria-label="Prototyping workstreams">
          <div>
            <span>Physical mock-ups</span>
            <strong>Drivetrain · Odometry · Claw</strong>
          </div>
          <div>
            <span>CAD studies</span>
            <strong>Cascade lift · Omni wheels</strong>
          </div>
          <div>
            <span>Design research</span>
            <strong>Robots · Matches · Mechanisms</strong>
          </div>
        </div>

        {/* Add prototype, CAD and research windows below this point. */}
      </div>
    </section>
  );
}
