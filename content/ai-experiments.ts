/**
 * All the copy for /projects/ai-experiments, as data. The layout lives in
 * components/AiExperiments.tsx. The hero text and "The numbers" panel stay in
 * content/projects/ai-experiments.mdx with every other project.
 *
 * Every fact here traces to a repo. Don't add one that doesn't.
 */

export type AiLink = { label: string; href: string };

const GH = "https://github.com/albinjoby82-ops";
const SKILLS = `${GH}/Personal-Claude-Skills-`;
const skill = (name: string) => `${SKILLS}/tree/main/skills/${name}`;

export const intro = {
  quote:
    "I'm really curious about AI. I keep testing how far I can go with it, and I save everything on GitHub.",
  note: "This page is the logbook. Claude read all 22 repos and drafted it from them. Where a repo is public, you can follow the link and check.",
};

export const commits = {
  title: "Commits per month, 2026",
  note: "November only runs to the 8th.",
  months: [
    { month: "Jun", full: "June", total: 18, ai: 3 },
    { month: "Jul", full: "July", total: 119, ai: 88 },
    { month: "Aug", full: "August", total: 59, ai: 34 },
    { month: "Sep", full: "September", total: 59, ai: 23 },
    { month: "Oct", full: "October", total: 232, ai: 210 },
    { month: "Nov", full: "November, up to the 8th", total: 33, ai: 26 },
  ],
  caveats: [
    "These numbers come straight from git. A commit counts if an AI is its author or is credited in it.",
    "The total includes teammates' commits in shared repos.",
    "The AI count is low, because my push-clean skill leaves Claude's name off a commit when I ask it to.",
  ],
  caveatLink: { label: "The push-clean skill", href: `${SKILLS}/blob/main/skills/push-clean/SKILL.md` },
};

export type TimelineEntry = {
  date: string;
  question: string;
  title: string;
  story: string[];
  list?: string[];
  lessonTitle: string;
  lesson: string;
  links: AiLink[];
  /** Shown as a plain pill, because there is nothing a visitor can open. */
  privateNote?: string;
  tint: string;
};

