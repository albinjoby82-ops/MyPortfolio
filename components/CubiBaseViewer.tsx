'use client';

import { useMemo } from 'react';
import Product3DViewer from './cubi-runtime/customizer/core/Product3DViewer';
import type {
  PresetIcon,
  ProductCustomizationState,
  ProductCustomizerConfig,
} from './cubi-runtime/customizer/core/types';

const MAIL_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <rect x="7" y="11" width="34" height="26" rx="6" fill="none" stroke="#000" stroke-width="4"/>
    <path d="m10 15 14 11 14-11" fill="none" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

const WEB_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="17" fill="none" stroke="#000" stroke-width="4"/>
    <path d="M7 24h34M24 7c6 5 9 10 9 17s-3 12-9 17c-6-5-9-10-9-17s3-12 9-17Z" fill="none" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

function icon(id: string, name: string, svg: string): PresetIcon {
  return { id, name, svgPath: '', svg, enabled: true };
}

const CUBI_BASE_CONFIG: ProductCustomizerConfig = {
  productId: 'cubi-base-2',
  productName: 'Cubi Base 2-Tap',
  productSlug: 'cubi-base',
  libraryId: 'cubi-base',
  productImages: ['/products/cubi-base-2.png'],
  modelPath: '/models/cubi-base/Cubi-Base-2.glb',
  shortDescription: 'A compact counter-top Cubi with two programmable tap actions.',
  enabled: true,
  customizerSteps: ['boardColor', 'cubeColor', 'accentColor', 'logoText', 'paintLogo'],
  defaultCustomizationState: {
    boardColor: '#0a0a0a',
    cubeColor: '#d43b2f',
    accentColor: '#d43b2f',
    cubeIconColor: '#0a0a0a',
    customText: 'YOUR BRAND · YOUR LINKS',
    textFont: 'arial',
    selectedPresetIcon: 'website',
    cubeIcons: {
      cube1: icon('email', 'Email', MAIL_SVG),
      cube2: icon('website', 'Website', WEB_SVG),
    },
    cubeLinks: { cube1: '', cube2: '' },
    logoPaintRegions: [],
  },
  meshRoles: {
    board: ['empty_3', 'CubiBase_Panel'],
    cubes: [
      'empty_4',
      'empty_5',
      'empty_6',
      'empty_7',
      'empty_8',
      'empty_9',
      'CubiBase_Tap_Body',
      'tap body',
    ],
    accent: [],
    logoZones: ['empty_2', 'Target_Base_Logo', 'base logo target'],
    textZones: ['empty_12', 'Target_Base_Text', 'base text target'],
    iconZones: [
      ['empty_10', 'Target_Base_01_Icon', 'base 01 icon target'],
      ['empty_11', 'Target_Base_02_Icon', 'base 02 icon target'],
    ],
    flippedTargets: ['boardLogo'],
    ignored: [],
  },
  orientation: [-0.5, 0.5, 0.5, 0.5],
  cameraDefaults: {
    position: [0, 3.4, -7],
    target: [0, 0, 0],
    zoom: 1,
  },
};

export default function CubiBaseViewer({
  logoSvg,
  logoName,
  boardColor = '#0a0a0a',
  tileColor = '#d43b2f',
}: {
  logoSvg?: string;
  logoName?: string;
  boardColor?: string;
  tileColor?: string;
}) {
  const customization = useMemo<ProductCustomizationState>(
    () => ({
      ...CUBI_BASE_CONFIG.defaultCustomizationState,
      boardColor,
      cubeColor: tileColor,
      accentColor: tileColor,
      cubeIconColor: boardColor,
      logoFile: logoSvg
        ? {
            name: `${logoName ?? 'Uploaded logo'}.svg`,
            type: 'image/png',
            size: logoSvg.length,
            file: undefined as unknown as File,
            svg: logoSvg,
            candidateLabel: logoName ?? 'Uploaded logo',
          }
        : undefined,
    }),
    [boardColor, logoName, logoSvg, tileColor],
  );

  return <Product3DViewer config={CUBI_BASE_CONFIG} customization={customization} />;
}
