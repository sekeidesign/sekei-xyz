import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Sidebar } from "./Sidebar";
import { FilterProvider } from "./ui-kit/filters/FilterContext";
import { SocialProvider } from "./ui-kit/social/SocialProvider";
import { TooltipProvider, TooltipSurface } from "./ui-kit/Tooltip";
import { getTimeline } from "@/lib/timeline";
import { Footer } from "./Footer";
import { MotionProvider } from "./ui-kit/motion/MotionProvider";
import { siteUrl } from "@/lib/site";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

// Self-hosted rather than next/font/google: this Next's bundled font list
// predates Geist Pixel, so there's no Geist_Pixel export to import.
const geistPixel = localFont({
	src: "./fonts/GeistPixel-Regular.ttf",
	variable: "--font-geist-pixel",
	weight: "400",
	display: "swap",
});

export const metadata: Metadata = {
	title: {
		default: "PG Gonni | Building software in Montréal",
		template: "%s | PG Gonni",
	},
	description:
		"PG Gonni is a design engineer in Montréal building interface experiments, apps and case studies. A running timeline of what he ships, reads and writes.",
	// react-doctor-disable-next-line no-unguarded-throwing-parse-call -- siteUrl is either a literal or "https://" plus a non-empty host, so both branches parse
	metadataBase: new URL(siteUrl),
	openGraph: {
		title: "PG Gonni | Building software in Montréal",
		description: "Design Engineer making beautiful software",
		images: "/og-image.jpg",
		type: "website",
		siteName: "PG Gonni",
	},
	icons: {
		// app/favicon.ico is emitted ahead of these by the file convention, and it
		// is what crawlers and feed readers pick up — most ignore `media` and take
		// the first icon they see.
		icon: [
			{
				url: "/icons/favicon-light.svg",
				type: "image/svg+xml",
				media: "(prefers-color-scheme: light)",
			},
			{
				url: "/icons/favicon-dark.svg",
				type: "image/svg+xml",
				media: "(prefers-color-scheme: dark)",
			},
		],
		apple: "/apple-icon.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${geistPixel.variable} antialiased`}
			>
				<MotionProvider>
					<TooltipProvider delay={200} closeDelay={0} timeout={400}>
						<TooltipSurface />
						<FilterProvider>
							<a
								href="#main"
								className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-[500] focus:text-gray-900 focus:ring focus:ring-gray-500/20 focus:shadow-skew"
							>
								Skip to content
							</a>
							<div className="font-[family-name:var(--font-geist-sans)] w-full box-border text-[15px] flex md:flex-row flex-col justify-center mx-auto min-h-screen p-px gap-px">
								<div
									aria-hidden="true"
									className="panel stripes flex-1 shrink md:block hidden md:sticky md:top-px md:self-start md:h-[calc(100vh-2px)]"
								/>
								<Sidebar />
								<div className="panel flex flex-col w-full md:max-w-screen-md min-w-0">
									<main id="main" className="flex flex-col w-full p-2 md:p-5">
										{/* One counts fetch for the whole app, so navigating doesn't refetch. */}
										<SocialProvider
											slugs={getTimeline().map((entry) => entry.slug)}
										>
											{children}
										</SocialProvider>
									</main>
									<Footer className="md:hidden grid" />
								</div>
								<div
									aria-hidden="true"
									className="panel stripes flex-1 shrink md:block hidden md:sticky md:top-px md:self-start md:h-[calc(100vh-2px)]"
								/>
							</div>
						</FilterProvider>
					</TooltipProvider>
				</MotionProvider>
				<Analytics />
			</body>
		</html>
	);
}