export const timeline: TimelineEntry[] = [
  {
    date: "Jun to Jul",
    question: "Can AI help me run a real shop?",
    title: "Cubi",
    story: [
      "A live store with a 3D customiser, real checkout and printed orders.",
      "That's 120 commits in about a month, and 77 credit an AI. Codex made the first ones. Claude joined in July.",
    ],
    lessonTitle: "The repo has to remember",
    lesson:
      "An agent starts each session knowing nothing. So a CLAUDE.md lists the traps that already cost me time, and an Obsidian vault holds the business facts. Pricing and decisions can't change without my OK.",
    links: [
      { label: "cubi-3d.com", href: "https://cubi-3d.com" },
      { label: "The Cubi page", href: "/projects/cubi" },
    ],
    privateNote: "Code is private",
    tint: "#F5C63C",
  },
  {
    date: "28 Jul",
    question: "Can a film be written as code?",
    title: "Micro-Mouse trailer",
    story: [
      "A 45-second vertical launch film, rendered from code by Claude Code.",
      "It came from a prompt package: one master prompt, then a set of targeted revision prompts.",
    ],
    lessonTitle: "Ask for one change at a time",
    lesson:
      "The revision prompts never say \"make it better\". One says to replace only the chase-camera rig and collision logic. Another says not to add new assets. The package also warns against letting the model invent the date, venue or sign-up link.",
    links: [
      { label: "Trailer source", href: `${GH}/AJ_HackClub_267/tree/master/micromouse-reveal` },
      {
        label: "Revision prompts",
        href: `${GH}/AJ_HackClub_267/blob/master/micromouse-reveal/docs/06_REVISION_PROMPTS.md`,
      },
    ],
    tint: "#EE8570",
  },
  {
    date: "20 Aug",
    question: "Can it work where being wrong matters?",
    title: "RapidCare",
    story: [
      "A hackathon app that picks where an ambulance should go. It doesn't just pick the nearest hospital. It asks which hospital can treat this patient, and how soon.",
      "I built it with cjindub in one day.",
    ],
    lessonTitle: "Label what's simulated",
    lesson:
      "The plan splits what's real from what's simulated, and says that split must stay visible in the app. Its rule: never state an unverified clinical designation as fact.",
    links: [
      { label: "Try the demo", href: "https://albinjoby82-ops.github.io/RapidCare/" },
      { label: "Repo", href: `${GH}/RapidCare` },
      { label: "The plan", href: `${GH}/RapidCare/blob/main/docs/rapidcare-plan.md` },
      { label: "cjindub", href: "https://github.com/cjindub" },
    ],
    tint: "#C6E4F5",
  },
  {
    date: "25 to 29 Aug",
    question: "Can it build from a written brief?",
    title: "Semester OS",
    story: [
      "I wrote a long brief first. It tells Claude to act as lead product engineer, then warns: \"Do not begin by building a huge student productivity suite.\"",
      "29 commits later it tracked deadlines, module debt and free time, with Google Calendar, an offline phone app and WhatsApp capture.",
    ],
    lessonTitle: "AI built it, but no AI runs inside it",
    lesson:
      "\"What should I do next?\" comes from plain scoring. The reason it shows you is built from the same numbers as the ranking, so the explanation can't drift from the maths.",
    links: [
      { label: "Repo", href: `${GH}/Semester_OS` },
      { label: "The brief", href: `${GH}/Semester_OS/blob/main/SEMESTER_OS_CLAUDE_BUILD_BRIEF.md` },
      { label: "The next-action engine", href: `${GH}/Semester_OS/commit/7217f03` },
    ],
    tint: "#C8E6A0",
  },
  {
    date: "2 Sep",
    question: "Can it cut down someone else's app?",
    title: "Locked In",
    story: [
      "A gym tracker for exactly two people: me and my brother. The plan says it shows \"which of us is actually training and which of us is talking\".",
      "The job was to take the MIT-licensed workout-cool, cut it down to two users, and load 876 exercises from a public-domain database.",
    ],
    lessonTitle: "Not every job is writing new code",
    lesson: "Keep the licence, and write down where everything came from.",
    links: [
      { label: "Repo", href: `${GH}/Locked` },
      { label: "The plan", href: `${GH}/Locked/blob/main/PLAN.md` },
      { label: "Where it came from", href: `${GH}/Locked/blob/main/PROVENANCE.md` },
      { label: "workout-cool", href: "https://github.com/Snouzy/workout-cool" },
    ],
    tint: "#E4DDCC",
  },
  {
    date: "Sep",
    question: "What can't it see?",
    title: "Micromouse debug kit",
    story: [
      "A row of small sketches that each test one part, then print pass or fail. It ends with a flood-fill maze solver.",
      "The handover notes put it plainly: \"Most of the time lost on this build went on wiring and tooling problems, not on algorithms.\"",
    ],
    lessonTitle: "Test the smallest thing",
    lesson: "AI can write a maze solver. It can't see that your 9 V battery is sagging.",
    links: [
      { label: "Repo", href: `${GH}/micromouse-debug-kit` },
      { label: "Handover notes", href: `${GH}/micromouse-debug-kit/blob/master/HANDOVER.md` },
    ],
    tint: "#EE8570",
  },
  {
    date: "Oct",
    question: "Does the bench agree?",
    title: "The odometry pod",
    story: [
      "Ronan Hawkins wrote the particle filter on this pod. I used Claude on bring-up fixes. One commit changes a sensor start-up order: the old order failed on all four distance sensors on the bench, and the new one started all four.",
      "Claude then helped turn the build into a numbered write-up. The history shows the clean-up: a wrong size claim removed, and a caption cut back to only what the photo shows.",
    ],
    lessonTitle: "A write-up can look finished while the copper is wrong",
    lesson:
      "Then we tested the V2 board. About two hours of debugging found three layout mistakes, including an IMU with no ground at all.",
    links: [
      { label: "The start-up fix", href: `${GH}/ODOM-CODE/commit/5a9fc94` },
      { label: "The write-up", href: `${GH}/ODOM-Wirte-UP` },
      { label: "What went wrong", href: `${GH}/ODOM-Wirte-UP/blob/HEAD/docs/04-pcb-v2.md#what-went-wrong` },
      { label: "Ronan's firmware", href: "https://github.com/ronanhawkins/gaelforce_esp32" },
      { label: "The GaelForce page", href: "/projects/gaelforce-ucd" },
    ],
    tint: "#C6E4F5",
  },
  {
    date: "8 Oct",
    question: "Will it admit what it can't read?",
    title: "Accumulator research",
    story: [
      "I asked Claude to research busbars and HV connections for the Formula Student accumulator. The sandbox blocked the rulebook and datasheet PDFs.",
      "So instead of bluffing, it said so at the top. Every claim got a tag: primary source, secondary source, its own calculation, or from memory and unverified.",
    ],
    lessonTitle: "Having a research pack isn't knowing it",
    lesson:
      "So there's also a public learning log, where I work through the list one section at a time. So far: section 1 of 10 done, and 10 out of 10 on its quiz.",
    links: [
      { label: "Learning log", href: `${GH}/UCDFS-ACCU-Learning-` },
      { label: "The quiz", href: `${GH}/UCDFS-ACCU-Learning-/blob/main/notes/01_rules_quiz.md` },
    ],
    privateNote: "Research pack is private",
    tint: "#C8E6A0",
  },
  {
    date: "10 Oct",
    question: "Can AI do a job inside an app?",
    title: "Teamly",
    story: [
      "At Hack UCD, Team 5 built an app where a team's org chart decides who approves each purchase. Real model calls sort out messy bank exports.",
      "The free models broke in new ways. Some replied with nothing, and some ran out of tokens while still reasoning. The last commits of the day are retries and more room to answer.",
    ],
    lessonTitle: "The guardrails came with it",
    lesson: "",
    list: [
      "AI never calculates. Any number it adds gets thrown away.",
      "A person confirms every suggestion, and rows under 70% confidence block the preview.",
      "Descriptions are redacted before they leave, and person-to-person transfers are never sent.",
      "If the AI is down, the import still works by hand.",
    ],
    links: [
      { label: "Try the demo", href: "https://teamly.albinjoby82.workers.dev" },
      { label: "Repo", href: `${GH}/HachUCD_Team5` },
      { label: "The commit with the guardrails", href: `${GH}/HachUCD_Team5/commit/fe8dc26` },
      { label: "Retries", href: `${GH}/HachUCD_Team5/commit/f1826c6` },
    ],
    tint: "#F5C63C",
  },
];

