# Portable modules

Two self-contained features live in this repo and are meant to be copied into
other projects: a **social widget pack** (LinkedIn / Instagram) and a **CAD
portal** (Onshape / Fusion).

**If you are an agent working in a different repository and were pointed here:**
read the module section you need end to end before copying anything. The
constraints listed are platform behaviour, not preferences — ignoring them
produces code that silently renders nothing. Copy the files in the manifest
verbatim, then do the rename pass and the verification pass at the bottom.

Deep, project-specific usage lives in `docs/SOCIAL_FEED.md` and
`docs/CAD_PORTAL.md`. This file is the porting contract.

---

## Layout convention

Both modules follow the same three-layer split, and the layers matter when
copying:

| Layer | Files | Portable? |
|---|---|---|
| **Library** | `lib/social.ts`, `lib/cad.ts` | Yes — zero imports, pure TypeScript |
| **Components** | `components/Social*.tsx`, `components/Cad*.tsx`, their `.css` | Yes — import only React, the library and their own CSS |
| **Config + wrapper** | `content/social.ts`, `content/cad.ts`, `components/GaleForce*.tsx` | No — rewrite these per project |

No component imports from `content/`. That coupling exists only in the
wrappers, which you replace anyway. Do not reintroduce it.

## Host requirements (both modules)

- **React 18 or 19.**
- **A bundler that allows `import './Thing.css'` from a component.** Next.js,
  Vite and CRA all do. If yours does not, concatenate the CSS files into your
  global stylesheet and delete the import lines.
- **The `@/*` path alias** mapped to the repo root, or rewrite the imports to
  relative paths. Here it is set in `tsconfig.json`.
- **Next.js App Router** for the components marked `'use client'`. In a plain
  React app, delete the `'use client'` lines; in the CAD portal also replace
  `next/dynamic` with `React.lazy` + `<Suspense>`.
- **Tailwind is not required.** All styling is plain CSS in the module's own
  `.css` file, scoped by class prefix (`social*`, `cad*`).

Two host tokens are referenced and both need a fallback if you do not have
them:

| Token | Used for | If you do not have it |
|---|---|---|
| `.gutter` utility | Section horizontal padding | Add `.gutter { padding-inline: 44px }` (20px under 760px), or drop the class |
| `--font-bricolage` | Display headings | Already written as `var(--font-bricolage), sans-serif` — falls back on its own |

Colours are hard-coded per module as CSS custom properties at the top of each
`.css` file (`--social-ink`, `--cad-ink`, …). Retheme there, in one place.

---

# Module A — Social widgets

Two independent pieces. Take either without the other.

| Piece | Does | Needs a backend? |
|---|---|---|
| `SocialPost` | Embeds **one chosen post** via the network's official embed iframe | No |
| `SocialFeed` | Pulls the **latest posts** and renders cards with network filters | Yes — a JSON endpoint you control |

### Manifest

```
lib/social.ts                  types, feed normalising, embed URL parsing
components/SocialPost.tsx      single-post embed        (server component, no 'use client')
components/SocialFeed.tsx      live feed                ('use client')
components/SocialWindows.css   shared styling for both
```

No npm dependencies beyond React.

### Constraints — read before promising anything

1. **Neither LinkedIn nor Instagram can be called directly from a browser.**
   Both require a secret and both refuse cross-origin requests. A token in
   frontend code is a leaked token. `SocialFeed` therefore fetches from *one
   endpoint you own* that holds the credentials server-side.
2. **LinkedIn embeds only render publicly-shared posts.** A connections-only
   post yields an empty box, and nothing in the code can change that.
3. **Instagram CDN image URLs expire.** Cache preview images on your own side
   and serve your URL in the feed's `image` field; hotlinking will rot.

### Integration

1. Copy the four files.
2. Create your own config module (model it on `content/social.ts`): the account
   list, the endpoint URL, and a curated fallback array.
3. Set the endpoint at build time. In Next.js the variable must be
   `NEXT_PUBLIC_`-prefixed to reach the browser, and its value is therefore
   **public** — put nothing secret in the URL.
4. Render:

