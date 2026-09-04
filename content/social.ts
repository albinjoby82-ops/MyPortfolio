// GaelForce social configuration.
//
// Everything the LinkedIn / Instagram widgets need lives here so the components
// stay generic. Nothing in this file is secret — it ships in the bundle.
//
// TODO (Albin): fill in the two account URLs and the feed endpoint. Until then
// the widgets render their empty state rather than guessed handles.

import type { SocialAccount, SocialFeedItem, SocialNetwork } from '@/lib/social';

export type { SocialAccount };

/** The accounts the widgets link out to. Leave `url` empty to hide the link. */
export const galeForceAccounts: SocialAccount[] = [
  { network: 'linkedin', handle: 'TODO: GaelForce LinkedIn page', url: '' },
  { network: 'instagram', handle: 'TODO: GaelForce Instagram handle', url: '' },
];

/**
 * JSON endpoint the feed widget polls for the latest posts. Set
 * NEXT_PUBLIC_SOCIAL_FEED_URL at build time (see docs/SOCIAL_FEED.md); the
 * value is inlined into the static export, so it must be a public, CORS-enabled
 * URL that keeps the API tokens on its own side.
 */
export const socialFeedEndpoint = process.env.NEXT_PUBLIC_SOCIAL_FEED_URL ?? '';

/**
 * Shown when the endpoint is unset or unreachable, so the section is never
 * empty in a demo or offline. Add real posts here by hand at any time — same
 * shape the endpoint returns.
 */
export const galeForceFeedFallback: SocialFeedItem[] = [
  // {
  //   id: 'linkedin-sponsor-announcement',
  //   network: 'linkedin',
  //   url: 'https://www.linkedin.com/feed/update/urn:li:activity:0000000000000000000/',
  //   text: 'Post text as published.',
  //   postedAt: '2026-08-12',
  // },
];

export type PinnedPost = {
  network: SocialNetwork;
  /** Full post URL, or the LinkedIn URN / Instagram shortcode. */
  post: string;
  /** Optional caption under the embed, in your own words. */
  caption?: string;
};

/**
 * Specific posts pinned into the GaelForce case study. Order is the order they
 * render in.
 */
export const galeForcePinnedPosts: PinnedPost[] = [
  // {
  //   network: 'instagram',
  //   post: 'https://www.instagram.com/p/XXXXXXXXXXX/',
  //   caption: 'The day the first robot moved under its own power.',
  // },
];
