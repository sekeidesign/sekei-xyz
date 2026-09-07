import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { cn } from "@ui-kit/cn";
import { SparkleDivider } from "@ui-kit/SparkleDivider";
import { TextLink } from "@ui-kit/TextLink";

/** rehype's id for the sr-only heading that opens the footnotes section. */
const FOOTNOTE_LABEL_ID = "footnote-label";
const FOOTNOTE_ID_PREFIX = "user-content-fn-";
const FOOTNOTE_REF_ID_PREFIX = "user-content-fnref-";

// remark-gfm marks its generated footnote nodes with data attributes. They
// survive the hast -> JSX conversion as literal props, which the MDXComponents
// prop types don't know about.
const hasFlag = (props: object, flag: string) => flag in props;
const isFootnoteRef = (props: object) => hasFlag(props, "data-footnote-ref");
const isFootnoteBackref = (props: object) =>
	hasFlag(props, "data-footnote-backref");
const isFootnoteSection = (props: object) => hasFlag(props, "data-footnotes");

function BackToQuote() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			className="ml-0.5 inline-block size-4 shrink-0 align-[-0.3em] text-gray-400 group-hover:text-gray-900 group-focus-visible:text-gray-900"
		>
			<path
				d="M11.1387 8.44305L14.5817 5L18.0248 8.44305"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M14.5817 5.19922V13.3753C14.5817 16.4826 12.0628 19.0015 8.95558 19.0015H5.97461"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		h1: (props) => (
			<h1
				className="text-2xl md:text-3xl font-[550] text-gray-900 leading-tight mt-0 mb-4"
				{...props}
			/>
		),
		h2: ({ children, ...props }) =>
			// remark-gfm opens the footnotes section with an sr-only "Footnotes"
			// heading. It isn't a section break, so it gets no divider — the
			// section renderer below draws its own.
			props.id === FOOTNOTE_LABEL_ID ? (
				<h2 {...props}>{children}</h2>
			) : (
				<>
					<SparkleDivider className="mt-10 mb-10" />
					<h2
						className="text-xl font-[550] text-gray-900 leading-snug mb-3"
						{...props}
					>
						{children}
					</h2>
				</>
			),
		h3: (props) => (
			<h3
				className="text-base font-[550] text-gray-900 leading-snug mt-8 mb-2"
				{...props}
			/>
		),
		p: (props) => (
			<p
				className="text-gray-600 text-[15px] font-[420] leading-relaxed mb-4"
				{...props}
			/>
		),
		a: ({ href, children, ...props }) => {
			// The li renderer below wraps the whole note in the jump link, so the
			// backref can only contribute the icon — a nested anchor would not parse.
			if (isFootnoteBackref(props)) return <BackToQuote />;
			if (isFootnoteRef(props)) {
				const { className, ...rest } = props;
				return (
					<a
						href={href}
						{...rest}
						className={cn(
							"no-underline rounded-xs px-[2px] hover:text-gray-600 hover:underline focus:underline focus:outline-none focus:text-gray-600 focus:bg-gray-200",
							className,
						)}
					>
						{children}
					</a>
				);
			}
			return href?.startsWith("http") ? (
				<TextLink href={href} hasFavicon>
					{children}
				</TextLink>
			) : (
				<Link
					href={href ?? "#"}
					className="text-gray-900 font-[500] underline decoration-gray-300 hover:decoration-gray-900 underline-offset-2"
					{...props}
				>
					{children}
				</Link>
			);
		},
		ul: (props) => (
			<ul
				className="list-disc pl-5 text-gray-600 text-[15px] font-[420] leading-relaxed space-y-1 mb-4"
				{...props}
			/>
		),
		ol: (props) => (
			<ol
				className="list-decimal pl-5 text-gray-600 text-[15px] font-[420] leading-relaxed space-y-1 mb-4"
				{...props}
			/>
		),
		li: ({ children, ...props }) => {
			const id = typeof props.id === "string" ? props.id : "";
			if (!id.startsWith(FOOTNOTE_ID_PREFIX))
				return (
					<li className="pl-1" {...props}>
						{children}
					</li>
				);
			const name = id.slice(FOOTNOTE_ID_PREFIX.length);
			return (
				<li className="pl-1" {...props}>
					<a
						href={`#${FOOTNOTE_REF_ID_PREFIX}${name}`}
						className="group block no-underline focus:outline-none"
					>
						{children}
					</a>
				</li>
			);
		},
		strong: (props) => (
			<strong className="font-[600] text-gray-900" {...props} />
		),
		blockquote: (props) => (
			<blockquote
				className="border-l-2 border-gray-300 pl-4 text-gray-600 italic mb-4"
				{...props}
			/>
		),
		hr: (props) => <hr className="border-gray-200 my-8" {...props} />,
		code: (props) => (
			<code
				className="bg-gray-200/60 rounded px-1.5 py-0.5 text-[13px] font-mono text-gray-800"
				{...props}
			/>
		),
		pre: (props) => (
			<pre
				className="bg-gray-900 text-gray-50 rounded-md p-4 overflow-x-auto text-[13px] my-6"
				{...props}
			/>
		),
		sup: (props) => (
			// `align-super` sits the marker up near the cap line, which reads as a
			// jump mid-sentence. Baseline plus a small nudge keeps it in the line.
			<sup
				className="relative -top-[0.3em] p-1 font-mono text-[11px] text-gray-400"
				{...props}
			/>
		),
		section: ({ children, ...props }) => {
			if (!isFootnoteSection(props))
				return <section {...props}>{children}</section>;
			const { className, ...rest } = props;
			// Notes are apparatus, not prose: a size down from the body. The ol/li/p
			// renderers still run inside the list, so these walk over their classes.
			return (
				<section
					{...rest}
					className={cn(
						"mt-10",
						"[&_ol]:mb-0 [&_ol]:space-y-2 [&_ol]:text-[13px]",
						"[&_li]:scroll-mt-24 [&_li]:marker:text-gray-400",
						"[&_p]:mb-0 [&_p]:text-[13px] [&_p]:leading-relaxed",
						className,
					)}
				>
					<SparkleDivider className="mb-8" />
					{children}
				</section>
			);
		},
		// eslint-disable-next-line @next/next/no-img-element -- MDX authors
		// pass arbitrary images without known dimensions.
		img: ({ alt, ...props }) => (
			// react-doctor-disable-next-line nextjs-no-img-element -- MDX authors pass arbitrary images without known dimensions
			<img
				alt={alt ?? ""}
				className="block -mx-6 md:-mx-13 w-[calc(100%+3rem)] md:w-[calc(100%+6.5rem)] max-w-none h-auto my-6"
				{...props}
			/>
		),
		...components,
	};
}
