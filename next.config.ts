import type { NextConfig } from "next";
import createMDX from "@next/mdx";

type MDXOptions = NonNullable<Parameters<typeof createMDX>[0]>["options"];
type RemarkPlugins = NonNullable<NonNullable<MDXOptions>["remarkPlugins"]>;

const nextConfig: NextConfig = {
  // A production build and a running dev server both write to .next and
  // corrupt each other's manifests. Set NEXT_DIST_DIR to build into its own
  // directory while `pnpm dev` keeps running.
  distDir: process.env.NEXT_DIST_DIR || ".next",

  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],

  // Nothing imports the OG card's fonts, so tracing can't find them on its own
  // and the deployed function would ship without them.
  outputFileTracingIncludes: {
    "/p/**": ["./lib/og/fonts/*.ttf"],
  },

  // @sekei resolves through this domain rather than straight at GitHub, so the
  // namespace survives a repo rename and can pick up a second library later
  // without every consumer re-running `shadcn registry add`. The source of
  // truth is r/ in sekeidesign/shad-fx; nothing is copied back here.
  async rewrites() {
    return [
      {
        source: "/registry/:path*",
        destination:
          "https://raw.githubusercontent.com/sekeidesign/shad-fx/main/r/:path*",
      },
    ];
  },

  async redirects() {
    return [
      // Filters moved from route segments to a query param, so several can be
      // active at once.
      { source: "/timeline", destination: "/", permanent: true },
      ...["apps", "books", "experiments", "work", "writing", "photos"].flatMap(
        (slug) => [
          { source: `/${slug}`, destination: `/?kind=${slug}`, permanent: true },
          {
            source: `/timeline/${slug}`,
            destination: `/?kind=${slug}`,
            permanent: true,
          },
        ],
      ),
      { source: "/dither-fx", destination: "/shad-fx", permanent: true },
      // Case studies moved from route folders into content/, served by /p/<slug>.
      { source: "/case-studies/tato", destination: "/p/tato", permanent: true },
      {
        source: "/case-studies/tato/:slug",
        destination: "/p/:slug",
        permanent: true,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allow any domain
      },
    ],
  },

};

const withMDX = createMDX({
  options: {
    // Parses the YAML block in content/*/index.mdx so it stops rendering as
    // literal text, and re-exports it as `frontmatter`. Plugins named as strings,
    // not imported references: Turbopack serializes these options for its Rust MDX
    // loader, which turns a function into null.
    remarkPlugins: [
      ["remark-frontmatter"],
      ["remark-mdx-frontmatter", { name: "frontmatter" }],
      // Footnotes: `[^1]` in the body, `[^1]: ...` anywhere in the file. Also
      // brings the rest of GFM (tables, strikethrough, autolinks).
      ["remark-gfm"],
    ] as unknown as RemarkPlugins,
  },
});

export default withMDX(nextConfig);
