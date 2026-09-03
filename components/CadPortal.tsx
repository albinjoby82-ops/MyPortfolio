'use client';

import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';
import {
  MATE_TYPE_LABEL,
  PROVIDER_LABEL,
  TAB_KIND_LABEL,
  fusionEmbedUrl,
  mateChannels,
  mateStart,
  type CadDocument,
  type CadMate,
  type CadTab,
} from '@/lib/cad';
import type { MateValues } from './CadModelViewer';
import './CadPortal.css';

const CadModelViewer = dynamic(() => import('./CadModelViewer'), {
  ssr: false,
  loading: () => <div className="cadViewerLoading">Loading the model…</div>,
});

type Props = {
  document: CadDocument;
  /** Section heading above the window. */
  title?: string;
  kicker?: string;
  intro?: string;
};

function startingValues(mates: CadMate[]): MateValues {
  const values: MateValues = {};
  for (const mate of mates) {
    values[mate.id] = {
      angle: mate.angle ? mateStart(mate, 'angle') : undefined,
      travel: mate.travel ? mateStart(mate, 'travel') : undefined,
    };
  }
  return values;
}

function formatTravel(mate: CadMate, value: number): string {
  const scale = mate.travel?.scale ?? 1;
  const unit = mate.travel?.unit ?? '';
  const scaled = value * scale;
  const decimals = Math.abs(scaled) >= 100 ? 0 : 1;
  return `${scaled.toFixed(decimals)}${unit ? ` ${unit}` : ''}`;
}

/**
 * A CAD document as a window you can click through: one entry per Part Studio
 * and Assembly, an interactive viewer for the tabs that have an export, and the
 * assembly's mates exposed as live degrees of freedom.
 */
