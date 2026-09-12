import { redirect } from "next/navigation";
import { AuthGuard } from "@/components/auth/auth-guard";
import { hasAdminAccount } from "@/lib/auth/setup";
import { isPublicRegisterEnabled } from "@/lib/auth/public-register";
import { getEnv } from "@/lib/cloudflare";
import { getPrimaryDomain } from "@/lib/user";
import { PublicRegisterClient } from "./public-register-client";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
	const env = getEnv();
	if (!(await hasAdminAccount(env))) {
		redirect("/setup");
	}

	const domain = await getPrimaryDomain(env);
	// Admin-provisioned mailboxes: public register is off. Send guests to login
	// (the /api/auth/register endpoint also returns 403). Rendering a custom
	// "closed" shell here 500s in this Next build, so redirect instead.
	if (!isPublicRegisterEnabled(env) || !domain) {
		redirect("/login");
	}

	return (
		<AuthGuard mode="public">
			<PublicRegisterClient domain={domain.hostname} />
		</AuthGuard>
	);
}
