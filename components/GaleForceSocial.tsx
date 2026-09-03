import SocialFeed from '@/components/SocialFeed';
import SocialPost from '@/components/SocialPost';
import {
  galeForceAccounts,
  galeForceFeedFallback,
  galeForcePinnedPosts,
  socialFeedEndpoint,
} from '@/content/social';
import './GaleForceSocial.css';

/**
 * The GaelForce social section: the auto-pulled feed at the top, then any
 * posts pinned by hand in content/social.ts. Individual `SocialPost` embeds can
 * also be dropped into any other part of the site on their own.
 */
export default function GaleForceSocial() {
  return (
    <section className="galeForceSocial gutter" aria-labelledby="galeforce-social-title">
      <div className="galeForceSocialInner">
        <div className="galeForceSocialIntro">
          <div>
            <span className="socialKicker">03 · In public</span>
            <h2 id="galeforce-social-title">Follow the build as it happens.</h2>
          </div>
          <p>
            The team posts progress, sponsor news and competition updates on
            LinkedIn and Instagram. This panel pulls the latest of those posts
            straight from the accounts, so the page keeps up without anyone
            editing it.
          </p>
        </div>

        <SocialFeed
          endpoint={socialFeedEndpoint}
          fallback={galeForceFeedFallback}
          accounts={galeForceAccounts}
          limit={6}
        />

        {galeForcePinnedPosts.length > 0 && (
          <div className="galeForcePinned">
            <span className="socialKicker">Pinned</span>
            <h3>Posts worth stopping on.</h3>
            <div className="galeForcePinnedGrid">
              {galeForcePinnedPosts.map((pinned) => (
                <SocialPost
                  key={`${pinned.network}-${pinned.post}`}
                  network={pinned.network}
                  post={pinned.post}
                  caption={pinned.caption}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
