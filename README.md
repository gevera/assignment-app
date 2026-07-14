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

Mobile / Moto G Power–style throttling on `/en`, a prerendered blog slug, and `/en/dashboard/items` (Puppeteer mints a demo session cookie). Asserts Perf / A11y / SEO / Best Practices ≥ 95 and LCP &lt; 2s, CLS &lt; 0.1, TBT &lt; 200ms (INP is not available in LH navigation mode).