/** The last three stops on the timeline open into their own sections below it. */
export const deepDives = [
  { date: "From 12 Oct", question: "Can it check its own answers?", title: "Study sites", href: "#study-sites" },
  { date: "From 14 Oct", question: "Can it keep what it learned?", title: "The skills repo", href: "#skills" },
  { date: "31 Oct to 4 Nov", question: "Can I design robot parts by talking?", title: "CAD by conversation", href: "#cad" },
];

export const studySites = {
  heading: "Study sites that check their own answers",
  lede: "Lock-In is my exam method. An AI that writes practice questions can also write wrong answers, so each new module checked itself harder than the last.",
  moreLink: { label: "The Lock-In page", href: "/projects/lock-in" },
  closing: "In the last two, the AI writes the answer and something that isn't the AI has to agree with it.",
  steps: [
    {
      name: "SSD_Lock-In",
      what: "14 topics and mock midterms",
      check: "A rule",
      detail: "Nothing appears in an answer that isn't taught in the notes.",
      links: [
        { label: "Site", href: "https://albinjoby82-ops.github.io/SSD_Lock-In/" },
        { label: "Repo", href: `${GH}/SSD_Lock-In` },
      ],
    },
    {
      name: "DE_Lock-In",
      what: "Clickable K-maps and truth tables, forked from lanceyprance",
      check: "A script",
      detail: "It re-checks every answer, K-map minimality and every link.",
      links: [
        { label: "Site", href: "https://albinjoby82-ops.github.io/DE_Lock-In/" },
        { label: "Repo", href: `${GH}/DE_Lock-In` },
        { label: "Original", href: "https://github.com/lanceyprance/DE_Lock-In" },
      ],
    },
    {
      name: "COMP-ENG-LOCK-IN",
      what: "C code labs that compile and run in the browser",
      check: "Real gcc",
      detail: "It checks 542 items, and every \"what does this print\" answer.",
      links: [],
      privateNote: "Private",
    },
    {
      name: "EEEN",
      what: "Circuits practice with new numbers each time",
      check: "A circuit solver",
      detail: "It checks every formula on 200 random sets of values.",
      links: [],
      privateNote: "Private",
    },
  ],
};

