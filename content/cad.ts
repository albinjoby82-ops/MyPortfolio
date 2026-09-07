import type { CadDocument } from '@/lib/cad';

export const gaelForceCadDocuments: CadDocument[] = [
  {
    id: 'prototype-lift-v1',
    name: 'Prototype Lift V1',
    provider: 'onshape',
    summary: 'The first lift prototype from our early CAD studies.',
    href: 'https://gaelforceucd.onshape.com/documents/0c5cb0532913732fcac11a7e/w/a7b7b13a2eb6bcd7347b3d9b/e/cff6a3ff7656f9c705d1929d?renderMode=0&uiState=6a9d4623050c30246fec5790',
    tabs: [
      {
        id: 'assembly',
        name: 'Lift assembly',
        kind: 'assembly',
        summary: 'Prototype Lift V1',
        model: '/projects/galeforce/cad/prototype-lift-v1.glb',
        poster: '/projects/galeforce/cad/prototype-lift-v1-poster.jpg',
      },
    ],
  },
];
