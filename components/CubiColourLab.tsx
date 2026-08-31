'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import ColorStep, {
  type ColourOption,
} from './cubi-runtime/customizer/core/ColorStep';
import './CubiColourLab.css';

const CubiBaseViewer = dynamic(() => import('./CubiBaseViewer'), {
  ssr: false,
  loading: () => (
    <div className="cubiColourViewerLoading">Loading the Cubi Base model…</div>
  ),
});

const BOARD_COLOURS: ColourOption[] = [
  { id: 'mistletoe-green', name: 'Mistletoe Green', hex: '#5b9250' },
  { id: 'bambu-green', name: 'Bambu Green', hex: '#4faf4d' },
  { id: 'pink', name: 'Pink', hex: '#da6170' },
  { id: 'red', name: 'Red', hex: '#bb3d29' },
  { id: 'blue', name: 'Blue', hex: '#26368d' },
  { id: 'black', name: 'Black', hex: '#090909' },
  { id: 'cyan', name: 'Cyan', hex: '#4c88cf' },
  { id: 'orange', name: 'Orange', hex: '#ed722c' },
  { id: 'yellow', name: 'Yellow', hex: '#f7ed52' },
  { id: 'jade-white', name: 'Jade White', hex: '#f7f7f3' },
];

const STEPS = ['Board colour', 'Tile colour', 'Board text', 'Logo', 'Icons & paint'];

export default function CubiColourLab() {
  const [boardColor, setBoardColor] = useState('#090909');

  return (
    <section className="cubiColourShowcase gutter" aria-labelledby="cubi-colour-lab-title">
      <div className="cubiColourStory">
        <span className="cubiPortfolioKicker">03 · 3D customiser</span>
        <h2 id="cubi-colour-lab-title">The product changes while you design it.</h2>
        <p>
          I built one shared customiser that maps each product&apos;s meshes,
          positions converted logos and updates physical materials and icons live.
          The same system supports Cubi Base, Boards and Lite without turning
          every product into a separate application.
        </p>
        <p>
          The colours are tied to the filament palette I manage in the admin
          panel. If a spool is unavailable, I disable it once and customers can
          no longer order that finish.
        </p>
        <div className="cubiColourFacts" aria-label="Customizer details">
          <span><b>11</b> mapped meshes</span>
          <span><b>390px</b> mobile tested</span>
          <span><b>Live</b> material updates</span>
        </div>
      </div>

      <div className="cubiColourDemo">
        <nav className="cubiColourTabs" aria-label="Cubi customiser steps">
          {STEPS.map((step, index) => (
            <span key={step} className={index === 0 ? 'isActive' : ''}>
              <b>{index + 1}</b>
              <em>{step}</em>
            </span>
          ))}
        </nav>

        <div className="cubiColourWorkspace">
          <div className="cubiColourStage">
            <CubiBaseViewer boardColor={boardColor} tileColor="#d43b2f" />
            <div className="cubiColourStageNotes" aria-hidden="true">
              <span>Drag to rotate</span>
              <span>Scroll to zoom</span>
              <span>Every change updates live</span>
            </div>
          </div>

          <div className="cubiColourControls cubiCustomizer">
            <ColorStep
              title="Board colour"
              description="Choose the main colour for the board."
              colours={BOARD_COLOURS}
              value={boardColor}
              onChange={setBoardColor}
            />
            <div className="cubiColourFooter">
              <span>Step 1 of 5</span>
              <button type="button">Next</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
