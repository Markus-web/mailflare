import { getEnv } from "@/lib/cloudflare";
import { hasAdminAccount } from "@/lib/auth/setup";
import { isPublicRegisterEnabled } from "@/lib/auth/public-register";
import { getPrimaryDomain } from "@/lib/user";
import { HomeClient } from "./home-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
	const env = getEnv();
	const [adminExists, domain] = await Promise.all([hasAdminAccount(env), getPrimaryDomain(env)]);
	const publicRegister = isPublicRegisterEnabled(env) && adminExists && !!domain;
	return <HomeClient publicRegister={publicRegister} />;
}
