import { after } from "next/server";
import { recordInstall } from "@/lib/installs";

const UPSTREAM = "https://raw.githubusercontent.com/sekeidesign/shad-fx/main/r";

const ITEM = /^([a-z0-9-]+)\.json$/;

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const { path } = await params;
	const upstream = await fetch(`${UPSTREAM}/${path.join("/")}`, {
		next: { revalidate: 300 },
	});

	if (!upstream.ok) {
		return new Response(null, { status: upstream.status });
	}

	// registry.json is fetched by `shadcn search` and `list`, not by an install.
	const item = path.length === 1 ? ITEM.exec(path[0])?.[1] : undefined;
	if (item && item !== "registry") {
		const ip =
			request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
			request.headers.get("x-real-ip") ??
			"unknown";
		after(() => recordInstall(item, ip));
	}

	return new Response(upstream.body, {
		headers: {
			// GitHub raw serves everything as text/plain.
			"content-type": path.at(-1)?.endsWith(".json")
				? "application/json; charset=utf-8"
				: (upstream.headers.get("content-type") ?? "text/plain"),
			"cache-control": "public, max-age=0, must-revalidate",
		},
	});
}
