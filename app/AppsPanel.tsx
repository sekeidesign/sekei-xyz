import Image from "next/image";
import Link from "next/link";
import { NavigationIcon } from "./ui-kit/icons/NavigationIcon";
import { WifiIcon } from "./ui-kit/icons/WifiIcon";

const BATTERY_LEVEL = 82;

export function AppsPanel() {
	return (
		<div className="flex-1 panel p-4 md:p-6 overflow-hidden max-h-80 flex flex-col gap-6">
			<div className="relative z-10 flex flex-col">
				<p className="text-sm text-gray-400 tracking-tight">
					Currently building
				</p>
				<p className="text-sm font-[550] tracking-tight -mt-0.5 text-gray-800">
					Tomokanji: Kanji Widgets
				</p>
			</div>
			<div className="relative">
				<Image
					src="/iphone-bezels-silver.webp"
					alt=""
					width={1000}
					height={1000}
				/>
				<div className="absolute inset-0 p-8.5 flex flex-col gap-6">
					<div className="flex items-center justify-between gap-2 font-[450]">
						<div className="flex-1 flex items-center justify-center text-xs h-full gap-1">
							09:41 <NavigationIcon size={16} />
						</div>
						<div className="flex-1 flex items-center justify-center"></div>
						<div className="flex-1 flex items-center justify-center gap-1">
							<div className="flex gap-0.5 items-end">
								<div className="w-[3px] rounded-sm bg-gray-900 h-1" />
								<div className="w-[3px] rounded-sm bg-gray-900 h-1.5" />
								<div className="w-[3px] rounded-sm bg-gray-900/25 h-2" />
								<div className="w-[3px] rounded-sm bg-gray-900/25 h-2.5" />
							</div>
							<WifiIcon size={16} />
							<div className="relative w-[20px] h-[12px] flex items-center justify-center shrink-0">
								{/* terminal nub */}
								<div className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[1.5px] h-1 rounded-r-[1px] bg-gray-800/25" />
								{/* body outline */}
								<div className="absolute inset-0 rounded-[4px] bg-gray-800/25" />
								{/* charge level */}
								<div
									className="absolute left-0 top-0 bottom-0 rounded-[1px] rounded-l-[4px] bg-gray-900"
									style={{ width: `${BATTERY_LEVEL}%` }}
								/>
								<span className="relative z-10 text-[8px] font-bold text-white leading-none tabular-nums">
									{BATTERY_LEVEL}
								</span>
							</div>
						</div>
					</div>
					<Link
						href="https://www.tomokanji.app"
						className="flex group flex-col items-center justify-center w-fit text-[10px] text-gray-600 gap-1"
					>
						<Image
							src="/tomokanji-icon-light.jpg"
							alt=""
							width={56}
							height={56}
							className="rounded-[16px] group-hover:scale-103 transition-transform duration-150 group-hover:will-change-transform"
						/>
						Tomokanji
					</Link>
				</div>
			</div>
		</div>
	);
}