export const skills = {
  heading: "The skills repo",
  lede: "A skill is a file of instructions Claude loads for a certain kind of job. My repo holds 14, about 3,400 lines of instructions, scripts and references. A small script validates them and rebuilds the index.",
  links: [
    { label: "The repo", href: SKILLS },
    { label: "The index script", href: `${SKILLS}/blob/main/scripts/build_index.py` },
  ],
  groups: [
    {
      name: "Making things",
      tint: "#F5C63C",
      items: [
        { name: "onshape-part-builder", what: "Describe a printed part and get a staged, print-checked CAD model" },
        { name: "image-to-cad-dxf", what: "Turns a picture into a clean DXF to extrude in CAD" },
        { name: "image-to-kicad-dxf", what: "Turns a picture into a custom PCB outline" },
      ],
    },
    {
      name: "Circuits",
      tint: "#C6E4F5",
      items: [
        { name: "ltspice-asc-builder", what: "Builds LTspice schematics from a sheet, and a script checks the wiring" },
        { name: "ltspice-helper", what: "Debugs LTspice screenshots, errors and plots" },
        { name: "logisim-circuit-builder", what: "Builds Logisim circuits and simulates them without Logisim" },
        { name: "de-lab-coach", what: "Coaches a Digital Electronics lab one step at a time" },
      ],
    },
    {
      name: "Learning",
      tint: "#C8E6A0",
      items: [
        { name: "ee-homework-tutor", what: "Teaches the maths with check questions, and reminds me assignments may need AI use declared" },
        { name: "exam-cram-notes", what: "Turns slides and past papers into a notes repo" },
        { name: "explain-stuff", what: "Explains things in numbered steps, then asks me to predict an answer" },
        { name: "explainer-notes", what: "Makes a one-page notes site with drawn diagrams" },
        { name: "worked-diagram", what: "Now just points to explain-stuff, after I merged them" },
      ],
    },
    {
      name: "Housekeeping",
      tint: "#E4DDCC",
      items: [
        { name: "portfolio-updater", what: "Updates this site, and asks rather than inventing facts" },
        { name: "push-clean", what: "Commits under my name with no Claude credit" },
      ],
    },
  ].map((g) => ({ ...g, items: g.items.map((i) => ({ ...i, href: skill(i.name) })) })),
  stories: [
    {
      title: "It learned from real LTspice",
      body: "The skill's script checks a schematic, but only the real program has the last word. One session on 25 October went from first commit to parts confirmed in the real program in about 80 minutes. A dependent source only matched the hand calculation with its value negated. The max-power recipe took three fixes in seven minutes, before settling on a method from Analog Devices. Each failure went into the skill, so the next run starts with it.",
      link: { label: "The commit history", href: `${SKILLS}/commits/main/skills/ltspice-asc-builder` },
    },
    {
      title: "It works around a wall",
      body: "Claude couldn't run Logisim in its workspace. So the skill carries its own kit, which reads the circuit file, works out what's connected, finds silent wiring faults and simulates the gates. Anything it hasn't checked against a real Logisim save gets reported as unverified.",
      link: { label: "The kit", href: `${SKILLS}/blob/main/skills/logisim-circuit-builder/scripts/logisim_kit.py` },
    },
    {
      title: "It stands on other people's work",
      body: "The Onshape skill borrows ideas from how other people use Claude for CAD, and every source is listed. It also has test prompts with graders, so a change to the skill can be tested.",
      link: { label: "The sources", href: `${SKILLS}/blob/main/skills/onshape-part-builder/references/related-work.md` },
      link2: { label: "The test prompts", href: `${SKILLS}/tree/main/skills/onshape-part-builder/evals` },
    },
  ],
};

