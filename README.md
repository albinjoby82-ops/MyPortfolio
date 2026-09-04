# Portfolio — Albin Andrews Joby

Personal engineering portfolio. Next.js (App Router) exported to fully static
HTML and deployed with Cloudflare Workers Static Assets.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export into ./out
```

## Adding a project

Drop a new `.mdx` file into `content/projects/`. The home page, the filter
chips and the project's own detail page all follow automatically — nothing
else needs editing.

```yaml
---
slug: my-project          # becomes /projects/my-project
order: 1                  # lower sorts first; omit to sort by year
kind: Robotics            # Robotics | Hardware | Electronics | Events
title: My project
year: "2026"
sortYear: 2026
tint: "#C6E4F5"           # card colour; see the palette in the design README
blurb: "One or two sentences for the project row."
lede: "A longer opening paragraph for the detail page."
tags: ["Fusion 360", "KiCad"]
media:
  type: photo             # photo | video
  src: /projects/my-project/hero.jpg
  caption: "What's happening in the shot"
specs:
  - { key: "Reach", value: "62 cm" }
notes:
  - heading: "What went wrong"
    body: "The most convincing thing on the page. Be specific."
photos: ["/projects/my-project/1.jpg"]
---
```

Anything below the frontmatter is optional long-form content.

Files currently carry `TODO` markers wherever a real build story, spec or
photo still needs to be supplied.

## Other content

- `content/site.ts` — name, hero copy, "On the bench" panel, contact links
- `content/timeline.ts` — the timeline entries
- `content/social.ts` — LinkedIn/Instagram accounts, feed endpoint, pinned posts
- `content/cad.ts` — CAD documents, their tabs and mates
- `public/albin-joby-cv.pdf` — the file behind the Résumé button

## Reusable modules

Two features here are written to be copied into other projects:

- **Social widgets** — a live LinkedIn/Instagram feed plus single-post embeds.
  Setup: `docs/SOCIAL_FEED.md`.
- **CAD portal** — an Onshape/Fusion document as a clickable window with a tab
  rail, a Three.js viewer and the assembly's mates as live controls. Setup:
  `docs/CAD_PORTAL.md`.

To lift either into another repository, follow `docs/PORTABLE_MODULES.md` — file
manifests, dependencies, data contracts and the platform limits that matter
(most importantly: Onshape cannot be embedded in an iframe, and neither social
API can be called from a browser).

## Design

`design-reference/` holds the original design handoff. `README.md` in there is
the source of truth for colours, type and spacing. `support.js` is a prototype
runtime and is **not** used by this site.

## Deploying

The repository includes `wrangler.jsonc`, which builds the static export and
uploads `out/` as a Cloudflare Worker with static assets.

```bash
npm run deploy:dry  # build and validate without uploading
npm run deploy      # build and deploy to Cloudflare
```

For Cloudflare Workers Builds, the deploy command can remain
`npx wrangler deploy`. Wrangler reads the checked-in configuration, runs
`npm run build`, then uploads the `out/` directory directly.
