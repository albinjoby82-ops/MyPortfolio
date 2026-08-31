# Agent handoff

Context for an agent picking up this project cold. Read this before touching
anything. Last updated 31 Aug 2026.

---

## What this is

A personal engineering portfolio for **Albin Andrews Joby**, first-year
Engineering at UCD. Built from a supplied high-fidelity design handoff, not
designed from scratch.

- **Repo:** https://github.com/albinjoby82-ops/MyPortfolio (public, `main`)
- **Local path:** `D:\My Portfollio` (note the typo in the folder name; it is
  the real path)
- **Deployment target:** Cloudflare Pages — **not yet connected**

The site is meant to last four university years and accumulate many projects.
Every architectural decision favours "adding project #23 in 2029 is dropping
one file in a folder" over short-term convenience. Do not undo that.

---

## Stack

| | |
|---|---|
| Framework | Next.js 15, App Router, TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config`) |
| Content | Markdown + YAML frontmatter in `content/projects/*.mdx` |
| Markdown rendering | `react-markdown` + `remark-gfm`, in a server component |
| Fonts | `next/font/google` — Bricolage Grotesque, Public Sans |
| Build | `output: 'export'` → static HTML in `out/` |
| Node | v24, npm v11 |

`npm audit` is currently clean. `postcss` is pinned to `^8.5.23` in
devDependencies specifically to resolve a transitive advisory — don't downgrade
it.

---

## Read these first

1. **`design-reference/README.md`** — the design handoff. This is the **source
   of truth** for every colour, font size, spacing value, border and shadow.
   When in doubt, it wins over anything you infer from the code.
2. **`design-reference/Portfolio Bright.dc.html`** — the approved mock (Home +
   Project Detail), for visual reference.
3. `design-reference/support.js` — a prototype template runtime.
   **Do not port or use it.** The handoff says so explicitly.

The mock's placeholder persona is "Maya O., Grade 11, Toronto" with five hobby
builds. That is **not** the site's content — the design is the deliverable, the
words are not.

---

## Editorial rules — these are decisions, not oversights

### 1. No job titles, anywhere

The site never states a position held. Not "Robotics Officer", not "OCM", not
"Hack Club Director" — even though the CV leads with them.

Content describes **what was done**: things built, events run. UCD ElecSoc may
be named as *context* ("hosted by UCD ElecSoc") but never as a position.

**Why:** Albin decided the ElecSoc role structure is messy and easily misread
from outside — he was OCM one year, then Hack Club director, then left. Titles
also age badly, while "set up this event in 2026" stays true permanently.

**Micromouse specifically** is written in past tense around work done (wrote the
format and technical rules, secured sponsorship, set up operations), with no
claim of ongoing involvement and no mention of his departure. Keep it that way.

### 2. Never invent project facts

Several projects are still scaffolds with `TODO` markers where a real build
story, spec or photo belongs. **Leave them as TODO.** Do not fill them with
plausible-sounding invented detail.

The two note cards ("What went wrong" / "What I learned") are the most
convincing thing on a detail page precisely because they are specific and true.
Fabricated ones actively damage the site. Wait for Albin to supply the facts.

### 3. Content comes from Albin, in his register

The voice is plain, concrete, slightly self-deprecating — matching the mock's
tone ("a lot of failed prints"). Avoid corporate portfolio language.

---

## Architecture

```
app/
  layout.tsx              fonts, <Nav/>, the 1440px page shell
  page.tsx                Home — hero, bench panel, project list, contact band
  projects/[slug]/page.tsx  Detail — generateStaticParams over the MDX files
  timeline/page.tsx       Timeline
  not-found.tsx           404
  globals.css             ALL design tokens live here
components/
  Nav.tsx                 client (needs usePathname for active state)
  Panel.tsx               shared by "On the bench" and "The numbers"
  ProjectRow.tsx          one project card; whole row is one link
  ProjectList.tsx         client — filter chips + rows
  ContactBand.tsx         dark footer band
  Prose.tsx               long-form markdown renderer
lib/projects.ts           reads/sorts/types the MDX frontmatter
content/
  site.ts                 name, hero copy, bench rows, contact links
  timeline.ts             timeline entries
  projects/*.mdx          one file per project
public/albin-joby-cv.pdf  the Résumé ↓ button target
```

### Design tokens

All in `app/globals.css` under `@theme`, transcribed from the handoff README.
Tailwind v4 generates utilities from them: `--color-rust` → `text-rust`,
`--font-display` → `font-display`, etc.

**The signature visual move** is `box-shadow: 4px 4px 0 #16181D` paired with
`border: 2px solid #16181D` on white cards. Hard offset, **no blur**. The
handoff says do not soften it. Use the `--shadow-hard` token.

Hover on a card lifts it 2px and grows the shadow to `--shadow-hard-lifted`
over 120ms. `prefers-reduced-motion` is handled globally in `globals.css`.

Focus rings are a 2px rust outline at 2px offset, set once on `:focus-visible`.
Never remove outlines.

### The `.gutter` utility

44px horizontal padding, dropping to 20px below 760px. Use it on every
full-width section instead of hardcoding padding.

---

## Adding or editing a project

Drop a `.mdx` file into `content/projects/`. Home page, filter chips and the
detail route all follow automatically.

```yaml
---
slug: my-project          # → /projects/my-project
order: 1                  # lower sorts first; omit to sort by year
kind: Robotics            # Robotics | Hardware | Electronics | Events
title: My project
year: "2026"              # display string
sortYear: 2026            # numeric, fallback sort key
tint: "#C6E4F5"           # card colour; palette in the design README
blurb: "1–2 sentences for the project row."
lede: "Opening paragraph for the detail page."
tags: ["Fusion 360", "KiCad"]
links:                    # optional — first renders as the primary button
  - { label: "example.com", href: "https://example.com" }
media:
  type: photo             # photo | video
  src: /projects/my-project/hero.jpg
  caption: "What's in the shot"
specs:                    # 4–6 rows; renders "The numbers" panel
  - { key: "Reach", value: "62 cm" }
notes:                    # exactly 2 reads best (2-up grid)
  - heading: "What went wrong"
    body: "Be specific. This card carries the page."
photos: ["/projects/my-project/1.jpg"]   # square crops
---

Optional long-form markdown. Renders as a "The build" section.
```

Every section is conditional — empty arrays and missing bodies are skipped
cleanly, so partial content renders fine.

### Kinds and filter chips

Defined in `content/site.ts` as `KINDS`. A chip only appears if a project
actually uses that kind. Adding a new kind means editing that array.

### Ordering

`order` exists because pure newest-first buried the two strongest builds
(GaelForce, Cubi) under events. Current order: GaelForce 1, Cubi 2, Micromouse
3, PCB builds 4, MakerLabs 5, Robo Expo 6. Don't switch back to date-only sort.

---

## Gotchas

**Never run `npm run build` while `npm run dev` is running.** Both write to
`.next/`; the build overwrites the chunks the dev server holds in memory and
every route starts 500-ing with `Cannot find module './435.js'`. Recovery:
stop the server, `rm -rf .next out`, restart. This has already happened once.

**Heading levels in `Prose.tsx` are shifted down one.** A `##` in markdown
renders as `<h3>`, `###` as `<h4>`. The page already owns `h1`/`h2`, so this
keeps the document outline valid. Preserve it if you touch that file.

**`Prose` is a server component.** All markdown is rendered at build time and
costs zero client JS. Don't add `"use client"` to it or import it into a client
component.

**Windows line endings.** Git warns about LF→CRLF on nearly every file. It's
noise, not a problem.

**The browser preview pane fails to repaint** on very tall pages (the Cubi page
is ~5500px) after scrolling — screenshots come back blank. The page is fine.
Verify with `read_page`, `get_page_text` or a JS query rather than chasing it.

---

## Current state

**Done:** all four page types build and render, responsive down to 375px,
keyboard focus rings, reduced motion, clean `npm audit`, clean static export
(11 pages).

**Written up:** Cubi only — full multi-section build write-up plus a live-site
link to `cubi-3d.com`.

**Still scaffolds** (real CV facts in the frontmatter, `TODO` in the notes):
GaelForce UCD, Dublin Micromouse Open, PCB & embedded builds, MakerLabs,
Robo Expo.

**No photos at all.** Every media slot renders a tinted placeholder that looks
deliberate. Real assets go in `public/projects/<slug>/`.

---

## Open questions for Albin

Ask; don't decide these unilaterally.

1. **Wordmark** — currently `ALBIN J.`; full name instead?
2. **Third contact row** — stubbed to `#` in `content/site.ts`, needs his
   LinkedIn or Instagram.
3. **Crediting Claude/Codex** — his Cubi brief credited them as development
   collaborators. It was deliberately left off the page (it invites a reader to
   discount the work, and his CV already lists AI-assisted development as a
   skill). He hasn't ruled on it.
4. **About page** — nav has no link to one; not designed. Timeline covers the
   chronology for now.

---

## Next steps, in priority order

1. **GaelForce write-up** — it leads the page and is the weakest-to-strongest
   gap. Needs: specs, two real notes, a lede.
2. **A photo for Cubi** — that page is a wall of text with a yellow placeholder
   where the hero should be.
3. Remaining four write-ups.
4. **Connect Cloudflare Pages:** dashboard → Workers & Pages → Create → Pages →
   Connect to Git → `MyPortfolio`. Build command `npm run build`, output
   directory `out`. Pushes to `main` then auto-deploy.
5. Custom domain, once one exists (`site.url` in `content/site.ts` is a
   placeholder).

---

## Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → ./out   (stop dev first!)
npx serve out    # sanity-check the exported build
```
