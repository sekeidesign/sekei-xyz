# sekei.xyz

PG Gonni's site: a timeline of shipped work, case studies, reading notes and UI
experiments. Next.js App Router, Tailwind v4, Base UI, Motion.

It also publishes a [shadcn](https://ui.shadcn.com) registry — see
[Dither FX](components/dither-fx/README.md) for the library and
[/dither-fx](https://www.sekei.xyz/dither-fx) for its docs page.

## Running it

```bash
pnpm install
pnpm dev
```

`dev` and `build` both run `scripts/generate-previews.mjs` first, which writes
`content/previews.generated.ts` from every `content/<slug>/Preview.tsx`. That
file is committed; regenerate it with `pnpm content:sync` if a preview appears
missing.

## Layout

| Path | What lives there |
| --- | --- |
| `app/(site)/` | Everything wearing the sidebar: timeline, `/p/<slug>`, kitchen, lab |
| `app/dither-fx/` | The standalone registry docs page, no sidebar |
| `app/ui-kit/` | Shared components, imported as `@ui-kit/*` |
| `content/<slug>/` | One folder per timeline entry: `index.mdx`, `Preview.tsx` |
| `components/dither-fx/` | The published library |
| `registry.json` | Registry source of truth |
| `public/registry/` | Built registry, served at `/registry/<item>.json` |

The root layout holds fonts, providers and analytics only. The site chrome is
`app/(site)/layout.tsx`, so a route outside that group renders on a bare page.

## Registry

```bash
pnpm registry:build   # rebuild public/registry from registry.json
pnpm registry:check   # fail if public/registry is stale (offline)
```

`registry:build` shells out to a pinned `npx shadcn`, so it is not wired into
`build`. Run `registry:check` before committing; it is offline and instant.

## Checks

```bash
pnpm lint
pnpm doctor
npx tsc --noEmit
```

Building while `pnpm dev` is running corrupts `.next`. Use a dist dir of your
own instead:

```bash
NEXT_DIST_DIR=.next-verify npx next build
```

That rewrites `tsconfig.json` and `next-env.d.ts`; revert both afterwards.
