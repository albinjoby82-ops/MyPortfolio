// Onshape remains the source of truth. Published, Onshape-connected viewers
// are displayed inside the portfolio without maintaining a second CAD model.

export type CadProvider = 'onshape';

export type CadTabKind = 'part-studio' | 'assembly' | 'drawing';

export type CadTab = {
  id: string;
  name: string;
  kind: CadTabKind;
  summary?: string;
  /** Deep link to this tab in the live Onshape document. */
  href?: string;
  /** Still image shown when no published viewer is connected. */
  poster?: string;
  /** Self-hosted GLB exported from Onshape for the lightweight viewer. */
  model?: string;
  /** Published 3DVizi URL created from the Onshape assembly. */
  embed?: string;
};

export type CadDocument = {
  id: string;
  name: string;
  provider: CadProvider;
  href?: string;
  summary?: string;
  tabs: CadTab[];
};

export const PROVIDER_LABEL: Record<CadProvider, string> = {
  onshape: 'Onshape',
};

export const TAB_KIND_LABEL: Record<CadTabKind, string> = {
  'part-studio': 'Part Studio',
  assembly: 'Assembly',
  drawing: 'Drawing',
};

/** Accept only published 3DVizi viewers, then request their compact embed UI. */
export function onshapeEmbedUrl(value: string): string | undefined {
  let parsed: URL;
  try {
    parsed = new URL(value.trim());
  } catch {
    return undefined;
  }

  if (parsed.protocol !== 'https:') return undefined;
  if (parsed.hostname.toLowerCase() !== 'share.3dvizi.com') return undefined;
  if (!/^\/p\/[^/]+\/?$/i.test(parsed.pathname)) return undefined;

  parsed.search = 'embed';
  return parsed.toString();
}
