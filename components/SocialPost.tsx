import { NETWORK_LABEL, embedUrl, type SocialNetwork } from '@/lib/social';
import './SocialWindows.css';

type Props = {
  network: SocialNetwork;
  /** Full post URL, LinkedIn URN, or Instagram shortcode. */
  post: string;
  /** Optional caption under the window, in your own words. */
  caption?: string;
  /** Embed height in px. LinkedIn needs more room than Instagram. */
  height?: number;
};

/**
 * One chosen post, embedded through the network's own embed endpoint. Drop it
 * anywhere in a page:
 *
 *   <SocialPost network="instagram" post="https://www.instagram.com/p/ABC123/" />
 */
export default function SocialPost({ network, post, caption, height }: Props) {
  const src = embedUrl(network, post);
  const label = NETWORK_LABEL[network];

  // A malformed link should not blow up a page build; say what is wrong instead.
  if (!src) {
    return (
      <div className="socialWindow socialWindow--broken">
        <div className="socialWindowBar">
          <span>{label.toUpperCase()} · POST</span>
        </div>
        <p className="socialWindowEmpty">
          Could not read a {label} post id from <code>{post}</code>. Paste the
          full post URL.
        </p>
      </div>
    );
  }

  const frameHeight = height ?? (network === 'linkedin' ? 620 : 720);

  return (
    <figure className="socialWindow">
      <div className="socialWindowBar">
        <span>{label.toUpperCase()} · POST</span>
        <a href={post.startsWith('http') ? post : src} target="_blank" rel="noreferrer">
          Open on {label} ↗
        </a>
      </div>
      <iframe
        className="socialWindowFrame"
        src={src}
        title={`${label} post`}
        height={frameHeight}
        loading="lazy"
        frameBorder="0"
        allow="encrypted-media; picture-in-picture; web-share"
        allowFullScreen
        scrolling="no"
      />
      {caption && <figcaption className="socialWindowCaption">{caption}</figcaption>}
    </figure>
  );
}
