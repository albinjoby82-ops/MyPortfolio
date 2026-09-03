# LinkedIn & Instagram widgets

Two independent pieces, both in `components/`:

| | What it does | Needs an API? |
|---|---|---|
| `SocialFeed` | Pulls the **latest posts** from the accounts and shows them as cards | Yes — a JSON endpoint you control |
| `SocialPost` | Embeds **one specific post** you picked, anywhere on the site | No |

Configuration for the GaelForce page lives in `content/social.ts`.
`components/GaleForceSocial.tsx` combines both and renders on
`/projects/gaelforce-ucd/`.

---

## 1. Pinning a specific post

Drop the component into any page or section:

```tsx
import SocialPost from "@/components/SocialPost";

<SocialPost
  network="instagram"
  post="https://www.instagram.com/p/ABC123xyz/"
  caption="The day the first robot moved under its own power."
/>

<SocialPost
  network="linkedin"
  post="https://www.linkedin.com/feed/update/urn:li:activity:7000000000000000000/"
/>
```

`post` accepts whatever you have: the full post URL, a LinkedIn
`urn:li:activity:…` / `urn:li:share:…`, or a bare Instagram shortcode. It
renders the network's own embed iframe — no third-party script, no tracking
loader, nothing to keep up to date.

To pin posts into the GaelForce section instead of writing JSX, add them to
`galeForcePinnedPosts` in `content/social.ts`.

**LinkedIn caveat:** only posts shared publicly are embeddable. If the embed
shows an empty box, the post's visibility is set to connections-only.

---

## 2. The automatic "latest posts" feed

The site is a static export (`output: 'export'`), so there is no server to hold
an API token, and neither the LinkedIn nor the Instagram API can be called
directly from a browser (both refuse cross-origin calls and both require a
secret). The feed therefore reads from **one JSON endpoint that you own**, which
keeps the tokens on its side.

Set the URL at build time:

```
# .env.local  (and the same variable in the Cloudflare build settings)
NEXT_PUBLIC_SOCIAL_FEED_URL=https://social-feed.<your-worker>.workers.dev/gaelforce
```

`NEXT_PUBLIC_*` values are inlined into the exported HTML, so this URL is
public. Put nothing secret in it.

### Response shape

Either a bare array or `{ "items": [...] }`:

```json
{
  "items": [
    {
      "id": "urn:li:activity:7000000000000000000",
      "network": "linkedin",
      "url": "https://www.linkedin.com/feed/update/urn:li:activity:7000000000000000000/",
      "text": "Post text as published.",
      "image": "https://media.example.com/preview.jpg",
      "postedAt": "2026-08-12T09:30:00Z"
    }
  ]
}
```

- `url` is required and must be http(s). `network` is inferred from the URL when
  omitted.
- `image` must be a URL the browser can load directly. Instagram's CDN URLs
  expire and hotlinking them is unreliable — cache the image on your own side
  and serve that URL.
- `postedAt` is ISO 8601 and drives sorting; entries without it sort last.
- Anything unparseable is dropped, so a partly broken feed still renders.

The endpoint must send `Access-Control-Allow-Origin` for the site's origin, and
should cache for 10–30 minutes rather than calling the platform APIs on every
page view.

### Getting the data into that endpoint

- **Instagram:** the Instagram Graph API `/{ig-user-id}/media` endpoint, with a
  long-lived token for a Business/Creator account linked to a Facebook Page.
  Tokens expire (60 days) and must be refreshed.
- **LinkedIn:** organisation posts come from the LinkedIn Marketing / Community
  Management API, which needs the page's admin approval and an app review. This
  is the slower of the two to set up.

Until either exists, the widget is still useful: add posts by hand to
`galeForceFeedFallback` in `content/social.ts` (same shape as above). The
fallback is also what shows if the endpoint is ever down.

---

## Still TODO

`content/social.ts` ships with placeholder account entries — the real GaelForce
LinkedIn page URL and Instagram handle need to be filled in. Until they are, the
feed header simply omits the follow links.
