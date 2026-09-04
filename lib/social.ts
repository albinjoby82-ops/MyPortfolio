export type SocialNetwork = 'linkedin' | 'instagram';

export function linkedInEmbedUrl(post: string): string | undefined {
  const trimmed = post.trim();
  if (!trimmed) return undefined;

  let urn: string | undefined;

  if (trimmed.startsWith('urn:li:')) {
    urn = trimmed;
  } else if (/^\d{15,}$/.test(trimmed)) {
    urn = `urn:li:share:${trimmed}`;
  } else {
    const fromUpdate = trimmed.match(/urn:li:(activity|share|ugcPost):(\d+)/i);
    const fromSlug = trimmed.match(/activity[-:](\d{15,})/i);

    if (fromUpdate) {
      urn = `urn:li:${fromUpdate[1]}:${fromUpdate[2]}`;
    } else if (fromSlug) {
      urn = `urn:li:activity:${fromSlug[1]}`;
    }
  }

  if (!urn) return undefined;
  return `https://www.linkedin.com/embed/feed/update/${urn}`;
}

export function instagramEmbedUrl(post: string): string | undefined {
  const trimmed = post.trim();
  if (!trimmed) return undefined;

  const fromUrl = trimmed.match(/instagram\.com\/(?:p|reel|tv)\/([^/?#]+)/i);
  const shortcode = fromUrl?.[1] ?? (/^[\w-]+$/.test(trimmed) ? trimmed : undefined);

  return shortcode ? `https://www.instagram.com/p/${shortcode}/embed/` : undefined;
}

export function embedUrl(network: SocialNetwork, post: string): string | undefined {
  return network === 'linkedin'
    ? linkedInEmbedUrl(post)
    : instagramEmbedUrl(post);
}

export const NETWORK_LABEL: Record<SocialNetwork, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
};
