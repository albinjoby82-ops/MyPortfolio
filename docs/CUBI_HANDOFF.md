# Cubi portfolio handoff

Last updated 31 August 2026.

## Outcome

The Cubi project page is now a substantial case study with real product media,
custom editorial layouts, three interactive demonstrations taken from the
working Cubi codebase and a customer workflow timeline. Local route:

`http://localhost:3000/projects/cubi/`

The portfolio repository remote is:

`https://github.com/albinjoby82-ops/MyPortfolio.git`

## Source projects

- Portfolio: `D:\My Portfollio`
- Original Cubi app: `D:\The small buisness\3d veiwer version 1`
- Cubi knowledge vault: search the Cubi project folders before inventing copy
  or implementation details.

Albin explicitly asked that future agents reuse the working Cubi code rather
than recreate approximations. The runtime files under
`components/cubi-runtime/` were copied from the original project. At the time
of this handoff, hashes for the viewer, model helpers, decal utilities,
sanitiser, lighting, texture code, type definitions and GLB matched the source.
`ColorStep.tsx` also matched its original source exactly.

## Interactive sections

### 1. How Cubi works

Files:

- `components/CubiPortal.tsx`
- `components/CubiTapDemo.tsx`
- `components/CubiTapDemo.css`

This embeds the original Cubi NFC interaction. The phone can be tapped or
dragged onto a tile. Keep this compact and editorial. Albin rejected the first
oversized yellow-block treatment.

### 2. Image converter and logo preview

Files:

- `components/CubiLogoLab.tsx`
- `components/CubiLogoLab.css`
- `components/CubiBaseViewer.tsx`
- `lib/cubiSanitizeSvg.ts`

This uses the real Cubi Base GLB, mesh-role mapping, lighting, orbit controls
and SVG decal renderer. It has two presets only: Claude and Bambu Lab. Albin
asked to remove the Cubi preset, the SVG upload box and the conversion-status
line. Do not restore those without being asked.

The board is black and the printed tiles/details are red. Clicking a preset
rebuilds the live decal on the authored board-logo target.

### 3. Board colour customiser

Files:

- `components/CubiColourLab.tsx`
- `components/CubiColourLab.css`
- `components/cubi-runtime/customizer/core/ColorStep.tsx`
- `components/CubiBaseViewer.tsx`

This replaced the old text-only "The 3D customiser" section. It reuses Cubi's
original colour-step component and drives the real Cubi Base board material.
The tile colour stays red. The selected board colour also becomes the tile icon
colour, matching Cubi's derived-colour behaviour.

The palette shown is the board palette from Albin's Cubi reference: Mistletoe
Green, Bambu Green, Pink, Red, Blue, Black, Cyan, Orange, Yellow and Jade
White. Only the board-colour step is interactive right now. The remaining step
labels are intentionally present as context, not clickable fake functionality.

### 4. Customer workflow

Files:

- `components/CubiWorkflow.tsx`
- `components/CubiWorkflow.css`

This is an eight-step timeline showing one customer order from product choice
and live customisation through the local logo converter, basket, Cloudflare and
Stripe checkout, Stripe webhook, Firestore, admin production tools, Bambu
Studio and delivery. Keep it focused on the customer's journey while making the
supporting systems visible.

## Original Cubi runtime inventory

`components/cubi-runtime/` contains:

- `customizer/core/Product3DViewer.tsx`
- `customizer/core/modelSceneUtils.ts`
- `customizer/core/svgDecalUtils.ts`
- `customizer/core/textDecalUtils.ts`
- `customizer/core/types.ts`
- `customizer/core/ColorStep.tsx`
- `customizer/config/masterFonts.ts`
- `components/Product3DViewer/ViewerLights.tsx`
- `utils/svgToTexture.ts`
- `utils/sanitizeSvg.ts`

The portfolio adapter carries the original Cubi Base configuration, including:

- model path `/models/cubi-base/Cubi-Base-2.glb`
- original generic GLB mesh names (`empty_2` through `empty_12`)
- authored orientation correction `[-0.5, 0.5, 0.5, 0.5]`
- original camera position `[0, 3.4, -7]`

## Dependencies added

- `three`
- `@types/three`
- `@react-three/fiber`
- `@react-three/drei`

These match the versions used by the original Cubi project.

## Visual decisions already made

- Main project image is the real portrait photo in
  `public/projects/cubi/cubi-main.jpeg`, shown with an editorial yellow panel.
- The portfolio badge strip uses real brand SVGs and brand colours.
- The tool order requested by Albin starts with Claude, Codex, Stripe, Bambu,
  Cloudflare, GitHub and VS Code.
- Avoid em dashes in visible copy.
- The interactive windows should feel compact. Albin repeatedly asked to avoid
  large empty blocks and awkward image crops.
- Wheel zoom is disabled in the embedded product viewers so scrolling the
  portfolio page never gets trapped by a canvas. Drag rotation remains active.
- The "What went wrong" and "What I learned" cards belong at the bottom of the
  project page, after the long-form build story.

## Verification completed

- `npx tsc --noEmit --incremental false` passes.
- `/projects/cubi/` returns HTTP 200 from the local Next server.
- The GLB returns HTTP 200 with `model/gltf-binary`.
- Browser checks confirmed Claude and Bambu replace the live board decal.
- Browser checks confirmed board swatches update the real model material.

## Good next steps

Albin stopped here intentionally. When work resumes, ask what section he wants
next. Likely directions mentioned earlier include:

- supporting images for the converter and physical-product explanations;
- screenshots or live views of the admin order panel;
- the 3MF-to-Bambu Studio manufacturing workflow;
- backend, Stripe, Firebase and Cloudflare architecture;
- email scraper and personalised preview panel;
- mobile refinement and performance testing of the embedded WebGL sections.

Do not expand all of these automatically. Continue one visual section at a
time with Albin reviewing localhost screenshots.
