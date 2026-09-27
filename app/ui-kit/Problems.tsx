import { Surface } from "./Surface";

interface ProblemsProps {
	items: string[];
	label?: string;
}

export function Problems({ items, label = "Problems" }: ProblemsProps) {
	return (
		<Surface className="my-6">
			<div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50">
				<span className="text-sm font-[550] text-gray-900">{label}</span>
				<span className="text-sm font-[500] text-gray-500 tabular-nums">
					{items.length}
				</span>
			</div>
			<ul className="divide-y divide-gray-100">
				{items.map((item, index) => (
					<li key={item} className="flex gap-4 px-5 py-4">
						<span className="font-mono text-xs text-gray-300 pt-1 tabular-nums shrink-0">
							{String(index + 1).padStart(2, "0")}
						</span>
						<p className="text-lg font-[450] text-gray-900 leading-snug">
							{item}
						</p>
					</li>
				))}
			</ul>
		</Surface>
	);
}
