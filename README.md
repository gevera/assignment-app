# Assignment App

SvelteKit marketing surface + authenticated dashboard (en/de).

## Developing

```sh
pnpm install
pnpm dev
```

Copy `.env.example` to `.env` and set `AUTH_SECRET` (min 32 characters).

## Building

```sh
pnpm build
pnpm preview
```

## Quality gates

```sh
pnpm lint
pnpm check
pnpm test:unit -- --run
pnpm build && pnpm budget   # initial-route JS gzip budgets
pnpm lhci                   # Lighthouse CI (build first)
pnpm ci                     # local smoke: lint → check → unit → build → budget
```

### Bundle budget (`pnpm budget`)

After `pnpm build`, `scripts/check-bundle-budget.mjs` walks the Vite client manifest for each route’s entry + layout/page node chain (static `imports` only — dynamic chunks like SearchDialog are excluded).

| Surface         | Budget (gzip) |
| --------------- | ------------- |
| Public home     | ≤ 80 KB       |
| Dashboard items | ≤ 150 KB      |

### Lighthouse CI (`pnpm lhci`)

Mobile / Moto G Power–style throttling on `/en`, a prerendered blog slug, and `/en/dashboard/items` (Puppeteer mints a demo viewer session cookie). Asserts Perf / A11y / SEO / Best Practices ≥ 95 and LCP &lt; 2s, CLS &lt; 0.1, TBT &lt; 200ms (INP is not available in LH navigation mode).

## Deployment (Vercel)

Hosted on Vercel via `@sveltejs/adapter-vercel`. Routes declare their runtime with `export const config` from the adapter.

### Edge routes

| Route            | Why Edge                                                                                                                                                                                                                                                                                            |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/api/beacon`    | **Cold start:** tiny handler (JSON parse + Zod + 204). Edge wakes in milliseconds near the user. **Data locality:** fire-and-forget RUM from global clients; no DB or session state. **Dependencies:** Web APIs + `zod` only — no Node native modules.                                              |
| `/{lang}/search` | **Cold start:** read-only in-memory mock data + pure-JS `fuse.js`; small bundle, fast wake-up for the search dialog. **Data locality:** search TTFB benefits from running at the nearest PoP; data ships with the function. **Dependencies:** no `@resvg/resvg-js`, `fs`, or other native bindings. |

### Node routes

| Route                                  | Why Node                                                                                                                                                                                                                                                                                                                                                     |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/{lang}/blog` (ISR)                   | **Cold start:** most traffic hits the ISR CDN cache; regeneration is periodic, not per-request. **Data locality:** ISR cache is regional; Vercel regenerates via serverless Node. **Dependencies:** heavier listing work (pagination, tags, `fuse.js`, `ts-pattern`) plus existing `isr: { expiration: 300 }`.                                               |
| `/{lang}/login`, `/{lang}/dashboard/*` | **Cold start:** acceptable for authenticated flows where a session is already established. **Data locality:** JWT cookie verification and dashboard mutations share server-side in-memory state. **Dependencies:** form actions (login/logout, item PATCH) and `jose` JWT signing; Node keeps full Node.js APIs available for future DB/native integrations. |

### Environment variables

Copy [`.env.example`](.env.example) and set on Vercel:

- `AUTH_SECRET` — session JWT signing key (min 32 characters)
- `PUBLIC_SITE_URL` — production origin for canonical URLs and JSON-LD
- `PUBLIC_RUM_SAMPLE_RATE` — optional RUM sampling (defaults: 1 in dev, 0.1 in prod)
