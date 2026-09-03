// CAD documents shown by the portal.
//
// Onshape will not let its viewer be embedded in another site, so an
// interactive tab needs a glTF/GLB export of that tab saved under
// `public/models/`. `scripts/onshape-sync.mjs` does that export for you, and
// also writes out the mates. Full instructions: docs/CAD_PORTAL.md.
//
// Fusion is different — its public share links embed fine, so a Fusion tab only
// needs `embed` set to the share URL.

import type { CadDocument, CadTab } from '@/lib/cad';

/**
 * TODO (Albin): the real GaelForce tabs.
 *
 * Fill this array in once the Onshape document is public and exported. Until it
 * has entries the portal shows the sample document below, so the page is never
 * empty. Example of a finished entry:
 *
 * {
 *   id: 'drive-base',
 *   name: 'Drive base',
 *   kind: 'assembly',
 *   summary: 'Chassis, drive pods and the mounting plate.',
 *   model: '/models/galeforce/drive-base.glb',
 *   href: 'https://cad.onshape.com/documents/<did>/w/<wid>/e/<eid>',
 *   mates: [
 *     {
 *       id: 'left-pod',
 *       name: 'Left drive pod',
 *       type: 'revolute',
 *       moves: ['Left_Pod'],
 *       origin: [-0.21, 0.06, 0],
 *       axis: [0, 0, 1],
 *       angle: { min: -180, max: 180 },
 *     },
 *   ],
 * }
 */
export const galeForceCadTabs: CadTab[] = [];

/** TODO (Albin): the public Onshape document URL for GaelForce. */
export const galeForceCadHref = '';

/**
 * A stand-in so the portal is explorable before any real export exists: three
 * boxes with one revolute and one slider mate. Not a GaelForce part. Delete
 * this and the GLB under public/models/cad-demo/ once real tabs land.
 */
export const sampleCadDocument: CadDocument = {
  id: 'sample',
  name: 'Sample mechanism',
  provider: 'onshape',
  summary: 'A stand-in model showing what the portal does with a real export.',
  tabs: [
    {
      id: 'sample-part-studio',
      name: 'Sample Part Studio',
      kind: 'part-studio',
      summary:
        'A Part Studio tab holds the modelled parts. Click any part to hide it, or Solo to look at one on its own.',
      model: '/models/cad-demo/sample-mechanism.glb',
    },
    {
      id: 'sample-assembly',
      name: 'Sample Assembly',
      kind: 'assembly',
      summary:
        'An Assembly tab adds the mates. Each slider below is one degree of freedom the mate leaves open, applied about the real mate axis.',
      model: '/models/cad-demo/sample-mechanism.glb',
      mates: [
        {
          id: 'shoulder',
          name: 'Shoulder hinge',
          type: 'revolute',
          moves: ['Swing_Arm'],
          origin: [-1.0, 0.6, 0],
          axis: [0, 0, 1],
          angle: { min: -35, max: 55, start: 0 },
        },
        {
          id: 'jaw-slide',
          name: 'Jaw slide',
          type: 'slider',
          moves: ['Slide_Jaw'],
          // Rides on the arm, so it stays on the arm when the shoulder swings.
          parent: 'shoulder',
          origin: [0.9, 0.95, 0],
          axis: [1, 0, 0],
          travel: { min: -0.9, max: 0.25, start: 0, scale: 1000, unit: 'mm' },
        },
      ],
    },
  ],
};

export const galeForceCadDocument: CadDocument =
  galeForceCadTabs.length > 0
    ? {
        id: 'galeforce',
        name: 'GaelForce · CAD',
        provider: 'onshape',
        href: galeForceCadHref || undefined,
        tabs: galeForceCadTabs,
      }
    : sampleCadDocument;

/** True while the portal is still showing the stand-in rather than real tabs. */
export const galeForceCadIsSample = galeForceCadTabs.length === 0;