```tsx
<SocialFeed endpoint={endpoint} fallback={curated} accounts={accounts} limit={6} />
<SocialPost network="instagram" post="https://www.instagram.com/p/ABC123/" />
```

`post` accepts a full post URL, a LinkedIn `urn:li:activity:…`, or a bare
Instagram shortcode — `lib/social.ts` normalises all three.

### Feed data contract

The endpoint returns either a bare array or `{ "items": [...] }`:

```json
{ "items": [ {
  "id": "urn:li:activity:7000000000000000000",
  "network": "linkedin",
  "url": "https://www.linkedin.com/feed/update/urn:li:activity:70000.../",
  "text": "Post text as published.",
  "image": "https://media.example.com/preview.jpg",
  "postedAt": "2026-08-12T09:30:00Z"
} ] }
```

`url` is required and must be http(s); `network` is inferred from the URL when
omitted; `postedAt` is ISO 8601 and drives sorting. `normaliseFeed()` drops
anything unparseable, so a partly broken feed degrades to fewer cards rather
than a broken page. The endpoint must send CORS headers for your origin and
should cache for 10–30 minutes.

Failure behaviour is deliberate: on a non-2xx, a network error, or an empty
result, the widget logs a warning and renders the curated fallback. It never
shows an error state to a visitor.

---

# Module B — CAD portal

A CAD document as a window you click through: a tab rail of Part Studios and
Assemblies, an interactive viewer, and a parts/mates inspector.

### Manifest

```
lib/cad.ts                     types, Onshape URL parsing, Fusion embed URLs, mate ordering
components/CadPortal.tsx       window shell: tab rail, inspector, mate controls ('use client')
components/CadModelViewer.tsx  Three.js viewer: orbit, isolate, explode, mates ('use client')
components/CadPortal.css       all styling
scripts/onshape-sync.mjs       build-time Onshape export (Node 18+, optional)
```

Dependencies, versions as used here:

```
three@^0.175  @react-three/fiber@^9  @react-three/drei@^10
```

`CadPortal` is the only import you need; it lazy-loads the viewer itself.

### Constraints — read before promising anything

1. **Onshape cannot be embedded in an iframe.** It sends frame-blocking
   headers. This is long-standing, still open on their forum, and not a setting
   anyone can flip. Do not build toward an Onshape iframe; do not tell a user it
   is possible. Onshape tabs render a **glTF/GLB export** instead, plus a link
   out to the live document.
2. **Fusion is the opposite** — public share links embed fine. Set `embed` to
   the share URL and Autodesk's viewer renders in an iframe. Fusion tabs get no
   parts list, explode or mates; those belong to our viewer, not Autodesk's.
3. **The mate system drives degrees of freedom; it does not solve
   constraints.** Each mate applies its own rotation/translation about its own
   axis to the parts it names. Hinges, lifts, turrets, slides and drive pods
   work. A closed kinematic loop (four-bar linkage) does not, and no amount of
   config will make it.
4. **`moves` lists GLB node names, not Onshape instance names.** The glTF
   exporter does not always preserve them. After wiring a model, read the part
   names the inspector prints and make `moves` match exactly. This is the single
   most common reason a mate appears to do nothing.
5. **`moves` sets must not overlap.** Use `parent` to chain a mate onto another
   for parts that ride on other parts.

### Integration

1. Copy the files, install the three dependencies.
2. Export each CAD tab to glTF/GLB into your `public/` (or equivalent static)
   directory — either `scripts/onshape-sync.mjs`, or by hand in Onshape via
   right-click tab → Export → glTF.
3. Describe the document and render it:

