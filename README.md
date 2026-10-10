# sekei.design

My site, live at [sekei.design](https://www.sekei.design): a timeline of shipped
work, case studies, reading notes and UI experiments. Next.js App Router,
Tailwind v4, Base UI, Motion.

## shad-fx

Canvas effects, published as a shadcn registry so they can be pulled into
another project. Ordered dither is the first renderer. The library lives in its
own repo; this site keeps a vendored copy under `components/shad-fx/` and hosts
the docs.

- [Library and source](https://github.com/sekeidesign/shad-fx)
- [Docs and playground](https://www.sekei.design/shad-fx)

`/registry/*` proxies that repo's `r/` (`app/registry/[...path]/route.ts`), so
the `@sekei` namespace keeps resolving through this domain, and counts one
install per item, IP and day. `/api/installs` returns the totals.

## Where things are

| Path | What lives there |
| --- | --- |
| `app/(site)/` | Everything wearing the sidebar: timeline, `/p/<slug>`, kitchen, lab |
| `app/shad-fx/` | The standalone registry docs page, no sidebar |
| `app/ui-kit/` | Shared components, imported as `@ui-kit/*` |
| `content/<slug>/` | One folder per timeline entry: `index.mdx`, `Preview.tsx` |
| `components/shad-fx/` | Vendored from [sekeidesign/shad-fx](https://github.com/sekeidesign/shad-fx) |

The root layout holds fonts, providers and analytics only. The site chrome is
`app/(site)/layout.tsx`, so a route outside that group renders on a bare page.
