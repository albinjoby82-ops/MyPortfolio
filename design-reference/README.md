# Handoff: Engineering Portfolio Website

## Overview
A personal portfolio website for a Grade 11 student who builds robots, circuit boards, and mechanical projects. The site's job is to make a young builder look credible and human — showing real projects, what broke, and what they learned — without reading like a corporate product page or a generic template.

Two screens are designed: **Home** (hero + project index + contact) and **Project Detail**. Timeline, About, and mobile layouts are not yet designed.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, **not production code to copy directly**. `Portfolio Bright.dc.html` uses a custom template runtime (`support.js`) with `{{ }}` holes and `<sc-for>` loops; do not port that runtime.

The task is to **recreate these designs in the target codebase's environment** using its established patterns. If no codebase exists yet, Next.js (App Router) + Tailwind is a good fit: the design is static content with no auth, no data fetching, and would deploy well to Vercel with project data in MDX or a local JSON file.

## Fidelity
**High-fidelity.** Colors, typography, spacing, borders, and shadows are final and exact. Recreate pixel-perfectly at 1440px desktop width. Hover/focus states and mobile layouts are **not** specified in the mock — see "Gaps to fill" at the bottom.

---

## Design Tokens

### Colors
| Token | Hex | Use |
| --- | --- | --- |
| `ink` | `#16181D` | Text, all borders, hard shadows, dark footer band |
| `paper` | `#FBF8F1` | Page background |
| `card` | `#FFFFFF` | Project row cards, note cards |
| `desk` | `#E6E2D8` | Canvas behind the page (browser bg / body) |
| `rust` | `#D4451F` | Primary accent — links, primary button, index numbers |
| `rust-hover` | `#A8330F` | Link hover |
| `sun` | `#F5C63C` | Résumé button, hero tag, email row |
| `body-text` | `#4A473E` | Paragraph text |
| `sub-text` | `#3B3931` | Nav links, spec values |
| `muted` | `#87837A` | Labels, captions, spec keys |
| `footer-muted` | `#A9A498` | Paragraph text on ink background |
| `chip-bg` | `#F1EDE2` | Tool tag pills, empty photo slots |
| `hairline` | `#D8D3C6` | Inactive filter chip border |
| `footer-border` | `#3A3C43` | Outline buttons on ink background |

**Project tints** (each project card gets one; media thumbnail background):
`#C6E4F5` (blue) · `#F5C63C` (yellow) · `#EE8570` (coral) · `#C8E6A0` (green) · `#E4DDCC` (sand)

### Typography
- **Display** — Bricolage Grotesque (Google Fonts), weights 700 / 800. Used for h1/h2/h3, logo, section eyebrows, year labels, index numbers.
- **Body** — Public Sans (Google Fonts), weights 400 / 500 / 600 / 700. Everything else.

| Role | Family | Size | Weight | Line-height | Letter-spacing |
| --- | --- | --- | --- | --- | --- |
| Hero h1 | Bricolage | 86px | 800 | 0.94 | -0.04em |
| Detail h1 | Bricolage | 68px | 800 | 0.96 | -0.035em |
| Footer h2 | Bricolage | 46px | 800 | 1.02 | -0.03em |
| Project title | Bricolage | 34px | 700 | normal | -0.025em |
| Note card h3 | Bricolage | 26px | 700 | normal | -0.02em |
| Logo | Bricolage | 21px | 800 | normal | -0.02em |
| Section eyebrow | Bricolage | 15px | 700 | normal | 0.14em, UPPERCASE |
| Panel header | Public Sans | 12px | 700 | normal | 0.12em, UPPERCASE |
| Hero lede / detail lede | Public Sans | 19px | 400 | 1.6 | normal |
| Footer lede | Public Sans | 17px | 400 | 1.6 | normal |
| Body paragraph | Public Sans | 16px | 400 | 1.65 | normal |
| Project blurb | Public Sans | 15.5px | 400 | 1.55 | normal |
| Nav link / button | Public Sans | 15–16px | 600–700 | normal | normal |
| Spec row | Public Sans | 14.5px | 400 key / 700 value | normal | normal |
| Caption | Public Sans | 13.5px | 600 | normal | normal |
| Tag pill / filter chip | Public Sans | 13px | 600 | normal | normal |

Long paragraphs use `text-wrap: pretty` and a `max-width` in `ch` (see per-component notes).

### Spacing, radius, shadow
- Page gutter: **44px** left/right on all sections.
- Section vertical rhythm: 70px top / 52px bottom (hero), 56px bottom (project list), 56px (footer band), 44px (detail sections).
- Radii: page shell **20px** · project rows & note cards **16px** · spec panel & hero video **14–16px** · buttons & media thumbs **10px** · tag pills & tags **6px** · filter chips **999px**.
- **Signature shadow:** `box-shadow: 4px 4px 0 #16181D` on white cards, paired with `border: 2px solid #16181D`. Hard offset, no blur — this is the defining visual move; do not soften it.
- Page shell shadow: `0 20px 56px rgba(30,26,18,0.12)`.
- Border weights: **2px** solid ink for structural borders (nav bottom, section divider, cards, panels, buttons); 1px `#D8D3C6` only for inactive filter chips.

