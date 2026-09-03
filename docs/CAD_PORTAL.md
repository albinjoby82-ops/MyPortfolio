# CAD portal

A CAD document rendered as a window you can click through: one entry per Part
Studio and Assembly on the left, an interactive viewer in the middle, and a
parts/mates inspector on the right. It renders on
`/projects/gaelforce-ucd/` via `components/GaleForceCad.tsx`, and can be dropped
onto any other project page the same way.

| File | What it is |
|---|---|
| `content/cad.ts` | The documents and their tabs — **the file you edit** |
| `lib/cad.ts` | Types, Onshape URL parsing, Fusion embed URLs |
| `components/CadPortal.tsx` | Window shell: tab rail, inspector, mate controls |
| `components/CadModelViewer.tsx` | Three.js viewer: orbit, isolate, explode, mates |
| `scripts/onshape-sync.mjs` | Build-time export of an Onshape document |

---

## The one constraint to know about

**Onshape cannot be embedded in an iframe.** It sends frame-blocking headers, so
there is no equivalent of a YouTube embed — this is a long-standing and
still-open request on their forum, not a setting to flip. Anything claiming
otherwise is describing Fusion.

So the portal works the way Onshape actually allows:

- **Onshape tabs** → export the tab to glTF/GLB, commit it under
  `public/models/`, and the site renders it in the Three.js stack already used
  by the Cubi viewer. Full orbit/zoom/pan, per-part isolate and hide, an explode
  slider, and the assembly's mates as live degrees of freedom. Each tab also
  keeps a link out to the real document for anyone who wants the genuine
  article.
- **Fusion tabs** → Fusion's public share links *do* embed, so set `embed` to
  the share URL and the portal renders Autodesk's own viewer in an iframe. No
  export needed.

---

## Adding an Onshape document

### 1. Export the tabs

Automatically, for a whole document:

```bash
ONSHAPE_ACCESS_KEY=… ONSHAPE_SECRET_KEY=… \
  node scripts/onshape-sync.mjs \
  "https://cad.onshape.com/documents/<did>/w/<wid>" --slug galeforce
```

Keys come from <https://dev-portal.onshape.com/keys>. They are read from the
environment and never written to disk — and the site itself never calls Onshape,
so nothing ships to the browser. The script writes one `.glb` per tab into
`public/models/<slug>/`, plus `tabs.json`: a draft config with the mates already
transcribed.

Onshape has moved the glTF export between API paths across versions, so the
script tries the known ones and reports which answered. If both fail, set
`ONSHAPE_API_BASE` to a different version (e.g.
`https://cad.onshape.com/api/v11`) and re-run.

By hand, if you'd rather not deal with API keys: right-click the tab in Onshape
→ **Export** → glTF, and save it under `public/models/<slug>/`.

### 2. Paste the tabs into `content/cad.ts`

```ts
export const galeForceCadTabs: CadTab[] = [
  {
    id: 'drive-base',
    name: 'Drive base',
    kind: 'assembly',              // 'part-studio' | 'assembly' | 'drawing'
    summary: 'Chassis, drive pods and the mounting plate.',
    model: '/models/galeforce/drive-base.glb',
    href: 'https://cad.onshape.com/documents/<did>/w/<wid>/e/<eid>',
    mates: [ /* below */ ],
  },
];
```

Set `galeForceCadHref` to the public document URL while you're in there. Once
this array has entries the portal switches from the sample model to the real
one automatically.

### 3. Check the mate names

This is the one step the script cannot do for you. A mate's `moves` lists the
**GLB node names** it moves, but the glTF exporter does not always use the
Onshape instance name verbatim. Open the page, read the part names in the
inspector's Parts list, and make `moves` match them exactly.

---

## How the mates work

Each mate becomes one or two sliders — the degrees of freedom that mate leaves
open. Onshape's assembly definition gives every mate a mated coordinate system;
its origin and Z axis are exactly the `origin` and `axis` the viewer pivots
around, both in metres, matching the glTF export.

```ts
{
  id: 'shoulder',
  name: 'Shoulder hinge',        // shown next to the control
  type: 'revolute',              // 'revolute' | 'slider' | 'cylindrical'
  moves: ['Swing_Arm'],          // GLB node names
  origin: [-1.0, 0.6, 0],        // mate connector origin
  axis: [0, 0, 1],               // mate axis
  angle: { min: -35, max: 55 },  // degrees
}
```

A slider uses `travel` instead, in model units, with `scale`/`unit` controlling
only the number displayed (`{ scale: 1000, unit: 'mm' }` reads a metre-based
export in millimetres). A cylindrical mate takes both.

`parent` chains one mate onto another — a jaw that slides along an arm rides the
arm's hinge:

```ts
{ id: 'jaw-slide', type: 'slider', parent: 'shoulder', moves: ['Slide_Jaw'], … }
```

**What this is not:** a constraint solver. Each mate applies its own rotation or
translation about its own axis to the parts it names, so `moves` sets must not
overlap; use `parent` for parts that ride on other parts. A closed kinematic
loop (a four-bar linkage) cannot be driven this way. For everything else — a
hinge, a lift, a turret, a slide, a drive pod — it moves the way it does in
Onshape.

---

## Adding a Fusion model

No export needed:

1. In Fusion, right-click the design in the Data Panel → **Share Public Link**.
2. Add the tab with `embed` set to that URL. `fusionEmbedUrl()` appends
   Autodesk's `?mode=embed`, the same thing their Embed dialog produces.

```ts
{ id: 'body', name: 'Body', kind: 'part-studio', embed: 'https://a360.co/XXXXXXX' }
```

A Fusion tab shows Autodesk's viewer, so the parts list, explode slider and mate
controls do not apply to it — those are features of our own viewer.

---

## The sample model

`public/models/cad-demo/sample-mechanism.glb` is three boxes with one revolute
and one slider mate, wired up in `sampleCadDocument`. It exists so the portal is
explorable before any real export lands, and the section's copy says plainly
that it is a stand-in.

**Delete it** — the GLB, `sampleCadDocument`, and the sample branch of
`galeForceCadDocument` — once `galeForceCadTabs` has real entries.

---

## Performance notes

- Three.js is loaded through `next/dynamic` with `ssr: false`, so it stays out
  of the shared bundle and off every other page.
- The canvas runs `frameloop="demand"` — it renders on interaction, not
  continuously.
- Keep exports lean. Onshape's glTF export carries full tessellation; a
  multi-hundred-part assembly will be a large download. Export the assembly at a
  coarser tessellation, or split it into the sub-assemblies worth showing.
