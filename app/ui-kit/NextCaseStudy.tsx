import { ArrowRightIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { SparkleDivider } from "./SparkleDivider";

interface NextCaseStudyProps {
	href: string;
	title: string;
}

export function NextCaseStudy({ href, title }: NextCaseStudyProps) {
	return (
		<>
			<SparkleDivider className="mt-10 mb-10" />
			<Link
				href={href}
				className="group block rounded-xl ring ring-gray-500/10 bg-gray-100 shadow-skew p-1"
			>
				<div className="flex items-center justify-between rounded-lg ring ring-gray-500/10 bg-white shadow-skew px-5 py-4">
					<div>
						<p className="text-sm font-[500] text-gray-500">Next case study</p>
						<p className="font-[550] text-gray-900">{title}</p>
					</div>
					<ArrowRightIcon className="w-4 h-4 shrink-0 text-gray-300 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-gray-500" />
				</div>
			</Link>
		</>
	);
}