---

## Screens

### 1. Home

**Layout:** single column, 1440px wide shell on the `desk` background, 20px radius, `overflow: hidden`.

#### Nav bar
- Flex, space-between, align center. Padding `20px 44px`. Bottom border 2px ink.
- Left: wordmark `MAYA O.` (Bricolage 21px/800).
- Right: flex row, gap 30px — `Projects` (active: 2px rust bottom border, 2px padding-bottom), `Timeline`, `About`, then a **Résumé ↓** button: `padding: 10px 20px`, 2px ink border, radius 10px, background `sun`, weight 700.

#### Hero
- Grid `1fr 400px`, gap 56px, align-items start, padding `70px 44px 52px`.
- **Left column:**
  - Tag: inline-block, background `sun`, `padding: 6px 12px`, radius 6px, 13px/700, letter-spacing 0.06em, UPPERCASE, `transform: rotate(-1.2deg)`, margin-bottom 24px. Copy: "Grade 11 · builds stuff that moves"
  - h1: 86px Bricolage 800, `max-width: 12ch`. Copy: "Robots, circuit boards, and a lot of failed prints."
  - Button row: flex, gap 12px, margin-top 36px. Primary — `padding: 14px 26px`, radius 10px, background `rust`, white, 700/16px, "See what I've built". Secondary — same padding/radius, 2px ink border, transparent, "Email me".
- **Right column — "On the bench" panel:** 2px ink border, radius 14px, `overflow: hidden`. Header strip: ink background, paper text, `padding: 10px 16px`, 12px/700/0.12em UPPERCASE, "On the bench". Body: 18px padding, flex column gap 14px; each row is space-between with a muted key and a 700-weight value.
  - Right now / Gripper v3 · Learning / Inverse kinematics · Broke last / A stepper driver · Where / Toronto, ON

#### Project list header
- Top border 2px ink, `padding: 20px 44px 24px`, flex space-between, align baseline.
- Left: "Five things I made" (Bricolage 15px/700/0.14em UPPERCASE).
- Right: filter chips, flex gap 8px, 13px/600. Active chip: ink background, paper text, `padding: 6px 14px`, radius 999px. Inactive: 1px `#D8D3C6` border, `sub-text` color. Chips: All (active) · Robots · Electronics · Just for fun.

#### Project rows (×5)
Flex column, gap 18px, padding `0 44px 56px`. Each row:
- Grid `300px 1fr 130px`, gap 28px, align center. White background, 2px ink border, radius 16px, 18px padding, `box-shadow: 4px 4px 0 #16181D`.
- **Media (col 1):** `aspect-ratio: 4/3`, radius 10px, background = that project's tint, centered 13px/700 label at `rgba(22,24,29,0.45)` — "video ▶" or "photo". In production this is the project's real hero image/video thumbnail; video items overlay a play affordance.
- **Body (col 2):** number (Bricolage 13px/700, rust) + kind (12px/700/0.1em UPPERCASE, muted) in a flex row gap 10px, margin-bottom 8px. Title (Bricolage 34px/700). Blurb (15.5px, line-height 1.55, `max-width: 60ch`, `text-wrap: pretty`), margin-bottom 14px. Tag pills: flex gap 8px, each `padding: 5px 12px`, radius 6px, background `chip-bg`, 13px/600.
- **Meta (col 3):** right-aligned. Year (Bricolage 15px/700), then a 24px `↗` glyph with 10px top margin.

**Project data:**
| # | Kind | Title | Blurb | Tags | Year | Tint | Media |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | Robots | The robot arm | Six joints, 3D printed, running on a driver board I designed. Three versions before it could pick something up twice in a row. | Fusion 360, KiCad, C++ | 2026 | #C6E4F5 | video |
| 02 | Electronics | Bench power supply | 0–30V adjustable. My first PCB that worked on the first power-up instead of releasing smoke. | KiCad, Soldering | 2025 | #F5C63C | photo |
| 03 | Robots | Line-following car | Won regionals with a PID loop I tuned at 1am the night before. Still don't fully trust it. | Arduino, PID | 2025 | #EE8570 | video |
| 04 | Just for fun | Automatic plant waterer | Built because I kept killing my mom's basil. It has now kept the basil alive for 14 months. | ESP32, 3D print | 2024 | #C8E6A0 | photo |
| 05 | Just for fun | Coffee grinder mod | Added a timer and a scale to a $30 grinder. Mostly an excuse to learn load cells. | Arduino, Load cell | 2023 | #E4DDCC | photo |

#### Contact band
- Full-bleed ink background, `padding: 56px 44px`, grid `1fr 1fr`, gap 56px, align center.
- Left: h2 46px Bricolage 800, paper color — "Want to see something in person?" Below, 17px `footer-muted` paragraph, `max-width: 44ch` — "I'm always up for talking about a build, joining a team, or helping someone else get started."
- Right: flex column gap 12px, three rows, each space-between with a trailing `↗`, `padding: 18px 22px`, radius 12px, 17px/700.
  - Email row: `sun` background, ink text — "maya@example.com"
  - GitHub + Instagram rows: 2px `#3A3C43` border, paper text.

