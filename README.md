# sekei.xyz

My site, live at [sekei.xyz](https://www.sekei.xyz): a timeline of shipped
work, case studies, reading notes and UI experiments. Next.js App Router,
Tailwind v4, Base UI, Motion.

## Dither FX

Ordered-dither canvas effects, published as a shadcn registry so they can be
pulled into another project.

- [Library and source](components/dither-fx/README.md)
- [Docs and playground](https://www.sekei.xyz/dither-fx)

## Where things are

| Path | What lives there |
| --- | --- |
| `app/(site)/` | Everything wearing the sidebar: timeline, `/p/<slug>`, kitchen, lab |
| `app/dither-fx/` | The standalone registry docs page, no sidebar |
| `app/ui-kit/` | Shared components, imported as `@ui-kit/*` |
| `content/<slug>/` | One folder per timeline entry: `index.mdx`, `Preview.tsx` |
| `components/dither-fx/` | The published library |
| `registry.json` | Registry source of truth, built into `public/registry/` |

The root layout holds fonts, providers and analytics only. The site chrome is
`app/(site)/layout.tsx`, so a route outside that group renders on a bare page.