```tsx
import CadPortal from '@/components/CadPortal';
import type { CadDocument } from '@/lib/cad';

const doc: CadDocument = {
  id: 'drive-base',
  name: 'Drive base',
  provider: 'onshape',                 // 'onshape' | 'fusion' | 'other'
  href: 'https://cad.onshape.com/documents/<did>/w/<wid>',
  tabs: [
    {
      id: 'chassis',
      name: 'Chassis',
      kind: 'part-studio',             // 'part-studio' | 'assembly' | 'drawing'
      model: '/models/drive-base/chassis.glb',
      href: 'https://cad.onshape.com/documents/<did>/w/<wid>/e/<eid>',
    },
    {
      id: 'assembly',
      name: 'Drive base',
      kind: 'assembly',
      model: '/models/drive-base/assembly.glb',
      mates: [
        {
          id: 'shoulder',
          name: 'Shoulder hinge',
          type: 'revolute',            // 'revolute' | 'slider' | 'cylindrical'
          moves: ['Swing_Arm'],        // GLB node names — verify against the inspector
          origin: [-1.0, 0.6, 0],      // Onshape matedCS origin, metres
          axis: [0, 0, 1],             // Onshape matedCS zAxis
          angle: { min: -35, max: 55 },
        },
        {
          id: 'jaw',
          name: 'Jaw slide',
          type: 'slider',
          parent: 'shoulder',          // rides the arm
          moves: ['Slide_Jaw'],
          origin: [0.9, 0.95, 0],
          axis: [1, 0, 0],
          travel: { min: -0.9, max: 0.25, scale: 1000, unit: 'mm' },
        },
      ],
    },
  ],
};

<CadPortal document={doc} kicker="CAD" title="…" intro="…" />;
```

`travel` is in the GLB's own units; `scale`/`unit` affect only the displayed
number (`{ scale: 1000, unit: 'mm' }` reads a metre-based export in
millimetres). A tab with neither `model` nor `embed` renders an instructive
empty state rather than breaking.

### The sync script

```bash
ONSHAPE_ACCESS_KEY=… ONSHAPE_SECRET_KEY=… \
  node scripts/onshape-sync.mjs "https://cad.onshape.com/documents/<did>/w/<wid>" --slug myproject
```

Writes one `.glb` per tab into `public/models/<slug>/`, plus `tabs.json`: a
config draft with the mates already transcribed from Onshape's assembly
definition. Keys are read from the environment and never written to disk; the
site never calls Onshape at runtime.

Onshape has moved the glTF export between API paths across versions, so the
script tries the known ones and reports which answered. If both fail, set
`ONSHAPE_API_BASE` (e.g. `https://cad.onshape.com/api/v11`) and re-run. **This
script has not been run against a live document from this repo** — no API keys
were available — so treat its first real run as needing supervision.

### Performance

Load the portal through `next/dynamic` (or `React.lazy`) so Three.js stays out
of your shared bundle; `CadPortal` already does this for the viewer. The canvas
runs `frameloop="demand"` — it renders on interaction, not continuously. Keep
exports lean: Onshape's glTF carries full tessellation, so a several-hundred-part
assembly is a large download. Split it into the sub-assemblies worth showing.

---

# Rename pass

After copying, before shipping:

- [ ] Replace the `GaleForce*` wrapper components with your own, or render
      `SocialFeed` / `SocialPost` / `CadPortal` directly.
- [ ] Write your own config module; do not copy this project's `content/*.ts`
      values.
- [ ] Retheme via the CSS custom properties at the top of each `.css` file.
- [ ] Delete the sample CAD model (`public/models/cad-demo/`,
      `sampleCadDocument`) once you have a real export. It is a stand-in — three
      boxes with two mates — and it is labelled as such in the UI. Never present
      it as a real part of any project.
- [ ] Remove the `.gutter` class from the section elements if your project has
      no such utility.

# Verification pass

Type-checking and a successful build do **not** prove either module works — both
render correctly to HTML while doing nothing useful. Verify in a real browser:

**Social:** load the page with the endpoint unset and confirm the curated
fallback renders; point the endpoint at a stub returning the JSON above and
confirm the cards change; confirm a pinned `SocialPost` iframe loads a real
post.

**CAD:** confirm the part list fills from the GLB (proves it parsed), then check
that Solo, the explode slider and each mate slider **change actual pixels** —
screenshot the canvas before and after and compare the buffers. DOM state
changing is not evidence the 3D scene changed. Also switch between two tabs
backed by the same GLB; that path does not remount on the model URL alone and
regressed once already.

Both were verified this way here, at 1440px and 420px viewport widths, with
Playwright driving headless Chromium (`--use-gl=swiftshader` for WebGL).
