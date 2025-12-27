import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			new URL("http://127.0.0.1/**"),
			new URL("http://127.0.0.1:54321/**"),
			new URL("http://localhost:54321/**"),
			new URL("https://znxceegwwrhwjbhgrgof.supabase.co/storage/**"),
		],
	},
};

export default nextConfig;
