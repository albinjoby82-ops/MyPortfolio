import { NETWORK_LABEL, embedUrl, type SocialNetwork } from '@/lib/social';
import './SocialWindows.css';

type Props = {
  network: SocialNetwork;
  post: string;
  caption?: string;
  height?: number;
};

export default function SocialPost({ network, post, caption, height }: Props) {
  const src = embedUrl(network, post);
  const label = NETWORK_LABEL[network];

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
        <a
          href={post.startsWith('http') ? post : src}
          target="_blank"
          rel="noreferrer"
        >
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
      {caption && (
        <figcaption className="socialWindowCaption">{caption}</figcaption>
      )}
    </figure>
  );
}
