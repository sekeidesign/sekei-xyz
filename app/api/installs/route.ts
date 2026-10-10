import { NextResponse } from "next/server";
import { readDailyInstalls, readInstalls } from "@/lib/installs";

export const dynamic = "force-dynamic";

export async function GET() {
	const [total, daily] = await Promise.all([
		readInstalls(),
		readDailyInstalls(30),
	]);
	return NextResponse.json({ total, daily });
}
