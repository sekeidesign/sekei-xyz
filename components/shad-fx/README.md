# shad-fx (vendored)

These files are a copy. The source of truth is
[sekeidesign/shad-fx](https://github.com/sekeidesign/shad-fx), which also
serves the shadcn registry behind `@sekei`.

Do not fix bugs here. Fix them upstream, rebuild that repo's `r/`, then re-add
the affected items:

```bash
npx shadcn@latest add @sekei/shad-fx
```

shadcn copies files rather than adding a dependency, so this copy is what the
site actually renders — the RAID figure in `app/ui-kit/figures/` imports
`@/components/shad-fx/dither/...` and is unaffected by where the library lives.

Docs, playground and the API tables: [sekei.xyz/shad-fx](https://www.sekei.xyz/shad-fx),
built from `app/shad-fx/`.
