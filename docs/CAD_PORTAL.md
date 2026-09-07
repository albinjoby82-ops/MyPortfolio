# GaelForce CAD windows

GaelForce CAD is shown through lightweight GLB exports from the real Onshape
source documents. The portfolio owns the framing and orbit viewer, while
Onshape remains the editable source of truth. It does not recreate assembly
mates or claim that the exported model is live CAD.

## Adding a model

1. Right-click the relevant Assembly tab in Onshape and choose Export.
2. Select GLB, Medium resolution, Y axis up, and leave compression disabled.
3. Place the file in `public/projects/galeforce/cad/`.
4. Add its public path to the matching tab in `content/cad.ts` as `model`.
5. Add the original Onshape tab URL as `href` when useful.
6. Test the exported portfolio on desktop and mobile.

The viewer intentionally provides only rotate, zoom and pan. GLB does not carry
Onshape feature history or mate behaviour. Replace an existing file at the same
path to publish a newer snapshot without changing the page configuration.

A published 3DVizi URL can still be supplied as `embed` later. It takes priority
over the local model and must use HTTPS on the `share.3dvizi.com` host.

## Current window

`Prototype Lift V1` is the first CAD entry. Its model is
`public/projects/galeforce/cad/prototype-lift-v1.glb`, supplied by Albin as
`V2 Rough Idea.glb` on 6 September 2026. Its card uses a real render from that
model at `public/projects/galeforce/cad/prototype-lift-v1-poster.jpg`.
