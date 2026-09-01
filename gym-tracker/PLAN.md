# Two-Man Gym Tracker — Build Plan

A private, competitive workout tracker for exactly two users (me and my brother).
Built on the vendored `workout-cool` base (see `PROVENANCE.md`).

The point of the app is not to log workouts. Plenty of apps do that. The point is
to answer one question at a glance: **who is more locked in right now?**

---

## 1. Design principles

These constrain every decision below.

1. **Two users, forever.** No signup flow, no multi-tenancy, no permissions
   system. Two allowlisted accounts. This removes an enormous amount of work
   and lets every screen be a head-to-head comparison by default.
2. **Every number is a comparison.** A stat shown alone is a wasted pixel.
   Volume is shown as *mine vs his*. Steps are shown as *mine vs his*.
3. **Consistency beats strength.** He may be bigger, I may be lighter. An app
   that just ranks raw numbers gets boring the moment one of us is ahead. The
   scoring must reward showing up and improving, so it stays close.
4. **Zero-friction logging.** If logging a set takes more than two taps mid-set,
   we stop using the app and the whole thing dies.

---

## 2. The competition model

This is the core design work, and the part worth getting right before writing code.

### 2.1 Why not just compare totals

Raw total volume (sets x reps x weight) rewards whoever is heavier and has been
training longer. Once one of us is reliably ahead, the other stops caring. The
scoring system has to be *self-balancing*.

### 2.2 The Locked-In Score

One number per person, per week. Recomputed nightly. Five components:

| Component | Weight | What it measures | Why |
|---|---|---|---|
| **Consistency** | 30 | Sessions completed vs. sessions targeted this week | Showing up is the whole game |
| **Volume progression** | 25 | This week's tonnage vs. *your own* 4-week average | Self-relative, so body size doesn't matter |
| **Strength progression** | 20 | Sum of estimated 1RM gains across your main lifts | Rewards actually getting stronger |
| **Steps** | 15 | Daily step average vs. an agreed shared target | The one fair absolute comparison |
| **Streak bonus** | 10 | Consecutive weeks hitting the session target | Punishes dropping off hard |

Everything except steps is measured **against your own past self**, not against
your brother. That's what keeps it competitive instead of settled. The winner
each week is whoever improved most, not whoever is bigger.

Estimated 1RM uses Epley: `weight * (1 + reps / 30)`. Good enough under ~10 reps,
which is where the main lifts live.

### 2.3 Season structure

- A **week** runs Monday to Sunday. Each week has a winner and is worth 1 point.
- A **season** is 12 weeks. Whoever has more weekly wins takes the season.
- Season history is kept forever. The all-time head-to-head record is the single
  most important number in the app and belongs at the top of the home screen.
- Ties go to whoever had more sessions. Then to whoever had more steps.

### 2.4 Anti-cheese rules

Worth deciding now, because we will absolutely try to game this.

- Volume from any single set is capped at 1.5x your best-ever set for that
  exercise. Stops someone typing 500kg to spike their week.
- A session under 10 minutes or 3 sets doesn't count toward Consistency.
- Steps cap at 25,000/day for scoring, so nobody wins a week in a car.
- Editing a session more than 48h after it ended flags it in the UI. Not
  blocked, just visible. Social pressure is the enforcement mechanism.

---

## 3. Screens

Only four matter for v1.

**Home / Scoreboard.** All-time head-to-head record at the top. Current week's
Locked-In Score for both of us side by side, with the five components broken out
so you can see *why* you're losing. Current streaks. Days left in the week.

**Log.** The workout logger. Inherited from the base app, stripped down. Big
tap targets, rest timer, previous session's numbers pre-filled as the target to
beat. This screen must be fast; it's used mid-set with sweaty hands.

**Graphs.** Where the arguments get settled:
- Weekly tonnage, two lines, mine and his, over the whole season.
- Estimated 1RM per main lift, two lines, over time.
- Daily steps, two lines, 30-day rolling.
- Consistency heatmap — a calendar grid per person, one square per day, shaded
  by session volume. The single most damning graph when someone slacks off.
- Bodyweight over time, if we bother logging it.

**History.** Past sessions, past weeks, past seasons. Read-only.

---

## 4. Wearable / step sync

Researched in detail, because this is the part with real external constraints.

### 4.1 What we're actually dealing with

The **Google Fitbit Air** (2026, $99, screenless) syncs over Bluetooth into the
**Google Health app**, which replaced the old Fitbit app. It tracks steps, heart
rate, active zone minutes, distance, calories and sleep. It works on both iOS
16.4+ and Android 11+, which matters because we're on one of each.

Two things make this harder than it looks:

- **The legacy Fitbit Web API is being turned off in September 2026** — i.e. now.
  Any tutorial or library referencing `api.fitbit.com` OAuth is dead on arrival.
  The replacement is the **Google Health API**, using standard Google OAuth 2.0,
  with the old 120+ endpoints collapsed into ~31 data types.
- **All Google Health API scopes are "Restricted."** Restricted scopes normally
  require OAuth app verification *plus* an annual third-party CASA security
  assessment, which takes weeks and is absurd for a two-person app.

### 4.2 The unlock

**Unverified apps are capped at 100 users — and we need two.**

We never complete verification. We stay unverified forever, click through the
"Google hasn't verified this app" warning once each, and remain permanently
inside the free allowance. No CASA, no review, no weeks of waiting.

### 4.3 The one real gotcha

Google OAuth publishing status changes token lifetime:

- **Testing** status → refresh tokens **expire after 7 days**. Automated nightly
  sync would break every week with `invalid_grant`, needing a manual re-auth.
