'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  NETWORK_LABEL,
  formatPostedAt,
  normaliseFeed,
  sortByNewest,
  type SocialAccount,
  type SocialFeedItem,
  type SocialNetwork,
} from '@/lib/social';
import './SocialWindows.css';

type Props = {
  /** JSON endpoint returning the latest posts. Empty string = fallback only. */
  endpoint?: string;
  /** Rendered when the endpoint is unset, empty or unreachable. */
  fallback?: SocialFeedItem[];
  /** Accounts shown in the header, for the "follow along" links. */
  accounts?: SocialAccount[];
  /** Most posts to show. */
  limit?: number;
  title?: string;
  kicker?: string;
};

type Status = 'idle' | 'loading' | 'live' | 'fallback';

const FILTERS: Array<{ value: SocialNetwork | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
];

/**
 * Pulls the latest LinkedIn / Instagram posts at runtime and shows them as
 * cards. The site is a static export, so the fetch happens in the browser
 * against an endpoint that holds the API tokens on its own side — see
 * docs/SOCIAL_FEED.md. Without an endpoint it renders the curated fallback.
 */
export default function SocialFeed({
  endpoint = '',
  fallback = [],
  accounts = [],
  limit = 6,
  title = 'Latest from the team',
  kicker = 'Live feed',
}: Props) {
  const [items, setItems] = useState<SocialFeedItem[]>(() => sortByNewest(fallback));
  const [status, setStatus] = useState<Status>(endpoint ? 'loading' : 'fallback');
  const [filter, setFilter] = useState<SocialNetwork | 'all'>('all');

  useEffect(() => {
    if (!endpoint) {
      setStatus('fallback');
      return;
    }

    const controller = new AbortController();
    setStatus('loading');

    fetch(endpoint, { signal: controller.signal, headers: { accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error(`Feed responded ${res.status}`);
        return res.json();
      })
      .then((payload: unknown) => {
        const fresh = normaliseFeed(payload);
        if (fresh.length === 0) throw new Error('Feed returned no usable posts');
        setItems(fresh);
        setStatus('live');
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        // The section stays useful on failure; the reason goes to the console.
        console.warn('Social feed unavailable, using curated posts.', error);
        setItems(sortByNewest(fallback));
        setStatus('fallback');
      });

    return () => controller.abort();
    // `fallback` is module-level config, stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const shown = useMemo(
    () => items.filter((i) => filter === 'all' || i.network === filter).slice(0, limit),
    [items, filter, limit],
  );

  const linkedAccounts = accounts.filter((a) => a.url);

  return (
    <div className="socialFeed">
      <div className="socialFeedHead">
        <div>
          <span className="socialKicker">{kicker}</span>
          <h3>{title}</h3>
        </div>

        <div className="socialFeedControls">
          <div className="socialFeedFilters" role="group" aria-label="Filter posts by network">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                className={
                  'socialFeedFilter' + (filter === f.value ? ' socialFeedFilter--on' : '')
                }
                aria-pressed={filter === f.value}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {linkedAccounts.length > 0 && (
            <div className="socialFeedAccounts">
              {linkedAccounts.map((a) => (
                <a key={a.network} href={a.url} target="_blank" rel="noreferrer">
                  {a.handle} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {status === 'loading' && (
        <p className="socialFeedNote" role="status">
          Loading the latest posts…
        </p>
      )}

      {shown.length === 0 ? (
        <p className="socialFeedNote">
          {endpoint
            ? 'No posts to show yet.'
            : 'The live feed is not connected yet. Add a feed endpoint or curated posts in content/social.ts — see docs/SOCIAL_FEED.md.'}
        </p>
      ) : (
        <ul className="socialFeedGrid">
          {shown.map((item) => (
            <li key={item.id}>
              <a
                className={`socialCard socialCard--${item.network}`}
                href={item.url}
                target="_blank"
                rel="noreferrer"
              >
                <div className="socialCardBar">
                  <span>{NETWORK_LABEL[item.network].toUpperCase()}</span>
                  <span>{formatPostedAt(item.postedAt)}</span>
                </div>
                {item.image && (
                  /* Remote, arbitrary-size preview: plain <img>, next/image is
                     unoptimized in this export anyway. */
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="socialCardImage" src={item.image} alt="" loading="lazy" />
                )}
                {item.text && <p className="socialCardText">{item.text}</p>}
                <span className="socialCardLink">Open post ↗</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      {status === 'fallback' && shown.length > 0 && (
        <p className="socialFeedNote socialFeedNote--quiet">
          Showing saved posts — the live feed is not reachable right now.
        </p>
      )}
    </div>
  );
}
