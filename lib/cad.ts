// The CAD portal's data model and URL helpers.
//
// Why it is shaped this way: Onshape refuses to be put in an iframe
// (X-Frame-Options), so a live Onshape tab cannot be embedded the way a YouTube
// video can. What Onshape *does* give you is a REST API that exports any Part
// Studio or Assembly to glTF, plus an assembly definition listing the mates.
// So the portal renders your own exported GLB in the site's existing Three.js
// stack, reproduces the mates as draggable degrees of freedom, and links out to
// the live document for anyone who wants to open it properly in Onshape.
//
// Fusion is the opposite: its public share links *are* embeddable, so those
// tabs render Autodesk's own viewer in an iframe.

export type CadProvider = 'onshape' | 'fusion' | 'other';

/** What a tab renders. */
export type CadTabKind = 'part-studio' | 'assembly' | 'drawing';

/**
 * One degree of freedom, transcribed from an Onshape mate.
 *
 * Onshape's assembly definition gives each mate a `mateType` and a mated
 * coordinate system (`matedCS`) with an origin and a Z axis. Those map directly
 * onto `origin` and `axis` below — `scripts/onshape-sync.mjs` writes them out
 * for you. Distances and origins are in the GLB's own units (Onshape exports
 * metres); angles are degrees.
 */
export type CadMate = {
  id: string;
  /** Shown next to the control, e.g. "Shoulder hinge". */
  name: string;
  type: 'revolute' | 'slider' | 'cylindrical';
  /** Names of GLB nodes this mate moves. Sets must not overlap. */
  moves: string[];
  /** Mate connector origin, in model space. */
  origin: [number, number, number];
  /** Mate axis, in model space. Normalised on load. */
  axis: [number, number, number];
  /** Rotation limits in degrees (revolute, cylindrical). */
  angle?: { min: number; max: number; start?: number };
  /**
   * Travel limits, in the GLB's own units (slider, cylindrical). `scale` and
   * `unit` only affect the number shown beside the control — a metre-based
   * export reading in millimetres is `{ scale: 1000, unit: 'mm' }`.
   */
  travel?: {
    min: number;
    max: number;
    start?: number;
    scale?: number;
    unit?: string;
  };
  /** Id of a mate whose motion this one rides on, e.g. a jaw on an arm. */
  parent?: string;
};

export type CadTab = {
  id: string;
  /** Tab name, matching the tab in the CAD document. */
  name: string;
  kind: CadTabKind;
  /** One-line description of what this tab is. */
  summary?: string;
  /** Self-hosted glTF/GLB export. Required for an interactive tab. */
  model?: string;
  /** Degrees of freedom to expose. Assemblies only. */
  mates?: CadMate[];
  /** Deep link to this tab in the live CAD document. */
  href?: string;
  /** Still image, used before the viewer loads and when there is no model. */
  poster?: string;
  /** Fusion/A360 public share URL. Rendered as Autodesk's embedded viewer. */
  embed?: string;
  /** Overrides the auto-framed camera distance multiplier. */
  zoom?: number;
};

export type CadDocument = {
  id: string;
  /** Document name, e.g. "GaelForce · Drive base". */
  name: string;
  provider: CadProvider;
  /** Link to the whole document. */
  href?: string;
  /** One or two sentences on what the model is. */
  summary?: string;
  tabs: CadTab[];
};

export const PROVIDER_LABEL: Record<CadProvider, string> = {
  onshape: 'Onshape',
  fusion: 'Fusion',
  other: 'CAD',
};

export const TAB_KIND_LABEL: Record<CadTabKind, string> = {
  'part-studio': 'Part Studio',
  assembly: 'Assembly',
  drawing: 'Drawing',
};

export const MATE_TYPE_LABEL: Record<CadMate['type'], string> = {
  revolute: 'Revolute',
  slider: 'Slider',
  cylindrical: 'Cylindrical',
};

/** Ids identifying one tab inside an Onshape document. */
export type OnshapeIds = {
  documentId: string;
  /** 'w' for a workspace, 'v' for a version, 'm' for a microversion. */
  wvm: 'w' | 'v' | 'm';
  wvmId: string;
  elementId?: string;
};

const ONSHAPE_URL =
  /onshape\.com\/documents\/([0-9a-f]{16,32})(?:\/(w|v|m)\/([0-9a-f]{16,32}))?(?:\/e\/([0-9a-f]{16,32}))?/i;

/** Pulls the document / workspace / element ids out of any Onshape URL. */
export function parseOnshapeUrl(url: string): OnshapeIds | undefined {
  const match = url.match(ONSHAPE_URL);
  if (!match) return undefined;
  const [, documentId, wvm, wvmId, elementId] = match;
  if (!wvm || !wvmId) return undefined;
  return {
    documentId,
    wvm: wvm.toLowerCase() as OnshapeIds['wvm'],
    wvmId,
    elementId,
  };
}

/** Rebuilds a deep link to a single tab of an Onshape document. */
export function onshapeTabUrl(ids: OnshapeIds, elementId?: string): string {
  const element = elementId ?? ids.elementId;
  const base = `https://cad.onshape.com/documents/${ids.documentId}/${ids.wvm}/${ids.wvmId}`;
  return element ? `${base}/e/${element}` : base;
}

/**
 * Turns a Fusion / A360 public share link into its embeddable viewer URL.
 * Autodesk serves the same share URL in embed mode with `?mode=embed`, which is
 * what their own "Embed" dialog produces.
 */
export function fusionEmbedUrl(share: string): string | undefined {
  const trimmed = share.trim();
  if (!trimmed) return undefined;
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return undefined;
  }
  if (parsed.protocol !== 'https:') return undefined;
  if (!/(^|\.)(autodesk360\.com|autodesk\.com|a360\.co)$/i.test(parsed.hostname)) {
    return undefined;
  }
  parsed.searchParams.set('mode', 'embed');
  return parsed.toString();
}

/** True when a tab can be shown in the interactive Three.js viewer. */
export function isInteractive(tab: CadTab): boolean {
  return Boolean(tab.model);
}

/** Mates ordered so that a parent always comes before the mates riding on it. */
export function orderMates(mates: CadMate[]): CadMate[] {
  const byId = new Map(mates.map((m) => [m.id, m]));
  const seen = new Set<string>();
  const ordered: CadMate[] = [];

  const visit = (mate: CadMate, trail: Set<string>) => {
    if (seen.has(mate.id) || trail.has(mate.id)) return; // cycle guard
    trail.add(mate.id);
    const parent = mate.parent ? byId.get(mate.parent) : undefined;
    if (parent) visit(parent, trail);
    trail.delete(mate.id);
    if (seen.has(mate.id)) return;
    seen.add(mate.id);
    ordered.push(mate);
  };

  for (const mate of mates) visit(mate, new Set());
  return ordered;
}

/** The value a mate control starts at. */
export function mateStart(mate: CadMate, channel: 'angle' | 'travel'): number {
  const range = channel === 'angle' ? mate.angle : mate.travel;
  if (!range) return 0;
  if (typeof range.start === 'number') return range.start;
  return range.min <= 0 && range.max >= 0 ? 0 : range.min;
}

/** Which controls a mate type exposes. */
export function mateChannels(mate: CadMate): Array<'angle' | 'travel'> {
  const channels: Array<'angle' | 'travel'> = [];
  if (mate.type !== 'slider' && mate.angle) channels.push('angle');
  if (mate.type !== 'revolute' && mate.travel) channels.push('travel');
  return channels;
}
