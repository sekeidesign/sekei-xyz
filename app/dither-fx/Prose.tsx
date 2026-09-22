import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
			<h2 className="font-pixel text-xl leading-[1.35] font-[600] text-gray-900">
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

export function Code({ children, className }: { children: ReactNode, className?: string }) {
	return (
		<code className={cn("rounded bg-gray-200/70 px-1 py-0.5 whitespace-nowrap font-mono text-[13px] text-gray-900", className)}>
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

export function Table({
	head,
	rows,
	widths,
}: {
	head: string[];
	rows: Row[];
	/** Column widths. Given, the table is fixed-layout so a run of tables lines up. */
	widths?: string[];
}) {
	return (
		<div className="overflow-x-auto">
			<table
				className={
					widths
						? "w-full min-w-[40rem] table-fixed border-collapse text-left"
						: "w-full border-collapse text-left"
				}
			>
				{widths && (
					<colgroup>
						{head.map((cell, column) => (
							<col key={cell} style={{ width: widths[column] }} />
						))}
					</colgroup>
				)}
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
