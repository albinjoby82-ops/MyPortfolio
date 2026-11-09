import Link from "next/link";
import "./AiExperiments.css";
import {
  cad,
  commits,
  deepDives,
  failures,
  intro,
  rules,
  skills,
  studySites,
  timeline,
  type AiLink,
} from "@/content/ai-experiments";

/**
 * The layout for /projects/ai-experiments. Server component, no client JS.
 * All the words live in content/ai-experiments.ts.
 */

function Chip({ link }: { link: AiLink }) {
  const internal = link.href.startsWith("/") || link.href.startsWith("#");
  if (internal) {
    return (
      <Link href={link.href} className="aiChip">
        {link.label} <span aria-hidden="true">→</span>
      </Link>
    );
  }
  return (
    <a href={link.href} target="_blank" rel="noreferrer" className="aiChip">
      {link.label} <span aria-hidden="true">↗</span>
    </a>
  );
}

function Chips({ links, privateNote }: { links: AiLink[]; privateNote?: string }) {
  if (links.length === 0 && !privateNote) return null;
  return (
    <div className="aiChips">
      {links.map((l) => (
        <Chip key={l.href} link={l} />
      ))}
      {privateNote && <span className="aiPrivate">{privateNote}</span>}
    </div>
  );
}

/** Stacked bars. AI-credited commits sit on the baseline so months compare directly. */
function CommitChart() {
  const max = Math.max(...commits.months.map((m) => m.total));
  return (
    <figure className="aiChart">
      <figcaption className="aiChartHead">
        <span className="aiChartTitle">{commits.title}</span>
        <span className="aiLegend">
          <span>
            <i className="aiSwatch aiSwatchAi" /> Credit an AI
          </span>
          <span>
            <i className="aiSwatch aiSwatchOther" /> The rest
          </span>
        </span>
      </figcaption>

      <div className="aiBars">
        {commits.months.map((m) => {
          const other = m.total - m.ai;
          const summary = `${m.full}: ${m.total} commits, ${m.ai} credit an AI`;
          return (
            <div key={m.month} className="aiBarCol" tabIndex={0} aria-label={summary}>
              <div className="aiTip" role="presentation">
                <b>{m.full}</b>
                <span>{m.total} commits</span>
                <span>{m.ai} credit an AI</span>
              </div>
              <div className="aiBarPlot">
                <span className="aiBarTotal">{m.total}</span>
                {/* 86% leaves headroom for the total above the tallest bar. */}
                <span className="aiBarOther" style={{ height: `${(other / max) * 86}%` }} />
                <span className="aiBarAi" style={{ height: `${(m.ai / max) * 86}%` }} />
              </div>
              <span className="aiBarMonth">{m.month}</span>
            </div>
          );
        })}
      </div>

      <p className="aiChartNote">{commits.note}</p>

      <details className="aiDetails">
        <summary>See it as a table</summary>
        <table className="aiTable">
          <thead>
            <tr>
              <th>Month</th>
              <th>Commits</th>
              <th>Credit an AI</th>
            </tr>
          </thead>
          <tbody>
            {commits.months.map((m) => (
              <tr key={m.month}>
                <td>{m.full}</td>
                <td>{m.total}</td>
                <td>{m.ai}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

export default function AiExperiments() {
  return (
    <div className="aiPage">
      {/* ---- The short version ---- */}
      <section className="aiSection gutter">
        <div className="aiIntro">
          <div>
            <blockquote className="aiQuote">
              <p>{intro.quote}</p>
            </blockquote>
            <p className="aiCopy aiIntroNote">{intro.note}</p>
            <h2 className="eyebrow aiSmallHead">Reading the numbers</h2>
            <ul className="aiDots">
              {commits.caveats.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <Chips links={[commits.caveatLink]} />
          </div>
          <CommitChart />
        </div>
      </section>

      {/* ---- Timeline ---- */}
      <section className="aiSection gutter">
        <h2 className="aiH2">Each test, in order</h2>
        <ol className="aiTimeline">
          {timeline.map((t) => (
            <li key={t.title} className="aiStop">
              <div className="aiDate">{t.date}</div>
              <article className="aiCard">
                <div className="aiCardMain">
                  <p className="aiQuestion">{t.question}</p>
                  <h3 className="aiCardTitle">{t.title}</h3>
                  <div className="aiCopy">
                    {t.story.map((s) => (
                      <p key={s}>{s}</p>
                    ))}
                  </div>
                  <Chips links={t.links} privateNote={t.privateNote} />
                </div>
                <aside className="aiLesson" style={{ backgroundColor: t.tint }}>
                  <span className="aiLessonTag">What it showed</span>
                  <h4 className="aiLessonTitle">{t.lessonTitle}</h4>
                  {t.lesson && <p>{t.lesson}</p>}
                  {t.list && (
                    <ul className="aiDots aiDotsInk">
                      {t.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </aside>
              </article>
            </li>
          ))}
          {deepDives.map((d) => (
            <li key={d.href} className="aiStop">
              <div className="aiDate">{d.date}</div>
              <a href={d.href} className="aiJump">
                <span>
                  <span className="aiQuestion">{d.question}</span>
                  <span className="aiCardTitle">{d.title}</span>
                </span>
                <span className="aiJumpArrow" aria-hidden="true">↓</span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      {/* ---- Study sites: a staircase, each step checked harder ---- */}
      <section id="study-sites" className="aiSection aiGroundSand gutter">
        <div className="aiHeadRow">
          <h2 className="aiH2">{studySites.heading}</h2>
          <div>
            <p className="aiCopy">{studySites.lede}</p>
            <Chips links={[studySites.moreLink]} />
          </div>
        </div>
        <ol className="aiStairs">
          {studySites.steps.map((s, i) => (
            <li key={s.name} className="aiStair" style={{ marginTop: `${(3 - i) * 28}px` }}>
              <span className="aiStairNo">Checked by</span>
              <h3 className="aiStairCheck">{s.check}</h3>
              <p className="aiStairDetail">{s.detail}</p>
              <div className="aiStairFoot">
                <b>{s.name}</b>
                <span>{s.what}</span>
                <Chips links={s.links} privateNote={s.privateNote} />
              </div>
            </li>
          ))}
        </ol>
        <p className="aiClosing">{studySites.closing}</p>
      </section>

      {/* ---- Skills ---- */}
      <section id="skills" className="aiSection gutter">
        <div className="aiHeadRow">
          <h2 className="aiH2">{skills.heading}</h2>
          <div>
            <p className="aiCopy">{skills.lede}</p>
            <Chips links={skills.links} />
          </div>
        </div>
        <div className="aiSkillGroups">
          {skills.groups.map((g) => (
            <div key={g.name} className="aiSkillGroup">
              <h3 className="aiSkillGroupHead" style={{ backgroundColor: g.tint }}>
                {g.name}
              </h3>
              <ul>
                {g.items.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} target="_blank" rel="noreferrer">
                      {item.name} <span aria-hidden="true">↗</span>
                    </a>
                    <p>{item.what}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="aiThree">
          {skills.stories.map((s) => (
            <article key={s.title} className="aiPlainCard">
              <h3>{s.title}</h3>
              <p className="aiCopy">{s.body}</p>
              <Chips links={s.link2 ? [s.link, s.link2] : [s.link]} />
            </article>
          ))}
        </div>
      </section>

      {/* ---- CAD ---- */}
      <section id="cad" className="aiSection aiGroundBlue gutter">
        <div className="aiHeadRow">
          <h2 className="aiH2">{cad.heading}</h2>
          <div>
            <p className="aiCopy aiCopyInk">{cad.lede}</p>
            <div className="aiFacts">
              {cad.facts.map((f) => (
                <div key={f.label}>
                  <b>{f.value}</b>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
            <p className="aiCopy aiCopyInk">{cad.archiveNote}</p>
            <Chips links={[cad.moreLink]} />
          </div>
        </div>

        <div className="aiGap">
          <h3>{cad.gap.title}</h3>
          <p className="aiCopy">{cad.gap.intro}</p>
          <ol className="aiGapSteps">
            {cad.gap.steps.map((s, i) => (
              <li key={i} className={s.right ? "aiGapRight" : "aiGapWrong"}>
                <b>{s.value}</b>
                <span className="aiGapUnit">mm</span>
                <span className="aiGapVerdict">{s.right ? "✓ Right" : "✗ Wrong"}</span>
                <span className="aiGapWho">{s.who}</span>
              </li>
            ))}
          </ol>
          <p className="aiCopy aiGapOutro">{cad.gap.outro}</p>
        </div>

        <div className="aiMoments">
          {cad.moments.map((m) => (
            <article key={m.title} className="aiPlainCard">
              <h3>{m.title}</h3>
              <p className="aiCopy">{m.body}</p>
            </article>
          ))}
        </div>

        <div className="aiFigures">
          {cad.images.map((img) => (
            <figure key={img.src}>
              <img src={img.src} alt={img.alt} loading="lazy" />
              <figcaption>{img.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---- Failures ---- */}
      <section className="aiSection gutter">
        <h2 className="aiH2">{failures.heading}</h2>
        <div className="aiFails" role="table" aria-label={failures.heading}>
          <div className="aiFailHead" role="row">
            <span role="columnheader">What went wrong</span>
            <span role="columnheader">What fixed it</span>
          </div>
          {failures.rows.map((r) => (
            <div key={r.wrong} className="aiFailRow" role="row">
              <span role="cell" className="aiFailWrong">
                <i aria-hidden="true">✗</i> {r.wrong}
              </span>
              <span role="cell" className="aiFailFix">
                <i aria-hidden="true">✓</i> {r.fix}
              </span>
            </div>
          ))}
        </div>
        <p className="aiClosing">{failures.closing}</p>
      </section>

      {/* ---- Rules ---- */}
      <section className="aiSection aiGroundInk gutter">
        <h2 className="aiH2">{rules.heading}</h2>
        <ol className="aiRules">
          {rules.items.map((r, i) => (
            <li key={r.title}>
              <span className="aiRuleNo">{i + 1}</span>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
            </li>
          ))}
        </ol>
      </section>

    </div>
  );
}
