import type { Metadata } from "next";
import Image from "next/image";
import { EARLIER, ROLES, type Role, TOOLS } from "./data";

export const metadata: Metadata = {
	title: "Résumé",
	robots: { index: false, follow: false },
};

const CONTACT = [
	{ label: "pg.gonni@gmail.com", href: "mailto:pg.gonni@gmail.com" },
	{ label: "sekei.xyz", href: "https://www.sekei.xyz" },
	{ label: "github.com/sekeidesign", href: "https://github.com/sekeidesign" },
];

export default function ResumePage() {
	return (
		<div className="resume-stage">
			<article data-resume-sheet className="resume-sheet">
				<header className="flex items-start justify-between gap-8">
					<div>
						<h1 className="text-[27px] leading-none font-[550] text-gray-900">
							PG Gonni
						</h1>
						<p className="mt-1.5 text-[13px] font-[450] text-gray-500">
							Product Design Engineer · Montréal, QC
						</p>
					</div>
					<ul className="flex flex-col items-end gap-0.5 text-[11px] font-[450] text-gray-500">
						{CONTACT.map((item) => (
							<li key={item.href}>
								<a href={item.href} className="text-gray-900">
									{item.label}
								</a>
							</li>
						))}
					</ul>
				</header>

				<p className="mt-5 text-[12.5px] leading-relaxed font-[420] text-gray-600">
					Nine years designing, coding, and shipping products and websites.
				</p>

				<Section title="Experience">
					<div className="flex flex-col gap-4">
						{ROLES.map((role) => (
							<Entry key={role.company} role={role} />
						))}
					</div>
				</Section>

				<Section title="Earlier">
					<ul className="flex flex-col gap-1.5">
						{EARLIER.map((role) => (
							<li
								key={role.company}
								className="flex items-baseline justify-between gap-4"
							>
								<span className="text-[12px] font-[420] text-gray-600">
									<span className="font-[550] text-gray-900">{role.title}</span>
									{" · "}
									{role.company}
								</span>
								<Dates>{role.dates}</Dates>
							</li>
						))}
					</ul>
				</Section>

				<Section title="Tools">
					<p className="text-[12px] font-[420] text-gray-600">
						{TOOLS.join(" · ")}
					</p>
				</Section>
			</article>
		</div>
	);
}

function Section({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section className="mt-6 border-t border-gray-200 pt-4">
			<h2 className="mb-3 font-mono text-[9.5px] font-[400] uppercase tracking-[0.14em] text-gray-400">
				{title}
			</h2>
			{children}
		</section>
	);
}

function Entry({ role }: { role: Role }) {
	return (
		<div className="flex gap-3">
			<div className="mt-0.5 size-[18px] shrink-0 overflow-hidden rounded-[4px] ring ring-gray-500/10 ring-inset">
				{role.logo && (
					<Image
						src={role.logo}
						alt=""
						width={36}
						height={36}
						className="size-full object-cover"
					/>
				)}
			</div>
			<div className="min-w-0 flex-1">
				<div className="flex items-baseline justify-between gap-4">
					<h3 className="text-[12.5px] font-[550] text-gray-900">
						{role.title}
						<span className="font-[450] text-gray-500">{` · ${role.company}`}</span>
					</h3>
					<Dates>{role.dates}</Dates>
				</div>
				{role.summary && (
					<p className="mt-1 text-[12px] leading-relaxed font-[420] text-gray-600">
						{role.summary}
					</p>
				)}
				{role.points && (
					<ul className="mt-1.5 flex flex-col gap-1 text-[12px] leading-snug font-[420] text-gray-600">
						{role.points.map((point) => (
							<li key={point} className="flex gap-2">
								<span aria-hidden="true" className="text-gray-300">
									·
								</span>
								<span>{point}</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}

function Dates({ children }: { children: React.ReactNode }) {
	return (
		<span className="shrink-0 font-mono text-[10px] font-[350] whitespace-nowrap text-gray-400">
			{children}
		</span>
	);
}
