import type { ReactNode } from "react";

export function Section({
	title,
	id,
	children,
}: {
	title: string;
	id: string;
	children: ReactNode;
}) {
	return (
		<section id={id} className="flex scroll-mt-8 flex-col gap-4">
			<h2 className="font-pixel text-2xl leading-[1.35] text-gray-900">
				{title}
			</h2>
			{children}
		</section>
	);
}

export function P({ children }: { children: ReactNode }) {
	return (
		<p className="text-[15px] leading-[1.65] font-[420] text-gray-500">
			{children}
		</p>
	);
}

export function Code({ children }: { children: ReactNode }) {
	return (
		<code className="rounded bg-gray-200/70 px-1 py-0.5 font-mono text-[13px] text-gray-900">
			{children}
		</code>
	);
}

export function A({ href, children }: { href: string; children: ReactNode }) {
	return (
		<a href={href} className="text-gray-900 underline underline-offset-2">
			{children}
		</a>
	);
}

interface Row {
	key: string;
	cells: ReactNode[];
}

export function Table({ head, rows }: { head: string[]; rows: Row[] }) {
	return (
		<div className="overflow-x-auto">
			<table className="w-full border-collapse text-left">
				<thead>
					<tr className="border-b border-gray-300/70">
						{head.map((cell) => (
							<th
								key={cell}
								className="py-2 pr-4 font-mono text-[11px] font-[450] tracking-wide text-gray-400 uppercase"
							>
								{cell}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr key={row.key} className="border-b border-gray-200 align-top">
							{row.cells.map((cell, column) => (
								<td
									key={`${row.key}:${head[column]}`}
									className="py-2.5 pr-4 text-[14px] leading-[1.55] font-[420] text-gray-500"
								>
									{cell}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