- **In Production** status (still unverified, still 100-user capped) → refresh
  tokens do **not** expire.

So: publish the OAuth consent screen to Production, do *not* submit for
verification, accept the scary warning screen. That's the configuration we want.

**Risk to verify early:** it's possible Google refuses to serve Restricted health
scopes at all to an unverified app in production. Nobody should build on this
assumption without testing it. See Phase 3 below — we test this with a throwaway
project *before* writing any sync code.

### 4.4 Fallbacks, in order

1. **Weekly re-auth.** If we're stuck in Testing mode, each of us taps a
   "reconnect" button once a week. Ugly, but it's two people and takes 5 seconds.
2. **Health Connect (Android brother only).** The Google Health app syncs into
   Health Connect on Android. A tiny companion Android app can read steps from
   Health Connect on-device and POST them to our server — this bypasses Google's
   OAuth verification *entirely*. Doesn't help the iPhone side.
3. **Apple HealthKit + Shortcuts (iPhone brother).** An automation that reads
   step count each evening and POSTs it. No app review needed.
4. **Manual entry.** One number, once a day.

Because we're on one Android and one iPhone, the **Google Health API is the only
route that treats us both identically** — hence it's the target, with 2/3 as the
per-platform backup if it disappoints.

### 4.5 Decision: this is Phase 3, not Phase 1

Agreed approach is to ship the competitive tracker with **manual daily step
entry** first, and automate later. Steps are one integer per person per day. The
scoring engine must not care where that integer came from — so the step source is
an interface from day one, with `ManualStepSource` as the first implementation and
`GoogleHealthStepSource` slotting in behind it later. No rewrites.

---

## 5. What to change in the base app

The base is a full fitness *platform*. We need maybe 40% of it.

### 5.1 Rip out

Dead weight that adds config, secrets and failure modes for features we'll never use:

- `Subscription`, `SubscriptionPlan`, `PlanProviderMapping`, `License`,
  `RevenueCatWebhookEvent` models + all Stripe and RevenueCat code and webhooks
- The `emails/` transactional email setup
- OpenPanel analytics
- `ProgramCoach` and the public/marketing program browsing
- Public exercise submission and moderation
- i18n (`locales/`) — we speak one language, and it's a lot of files to carry

### 5.2 Keep

- The **exercise database** and its attribute system. This is the single most
  valuable thing we're inheriting; building it by hand would take weeks.
- `WorkoutSession` / `WorkoutSessionExercise` / `WorkoutSet` — the logging core.
  Note `WorkoutSet` stores values in parallel arrays (`valuesInt`, `valuesSec`,
  `units`), which is flexible but awkward to aggregate. The nightly scoring job
  should flatten these into a clean `DailyStat` table rather than re-parsing
  arrays on every page load.
- `Program` / `ProgramWeek` / `ProgramSession` if we want shared routines.
- Auth, cut down to two allowlisted emails.

### 5.3 Add

```
model DailyStat        // one row per user per day — flattened, pre-aggregated
  userId, date, tonnage, sets, sessions, steps, estimated1rmDeltas, bodyweight

model WeeklyScore      // one row per user per week — the Locked-In Score
  userId, weekStart, consistency, volumeProgression, strengthProgression,
  steps, streakBonus, total, won

model Season           // 12-week blocks
  startWeek, endWeek, winnerUserId

model StepEntry        // source-agnostic, per 4.5
  userId, date, count, source ("manual" | "google_health" | "health_connect")
```

`DailyStat` and `WeeklyScore` are derived tables — always safe to delete and
rebuild from raw sessions. Keep them that way; it makes changing the scoring
formula painless, and we *will* change the scoring formula.

---

## 6. Hosting

- **App:** Vercel free tier. It's a Next.js app; this is a two-click deploy.
- **Database:** Neon or Supabase free Postgres. Two users generate a trivial
  amount of data — we will not outgrow a free tier this decade.
- **Nightly job:** a Vercel Cron hitting an authenticated route that recomputes
  `DailyStat` and `WeeklyScore`. Runs at ~03:00 local.
- **Cost target:** zero per month. There is no reason this ever costs money.

---

## 7. Phases

**Phase 1 — Make it ours.** Strip section 5.1. Cut auth to two accounts. Get it
deployed and logging real workouts. *Done when we've both logged a real session
on our phones.* Nothing else matters until this is true — an app we don't use is
worth zero regardless of features.

**Phase 2 — Make it competitive.** Add the schema in 5.3, the nightly scoring
job, the Scoreboard, and the Graphs screen. Manual step entry. *Done when a week
ends and the app declares a winner by itself.*

**Phase 3 — Make it automatic.** First task is a throwaway spike: confirm the
4.3 assumption (unverified + Production + Restricted scopes actually works)
before building anything. Then the Google Health sync behind the `StepSource`
interface. *Done when neither of us has typed a step count in a fortnight.*

**Phase 4 — Make it sting.** The fun stuff, once it's a habit: PR notifications
to each other, weekly recap, rest-day callouts, forfeits for losing a season.
This is the layer that actually keeps two brothers using an app, and it's
deliberately last, because it's worthless without Phases 1-3 working.

---

## 8. Open questions

- What's the weekly session target — fixed at 4 for both, or set individually?
  Individual is fairer, but gameable by setting it low. Leaning fixed.
- Which lifts count as "main lifts" for strength progression? Needs to be a
  short, agreed, fixed list or the metric is noise.
- Do we log bodyweight? It makes volume comparison fairer but nobody enjoys it.
- Season length — is 12 weeks too long for the first one? An initial 4-week
  season would surface scoring problems much faster.
