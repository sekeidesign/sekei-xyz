import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { TooltipProvider, TooltipSurface } from "./ui-kit/Tooltip";
import { MotionProvider } from "./ui-kit/motion/MotionProvider";
import { NavigationTracker } from "./ui-kit/NavigationTracker";
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

/**
 * Fonts, providers and analytics only. The timeline chrome — sidebar, panels,
 * footer — lives in `(site)/layout.tsx`, so a route outside that group renders
 * on a bare page.
 */
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${geistPixel.variable} font-[family-name:var(--font-geist-sans)] text-[15px] antialiased`}
			>
				<NavigationTracker />
				<MotionProvider>
					<TooltipProvider delay={200} closeDelay={0} timeout={400}>
						<TooltipSurface />
						{children}
					</TooltipProvider>
				</MotionProvider>
				<Analytics />
			</body>
		</html>
	);
}