---

### 2. Project Detail

Same shell, same nav (no active underline on this screen).

- **Breadcrumb:** "← Back to projects", 13px/700, muted, margin-bottom 20px. Section padding `52px 44px 36px`.
- **Header grid** `1fr 380px`, gap 56px, align-items **end**.
  - Left: category tag — inline-block, background = project tint (`#C6E4F5` here), `padding: 5px 12px`, radius 6px, 12px/700/0.1em UPPERCASE, "01 · Robots". h1 68px Bricolage 800 — "The robot arm". Lede 19px/1.6, `max-width: 56ch`.
  - Right: **"The numbers"** panel — identical construction to the "On the bench" panel (13px row gap). Rows: Reach / 62 cm · Lifts / 400 g · Motors / 6 steppers · Brain / Teensy 4.1 · Took me / 8 months · Cost / ~$310.
- **Hero video:** `aspect-ratio: 16/8`, 2px ink border, radius 16px, background = project tint. Centered play button: 74px circle, ink background, paper `▶` glyph at 22px. Caption below at 10px margin, 13.5px/600, muted.
- **Two note cards:** grid `1fr 1fr`, gap 18px. White, 2px ink border, radius 16px, 28px padding, `4px 4px 0` ink shadow. Each has a Bricolage 26px/700 heading and a 16px/1.65 paragraph.
  - "What went wrong" — Version 1 used cheap plastic gears and the whole arm wobbled about 4 mm at the tip. I replaced them with belt drives I could tighten, which fixed the wobble but made the arm heavier — so I had to reprint the top two links thinner.
  - "What I learned" — Measure before you print. I wasted about 40 hours of print time on parts that were 2 mm off. Now I print a small test piece of every joint first — takes 15 minutes and has saved me more times than I can count.
- **Build photos:** eyebrow "Build photos" (Bricolage 15px/700/0.14em UPPERCASE), then a 4-column grid, gap 14px, of `aspect-ratio: 1` tiles — 2px ink border, radius 12px, `chip-bg` fill. These are placeholders for real photos.

---

## Interactions & Behavior

Specified by the design intent; hover/active states were not drawn in the mock, so these are the recommended implementations consistent with the style:

- **Project row hover:** lift the card — translate `-2px, -2px` and grow the hard shadow to `6px 6px 0 #16181D`, 120ms ease-out. Cursor pointer; whole row is one link to the detail page.
- **Buttons hover:** primary darkens `#D4451F → #A8330F`; outline buttons fill `#16181D` with paper text. Same 120ms.
- **Filter chips:** client-side filter of the project list, no page navigation. Clicking a chip makes it active (ink fill) and deactivates the others; "All" resets. Inactive chip hover: border darkens to ink. Animate the list with a simple fade/reflow, not a heavy layout animation.
- **Nav active state:** 2px rust underline on the current section.
- **Video:** thumbnails are click-to-play; the detail hero plays inline (native controls are fine). Do not autoplay with sound.
- **Focus states:** every interactive element needs a visible keyboard focus ring — use a 2px rust outline with 2px offset. The design is high-contrast already; do not remove outlines.
- **Reduced motion:** respect `prefers-reduced-motion` and drop the hover translate.

## Responsive behavior
Not designed yet — implement these rules:
- Below ~1000px: hero, detail header, and contact band collapse to single column; spec panels move below the text.
- Below ~760px: project rows stack — media on top full-width (keep 4:3), text below; meta year/arrow moves inline with the kind label. Build-photo grid goes 2-up. Gutter drops 44px → 20px.
- Hero h1 scales down with `clamp(40px, 8vw, 86px)`; detail h1 `clamp(34px, 6.5vw, 68px)`.
- Nav collapses to a hamburger or a simple wrapped row; keep the Résumé button visible.

## State Management
Minimal — this is a static content site.
- `activeFilter: 'all' | 'robots' | 'electronics' | 'fun'` — home page project list.
- `playing: boolean` per video element.
- Project content should live as data (JSON/MDX/CMS), not hardcoded JSX: fields `no, kind, title, blurb, tags[], year, tint, media{type,src,poster,caption}, specs[{key,value}], notes[{heading,body}], photos[]`. The detail page renders entirely from one such record.

## Assets
None included — every image, video, and photo in the mock is a colored placeholder block. The user needs to supply:
- Hero/thumbnail image or video per project (4:3 for cards, 16:8 for the detail hero)
- 4+ build photos per project (square crop)
- A résumé PDF for the Résumé ↓ button
Fonts are Google Fonts: **Bricolage Grotesque** (700, 800) and **Public Sans** (400, 500, 600, 700) — self-host with `next/font` or equivalent rather than a CDN link.

## Gaps to fill
Not yet designed — ask the designer before inventing them: **Timeline page**, **About page**, all **mobile layouts**, empty/loading states, and the 404.

## Files
- `Portfolio Bright.dc.html` — the approved design (Home + Project Detail). Source of truth.
- `support.js` — the prototype's template runtime. **Reference only — do not port.**
