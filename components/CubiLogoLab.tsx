'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { sanitizeSvg } from '@/lib/cubiSanitizeSvg';
import './CubiLogoLab.css';

const CubiBaseViewer = dynamic(() => import('./CubiBaseViewer'), {
  ssr: false,
  loading: () => (
    <div className="cubiLogoViewerLoading">Loading the original Cubi model…</div>
  ),
});

type Preset = {
  id: 'claude' | 'bambu';
  label: string;
  source: string;
};

const PRESETS: Preset[] = [
  { id: 'claude', label: 'Claude', source: '/brands/claude.svg' },
  { id: 'bambu', label: 'Bambu Lab', source: '/brands/bambu-studio.svg' },
];

const PRINT_RED = '#d43b2f';

export default function CubiLogoLab() {
  const [selected, setSelected] = useState<Preset>(PRESETS[0]);
  const [cleanSvg, setCleanSvg] = useState('');

  useEffect(() => {
    let active = true;
    fetch(selected.source)
      .then((response) => response.text())
      .then((svg) => {
        if (!active) return;
        setCleanSvg(sanitizeSvg(svg, PRINT_RED, { flattenColors: true }));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [selected]);

  function choosePreset(preset: Preset) {
    setSelected(preset);
  }

  return (
    <section className="cubiLogoShowcase gutter" aria-labelledby="cubi-logo-lab-title">
      <div className="cubiLogoStory">
        <span className="cubiPortfolioKicker">02 · Image converter</span>
        <h2 id="cubi-logo-lab-title">Making any logo printable.</h2>
        <p>
          Customers rarely have perfect vector artwork. Cubi analyses the
          upload, creates clean candidates and turns the chosen result into a
          safe, one-colour shape for the physical inset.
        </p>
        <p>
          This is the original Cubi Base model, viewer and decal renderer. Pick
          a logo and the same live product preview used by Cubi updates in place.
        </p>
        <div className="cubiLogoPipeline" aria-label="Logo conversion pipeline">
          <span>Source image</span><i>→</i><span>Clean SVG</span><i>→</i><span>3D inset</span>
        </div>
      </div>

      <div className="cubiSite cubiLogoLab">
        <div className="cubiLogoLabTabs" aria-label="Customizer steps">
          {['Board', 'Tile', 'Text', 'Logo', 'Paint'].map((step, index) => (
            <span key={step} className={step === 'Logo' ? 'isActive' : ''}>
              <b>{index + 1}</b>{step}
            </span>
          ))}
        </div>

        <div className="cubiLogoLabBody">
          <div
            className="cubiLogoProductStage"
            aria-label={`${selected.label} logo shown on the original black and red Cubi Base model`}
          >
            <CubiBaseViewer logoSvg={cleanSvg} logoName={selected.label} />
            <div className="cubiLogoStageLegend">
              <span>Drag to rotate</span>
              <span>Scroll to zoom</span>
            </div>
          </div>

          <div className="cubiLogoControls">
            <div className="cubiLogoConverterHead">
              <div>
                <p>Image converter</p>
                <h4>Prepare your logo for 3D printing.</h4>
                <span>Choose a sample and watch the real model update.</span>
              </div>
            </div>

            <div className="cubiLogoPresets">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={selected.id === preset.id ? 'isSelected' : ''}
                  onClick={() => choosePreset(preset)}
                  aria-pressed={selected.id === preset.id}
                >
                  <img src={preset.source} alt="" />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
