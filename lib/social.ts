// Helpers for the LinkedIn / Instagram widgets.
//
// The site is a static export, so nothing here may hold an API token or run on
// a server. Two separate jobs:
//
//   1. `SocialFeed`  — pulls the latest posts at runtime from a JSON endpoint
//                      you control (see docs/SOCIAL_FEED.md). Falls back to the
//                      curated items in content/social.ts when the endpoint is
//                      not configured or is unreachable.
//   2. `SocialPost`  — embeds one specific post you picked, via the official
//                      LinkedIn / Instagram embed iframes. No JS, no tracking
//                      script, works offline of any API.

export type SocialNetwork = 'linkedin' | 'instagram';

/** One post as rendered by the feed widget. */
export type SocialFeedItem = {
  /** Stable key. Use the post URL when you have nothing better. */
  id: string;
  network: SocialNetwork;
  /** Canonical link to the post. */
  url: string;
  /** Post text. Trimmed for display; keep it as published. */
  text?: string;
  /** Preview image. Must be a URL the browser can load directly. */
  image?: string;
  /** ISO 8601 timestamp. Drives sorting and the displayed date. */
  postedAt?: string;
};

/** Shape a feed endpoint must return: either the array, or `{ items: [...] }`. */
type FeedResponse = SocialFeedItem[] | { items?: unknown };

const NETWORKS: SocialNetwork[] = ['linkedin', 'instagram'];

function isNetwork(value: unknown): value is SocialNetwork {
  return typeof value === 'string' && NETWORKS.includes(value as SocialNetwork);
}

/**
 * Accepts whatever the endpoint returned and keeps only entries that are
 * actually renderable. A malformed feed degrades to fewer cards, never to a
 * broken page.
 */
export function normaliseFeed(payload: unknown): SocialFeedItem[] {
  const raw: unknown = Array.isArray(payload)
    ? payload
    : (payload as { items?: unknown } | null)?.items;
  if (!Array.isArray(raw)) return [];

  const items: SocialFeedItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue;
    const item = entry as Record<string, unknown>;
    const url = typeof item.url === 'string' ? item.url : undefined;
    const network = isNetwork(item.network)
      ? item.network
      : url
        ? networkFromUrl(url)
        : undefined;
    if (!url || !network || !isHttpUrl(url)) continue;

    const image = typeof item.image === 'string' && isHttpUrl(item.image) ? item.image : undefined;
    const postedAt =
      typeof item.postedAt === 'string' && !Number.isNaN(Date.parse(item.postedAt))
        ? item.postedAt
        : undefined;

    items.push({
      id: typeof item.id === 'string' && item.id ? item.id : url,
      network,
      url,
      text: typeof item.text === 'string' ? item.text : undefined,
      image,
      postedAt,
    });
  }
  return sortByNewest(items);
}

export function sortByNewest(items: SocialFeedItem[]): SocialFeedItem[] {
  return [...items].sort((a, b) => {
    const at = a.postedAt ? Date.parse(a.postedAt) : 0;
    const bt = b.postedAt ? Date.parse(b.postedAt) : 0;
    return bt - at;
  });
}

function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function networkFromUrl(url: string): SocialNetwork | undefined {
  if (/(^|\.)linkedin\.com/i.test(hostOf(url))) return 'linkedin';
  if (/(^|\.)instagram\.com/i.test(hostOf(url))) return 'instagram';
  return undefined;
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

/**
 * LinkedIn's embed takes the activity/share URN, which is the long number in
 * the post URL. Accepts a full post URL, an `urn:li:...` string, or the bare
 * numeric id.
 */
export function linkedInEmbedUrl(post: string): string | undefined {
  const trimmed = post.trim();
  if (!trimmed) return undefined;

  let urn: string | undefined;
  if (trimmed.startsWith('urn:li:')) {
    urn = trimmed;
  } else if (/^\d{15,}$/.test(trimmed)) {
    urn = `urn:li:share:${trimmed}`;
  } else {
    // .../feed/update/urn:li:activity:1234…  or  .../posts/name-activity-1234-abcd
    const fromUpdate = trimmed.match(/urn:li:(activity|share|ugcPost):(\d+)/i);
    const fromSlug = trimmed.match(/activity[-:](\d{15,})/i);
    if (fromUpdate) urn = `urn:li:${fromUpdate[1]}:${fromUpdate[2]}`;
    else if (fromSlug) urn = `urn:li:activity:${fromSlug[1]}`;
  }
  if (!urn) return undefined;
  return `https://www.linkedin.com/embed/feed/update/${urn}`;
}

/**
 * Instagram serves an embeddable view at /p/<shortcode>/embed. Accepts a full
 * post/reel URL or the bare shortcode.
 */
export function instagramEmbedUrl(post: string): string | undefined {
  const trimmed = post.trim();
  if (!trimmed) return undefined;

  let shortcode: string | undefined;
  const fromUrl = trimmed.match(/instagram\.com\/(?:[^/]+\/)?(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i);
  if (fromUrl) shortcode = fromUrl[1];
  else if (/^[A-Za-z0-9_-]{5,}$/.test(trimmed) && !trimmed.includes('.')) shortcode = trimmed;
  if (!shortcode) return undefined;

  return `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
}

export function embedUrl(network: SocialNetwork, post: string): string | undefined {
  return network === 'linkedin' ? linkedInEmbedUrl(post) : instagramEmbedUrl(post);
}

/** An account the widgets link out to. */
export type SocialAccount = {
  network: SocialNetwork;
  /** Display handle, e.g. "@gaelforceucd". */
  handle: string;
  /** Public profile URL. Empty hides the link. */
  url: string;
};

export const NETWORK_LABEL: Record<SocialNetwork, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
};

/** Short display date, e.g. "12 Aug 2026". Empty string when unknown. */
export function formatPostedAt(postedAt?: string): string {
  if (!postedAt) return '';
  const date = new Date(postedAt);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
