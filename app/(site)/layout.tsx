import { getTimeline } from "@/lib/timeline";
import { Footer } from "../Footer";
import { Sidebar } from "../Sidebar";
import { FilterProvider } from "../ui-kit/filters/FilterContext";
import { SocialProvider } from "../ui-kit/social/SocialProvider";

export default function SiteLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<FilterProvider>
			<a
				href="#main"
				className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-[500] focus:text-gray-900 focus:ring focus:ring-gray-500/20 focus:shadow-skew"
			>
				Skip to content
			</a>
			<div className="w-full box-border flex md:flex-row flex-col justify-center mx-auto min-h-screen p-px gap-px">
				<div
					aria-hidden="true"
					className="panel stripes flex-1 shrink md:block hidden md:sticky md:top-px md:self-start md:h-[calc(100vh-2px)]"
				/>
				<Sidebar />
				<div className="panel flex flex-col w-full md:max-w-screen-md min-w-0">
					<main id="main" className="flex flex-col w-full p-2 md:p-5">
						{/* One counts fetch for the whole app, so navigating doesn't refetch. */}
						<SocialProvider slugs={getTimeline().map((entry) => entry.slug)}>
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
	);
}
