# Gym Tracker — provenance & extraction notes

## What this is

A Hevy-style gym / workout tracker, vendored here as a **starting point** for a
project of my own. It is deliberately self-contained in `gym-tracker/` and is
**not** part of the portfolio site build.

## Upstream

- Source: https://github.com/Snouzy/workout-cool
- License: MIT (see `LICENSE` in this directory — it must be kept)
- Vendored at: upstream `main`, version 1.3.2
- Git history was **not** kept — this is a snapshot, not a fork or submodule.

Why this one:
- Same stack as the portfolio (Next.js + TypeScript + Tailwind), so nothing new to learn.
- Actively maintained with a large contributor base.
- MIT licensed, so it can be built on and re-released freely.
- Ships the pieces a Hevy clone needs: exercise database, workout builder,
  session logging, progress tracking, auth, and a Prisma/Postgres schema.

## Isolation from the portfolio

- Lives entirely under `gym-tracker/`.
- Root `tsconfig.json` excludes `gym-tracker` so portfolio typechecks are unaffected.
- It has its own `package.json`, `.gitignore`, `next.config.ts` and lockfile.
  Dependencies are never installed at the portfolio root.

## Moving it to its own repo later

From the repository root:

```sh
# 1. Make a new empty repo on GitHub, then:
cd gym-tracker
git init
git add .
git commit -m "Initial commit (based on Snouzy/workout-cool, MIT)"
git remote add origin git@github.com:<you>/<new-repo>.git
git push -u origin main

# 2. Then drop it from the portfolio repo:
cd ..
git rm -r --cached gym-tracker && rm -rf gym-tracker
```

Because no upstream history was vendored, there is nothing to untangle.

## Running it

```sh
cd gym-tracker
cp .env.example .env      # fill in DATABASE_URL and auth secrets
pnpm install
pnpm prisma migrate deploy
pnpm db:seed              # loads the sample exercise database
pnpm dev
```

A Postgres instance is required; `docker-compose.yml` in this directory provides one.
See this directory's own `README.md` and `CONTRIBUTING.md` for upstream docs.