export default function CadPortal({ document, title, kicker, intro }: Props) {
  const [activeId, setActiveId] = useState(document.tabs[0]?.id ?? '');
  const active: CadTab | undefined =
    document.tabs.find((t) => t.id === activeId) ?? document.tabs[0];

  const mates = useMemo(() => active?.mates ?? [], [active]);
  const [values, setValues] = useState<MateValues>(() => startingValues(mates));
  const [parts, setParts] = useState<string[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [isolated, setIsolated] = useState<string | undefined>();
  const [explode, setExplode] = useState(0);
  const [fitToken, setFitToken] = useState(0);

  // Each tab is its own model; carrying one tab's isolate/explode state into
  // the next would just be confusing.
  const selectTab = (tab: CadTab) => {
    setActiveId(tab.id);
    setValues(startingValues(tab.mates ?? []));
    setParts([]);
    setHidden([]);
    setIsolated(undefined);
    setExplode(0);
    setFitToken(0);
  };

  const handleParts = useCallback((found: string[]) => setParts(found), []);

  const setMate = (id: string, channel: 'angle' | 'travel', value: number) =>
    setValues((prev) => ({ ...prev, [id]: { ...prev[id], [channel]: value } }));

  const resetMates = () => setValues(startingValues(mates));

  const togglePart = (name: string) => {
    if (isolated) {
      setIsolated(isolated === name ? undefined : name);
      return;
    }
    setHidden((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name],
    );
  };

  const embed = active?.embed ? fusionEmbedUrl(active.embed) : undefined;
  const providerLabel = PROVIDER_LABEL[document.provider];
  const hasControls = Boolean(active?.model);

  return (
    <section className="cadPortal gutter" aria-labelledby="cad-portal-title">
      <div className="cadPortalInner">
        <div className="cadPortalIntro">
          <div>
            <span className="cadKicker">{kicker ?? 'CAD'}</span>
            <h2 id="cad-portal-title">{title ?? document.name}</h2>
          </div>
          {intro && <p>{intro}</p>}
        </div>

        <div className="cadWindow">
          <div className="cadWindowBar">
            <span className="cadWindowName">
              {providerLabel.toUpperCase()} · {document.name.toUpperCase()}
            </span>
            {document.href && (
              <a href={document.href} target="_blank" rel="noreferrer">
                Open in {providerLabel} ↗
              </a>
            )}
          </div>

          <div className="cadWindowBody">
            {/* Tab rail — the document's Part Studios and Assemblies. */}
            <div className="cadTabRail" role="tablist" aria-label={`${document.name} tabs`}>
              {document.tabs.map((tab) => {
                const selected = tab.id === active?.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    id={`cad-tab-${tab.id}`}
                    aria-selected={selected}
                    aria-controls="cad-tab-panel"
                    className={'cadTab' + (selected ? ' cadTab--on' : '')}
                    onClick={() => selectTab(tab)}
                  >
                    <span className={`cadTabIcon cadTabIcon--${tab.kind}`} aria-hidden="true" />
                    <span className="cadTabText">
                      <strong>{tab.name}</strong>
                      <em>{TAB_KIND_LABEL[tab.kind]}</em>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="cadStage" role="tabpanel" id="cad-tab-panel" aria-labelledby={active ? `cad-tab-${active.id}` : undefined}>
              {active?.model ? (
                <CadModelViewer
                  key={active.id}
                  model={active.model}
                  mates={mates}
                  values={values}
                  hidden={hidden}
                  isolated={isolated}
                  explode={explode}
                  onParts={handleParts}
                  fitToken={fitToken}
                />
              ) : embed ? (
                <iframe
                  className="cadEmbedFrame"
                  src={embed}
                  title={`${active?.name} in the Autodesk viewer`}
                  loading="lazy"
                  allowFullScreen
                />
              ) : (
                <div className="cadEmpty">
                  <p className="cadEmptyTitle">No export for this tab yet.</p>
                  <p>
                    {providerLabel} tabs need a glTF/GLB export saved under{' '}
                    <code>public/models/</code> before they can be explored here.
                    See <code>docs/CAD_PORTAL.md</code>.
                  </p>
                  {active?.href && (
                    <a className="cadEmptyLink" href={active.href} target="_blank" rel="noreferrer">
                      Open this tab in {providerLabel} ↗
                    </a>
                  )}
                </div>
              )}
            </div>

            <aside className="cadInspector">
              {active?.summary && <p className="cadInspectorSummary">{active.summary}</p>}

              {hasControls && (
                <>
                  <div className="cadInspectorBlock">
                    <div className="cadInspectorHead">
                      <h3>Parts</h3>
                      {(hidden.length > 0 || isolated) && (
                        <button
                          type="button"
                          className="cadTextButton"
                          onClick={() => {
                            setHidden([]);
                            setIsolated(undefined);
                          }}
                        >
                          Show all
                        </button>
                      )}
                    </div>

                    {parts.length === 0 ? (
                      <p className="cadHint">Reading the model…</p>
                    ) : (
                      <ul className="cadPartList">
                        {parts.map((part) => {
                          const off = isolated ? isolated !== part : hidden.includes(part);
                          return (
                            <li key={part}>
                              <button
                                type="button"
                                className={'cadPart' + (off ? ' cadPart--off' : '')}
                                onClick={() => togglePart(part)}
                                aria-pressed={!off}
                              >
                                <span className="cadPartDot" aria-hidden="true" />
                                {part.replace(/_/g, ' ')}
                              </button>
                              <button
                                type="button"
                                className="cadIsolate"
                                onClick={() =>
                                  setIsolated(isolated === part ? undefined : part)
                                }
                                aria-pressed={isolated === part}
                                title={isolated === part ? 'Stop isolating' : 'Isolate this part'}
                              >
                                {isolated === part ? 'Exit' : 'Solo'}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  <div className="cadInspectorBlock">
                    <div className="cadInspectorHead">
                      <h3>View</h3>
                      <button
                        type="button"
                        className="cadTextButton"
                        onClick={() => setFitToken((t) => t + 1)}
                      >
                        Fit view
                      </button>
                    </div>
                    <label className="cadControlLabel" htmlFor="cad-explode">
                      <span>Exploded</span>
                      <output htmlFor="cad-explode">{Math.round(explode * 100)}%</output>
                    </label>
                    <input
                      id="cad-explode"
                      className="cadSlider"
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={explode}
                      onChange={(e) => setExplode(Number(e.target.value))}
                    />
                  </div>
                </>
              )}

              {mates.length > 0 && (
                <div className="cadInspectorBlock">
                  <div className="cadInspectorHead">
                    <h3>Mates</h3>
                    <button type="button" className="cadTextButton" onClick={resetMates}>
                      Reset
                    </button>
                  </div>
                  <p className="cadHint">
                    Each control is one degree of freedom left open by a mate in the
                    assembly.
                  </p>

                  {mates.map((mate) => (
                    <div key={mate.id} className="cadMate">
                      <div className="cadMateHead">
                        <strong>{mate.name}</strong>
                        <span className="cadMateType">{MATE_TYPE_LABEL[mate.type]}</span>
                      </div>

                      {mateChannels(mate).map((channel) => {
                        const range = channel === 'angle' ? mate.angle! : mate.travel!;
                        const value =
                          values[mate.id]?.[channel] ?? mateStart(mate, channel);
                        const step =
                          channel === 'angle' ? 1 : (range.max - range.min) / 200 || 0.01;
                        return (
                          <label key={channel} className="cadMateControl">
                            <span className="cadControlLabel">
                              <span>{channel === 'angle' ? 'Rotation' : 'Travel'}</span>
                              <output>
                                {channel === 'angle'
                                  ? `${Math.round(value)}°`
                                  : formatTravel(mate, value)}
                              </output>
                            </span>
                            <input
                              className="cadSlider"
                              type="range"
                              min={range.min}
                              max={range.max}
                              step={step}
                              value={value}
                              onChange={(e) =>
                                setMate(mate.id, channel, Number(e.target.value))
                              }
                            />
                          </label>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}

              {active?.href && hasControls && (
                <a className="cadInspectorLink" href={active.href} target="_blank" rel="noreferrer">
                  Open this tab in {providerLabel} ↗
                </a>
              )}
            </aside>
          </div>

          <div className="cadWindowFoot">
            <span>Drag to orbit · scroll to zoom · right-drag to pan</span>
            {document.provider === 'onshape' && (
              <span className="cadFootNote">
                Rendered from a glTF export — Onshape does not allow its own
                viewer to be embedded.
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
