# Agent instructions

Read `HANDOFF.md` before changing this project. For Cubi work, also read
`docs/CUBI_HANDOFF.md`. For the social widgets read `docs/SOCIAL_FEED.md`; for
the CAD portal read `docs/CAD_PORTAL.md`.

## Reusing this code in another repository

The social widgets and the CAD portal are written to be copied into other
projects. If that is what you are here for, read **`docs/PORTABLE_MODULES.md`**
— it is the porting contract: file manifests, dependencies, host requirements,
data contracts, the platform constraints that cannot be worked around, and how
to verify the result in a browser. Do not copy `content/*.ts` values or the
`GaleForce*` wrappers into another project; they are this site's content.

## Working rules

- Preserve the supplied portfolio design system in `design-reference/`.
- Never invent project facts. Leave unknown details as TODOs or ask Albin.
- Keep project content file-driven through `content/projects/*.mdx`.
- Do not rewrite the Cubi demos from scratch. Reuse the original runtime in
  `components/cubi-runtime/` and keep copied source files unchanged where
  possible.
- Do not run `npm run build` while the development server is running because
  both processes write to `.next/`.
- Use `npx tsc --noEmit --incremental false` for a safe type check while the
  development server is active.
- Preserve unrelated user changes and untracked source assets.

## Cubi continuation

The Cubi page currently has four custom sections:

1. `CubiPortal`: the original NFC tap demo.
2. `CubiLogoLab`: the real Cubi Base model with Claude and Bambu logo presets.
3. `CubiColourLab`: Cubi's original board-colour selector driving the real
   model materials.
4. `CubiWorkflow`: the customer journey from product choice and logo conversion
   through Stripe checkout, Cloudflare, Firestore, production and Bambu Studio.

The GLB is `public/models/cubi-base/Cubi-Base-2.glb`. The portfolio adapter is
`components/CubiBaseViewer.tsx`. Details and next steps are in
`docs/CUBI_HANDOFF.md`.
