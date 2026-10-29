# resQ

Appliance care and repair platform — customer-facing booking experience plus an internal operations console.

Live: https://res-q-sepia-pi.vercel.app/

> **Note:** The platform currently runs on a static simulation layer (`src/lib/platformData.js`). All entities are seed data exported as JavaScript arrays; in production these would be replaced by API calls to a backend service. No mutations persist across page reloads. See [`docs/architecture.md`](docs/architecture.md) for details.

## Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- React 18
- Tailwind CSS 3

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:3000.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint via `next lint` |

## Project layout

```
src/
  app/          App Router routes — public pages plus the /ops console
  components/   Shared UI components
  context/      React context providers (auth, theme)
  lib/          Seed data, SLA logic, translations, pincodes
docs/           Architecture, ERD, event catalogue, requirement coverage
public/         Static assets
```

The customer-facing routes live at the top level (`/`, `/all-services`, `/track`, `/my-bookings`, …). The internal operations console is grouped under `/ops`, covering customer operations, service delivery, and quality and intelligence.

## Documentation

| Document | Contents |
|---|---|
| [`docs/architecture.md`](docs/architecture.md) | Module structure, routes, and primary users |
| [`docs/erd.md`](docs/erd.md) | Entity relationships |
| [`docs/event-catalogue.md`](docs/event-catalogue.md) | Platform events |
| [`docs/module-dependencies.md`](docs/module-dependencies.md) | Inter-module dependencies |
| [`docs/requirement-coverage.md`](docs/requirement-coverage.md) | Requirement traceability |

## Deployment

Deployed on Vercel. Pushes to `main` trigger a production deployment automatically.

## Development workflow

Changes are made in the local clone, verified with `npm run build`, and pushed directly to `main`. Each push to `main` is deployed to production by Vercel within about a minute.