export const cad = {
  heading: "Designing robot parts by talking",
  lede: "This is the furthest I've pushed it so far. I described a part, and Claude built it in code with build123d. I got STEP files for Onshape, print files and a rebuild sheet.",
  facts: [
    { value: "7", label: "projects in the archive" },
    { value: "17", label: "steps on the brace" },
    { value: "8", label: "versions of the brace" },
  ],
  archiveNote: "The archive is private. The bigger projects tell the design prompt by prompt, failed tries included.",
  moreLink: { label: "The GaelForce page", href: "/projects/gaelforce-ucd" },
  gap: {
    title: "The motor gap",
    intro: "I gave it 30.5 mm. When the part looked wrong in Onshape, we both doubted that number.",
    steps: [
      { value: "30.5", who: "My number", right: true },
      { value: "21.8", who: "Claude, from a screenshot", right: false },
      { value: "17.8", who: "Claude, worked out", right: false },
      { value: "30.5", who: "Measured against the 12.7 mm hole spacing", right: true },
    ],
    outro: "The real fault was a mounting hole on the centreline. Moving it fixed the part.",
  },
  moments: [
    {
      title: "\"Don't just slap it on top.\"",
      body: "Claude's first two tries at adding my encoder holder both got rejected. The third redesigned the brace around it, so the brace outline became the holder.",
    },
    {
      title: "A clash check beat eyeballing",
      body: "Testing the sliding ends at -5, 0 and +5 mm found a touch only at +5.",
    },
    {
      title: "The skill grew mid-job",
      body: "It had no VEX dimensions at the start, so step 2 was adding them, with a mistake on the C-channel sizes fixed along the way.",
    },
    {
      title: "Then the pods",
      body: "A V-shaped pod got replaced the same day by two linear pods on printed rails. For a 15 mm ground clearance under the intake, one more round took the highest point from 78 mm to 57 mm.",
    },
    {
      title: "I got thrifty",
      body: "Git chores now go to a smaller model, because they don't need the big one.",
    },
  ],
  images: [
    {
      src: "/projects/galeforce/odom/07-v-odom-pod-onshape.png",
      alt: "Onshape render of the V-shaped odometry pod, with two omni wheels at 90 degrees on sprung arms",
      caption: "The V pod. Replaced the same day.",
    },
    {
      src: "/projects/galeforce/odom/07-linear-odom-pods-onshape.png",
      alt: "Onshape render of a linear odometry pod, with one omni wheel on a blue carriage between two rails",
      caption: "A linear pod, on rails.",
    },
  ],
};

export const failures = {
  heading: "What keeps going wrong",
  closing: "Most of the failures are the same failure. The AI fills a gap with something that sounds right.",
  rows: [
    { wrong: "Gap measured from a screenshot, twice wrong", fix: "Measuring against a known hole spacing" },
    { wrong: "VEX C-channel sizes misread", fix: "A correction, now written into the skill" },
    { wrong: "Encoder holder just stuck on the side", fix: "Me saying no, twice" },
    { wrong: "LTspice recipes that fail in the real program", fix: "Running them in the real program" },
    { wrong: "Wrong size claim in a write-up", fix: "Removing it, then checking captions against photos" },
    { wrong: "Free models replying with nothing", fix: "Retries, and a manual fallback" },
    { wrong: "Rulebook PDFs it couldn't open", fix: "It said so, and I have to read the real rules" },
  ],
};

export const rules = {
  heading: "The rules I keep ending up with",
  items: [
    { title: "Give it evidence", body: "Real dimensions, datasheets and screenshots with something to scale from." },
    { title: "Agree the plan first", body: "A plan change costs a line. A model change costs a rebuild." },
    { title: "Make something else check it", body: "gcc, a circuit solver, a clash check, the real LTspice." },
    { title: "Keep AI away from numbers it can't prove", body: "Teamly throws away any number the model adds." },
    { title: "Label what's simulated", body: "RapidCare keeps that visible in the app." },
    { title: "Save the correction", body: "A mistake that goes in a skill or a CLAUDE.md shouldn't happen twice." },
    { title: "The bench decides", body: "No agent can see a missing ground." },
  ],
};


