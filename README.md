# Portfolio — Albin Andrews Joby

Personal engineering portfolio. Next.js (App Router) exported to fully static
HTML, deployed on Cloudflare Pages.

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
- `public/albin-joby-cv.pdf` — the file behind the Résumé button

## Design

`design-reference/` holds the original design handoff. `README.md` in there is
the source of truth for colours, type and spacing. `support.js` is a prototype
runtime and is **not** used by this site.

## Deploying

Cloudflare Pages, connected to this repo:

- Build command: `npm run build`
- Output directory: `out`
