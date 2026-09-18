# sekei.xyz

My site, live at [sekei.xyz](https://www.sekei.xyz): a timeline of shipped
work, case studies, reading notes and UI experiments. Next.js App Router,
Tailwind v4, Base UI, Motion.

## Dither FX

Ordered-dither canvas effects, published as a shadcn registry so they can be
pulled into another project. The library lives in its own repo now; this site
keeps a vendored copy under `components/dither-fx/` and hosts the docs.

- [Library and source](https://github.com/sekeidesign/dither-fx)
- [Docs and playground](https://www.sekei.xyz/dither-fx)

`/registry/*` is a rewrite in `next.config.ts` onto that repo's `r/`, so the
`@sekei` namespace keeps resolving through this domain.

## Where things are

| Path | What lives there |
| --- | --- |
| `app/(site)/` | Everything wearing the sidebar: timeline, `/p/<slug>`, kitchen, lab |
| `app/dither-fx/` | The standalone registry docs page, no sidebar |
| `app/ui-kit/` | Shared components, imported as `@ui-kit/*` |
| `content/<slug>/` | One folder per timeline entry: `index.mdx`, `Preview.tsx` |
| `components/dither-fx/` | Vendored from [sekeidesign/dither-fx](https://github.com/sekeidesign/dither-fx) |

The root layout holds fonts, providers and analytics only. The site chrome is
`app/(site)/layout.tsx`, so a route outside that group renders on a bare page.
