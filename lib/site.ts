// Pinned to the production domain, a preview's OG paths resolve against
// whatever production serves — so a card that only exists on the branch 404s.
export const siteUrl =
	process.env.VERCEL_ENV !== "production" && process.env.VERCEL_URL
		? `https://${process.env.VERCEL_URL}`
		: "https://www.sekei.xyz";
