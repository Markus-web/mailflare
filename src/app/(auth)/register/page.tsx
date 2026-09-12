import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthGuard } from "@/components/auth/auth-guard";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { hasAdminAccount } from "@/lib/auth/setup";
import { isPublicRegisterEnabled } from "@/lib/auth/public-register";
import { getEnv } from "@/lib/cloudflare";
import { getPrimaryDomain } from "@/lib/user";
import { ArrowRight, MailPlus } from "lucide-react";
import { PublicRegisterClient } from "./public-register-client";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
	const env = getEnv();
	if (!(await hasAdminAccount(env))) {
		redirect("/setup");
	}

	const domain = await getPrimaryDomain(env);
	if (!isPublicRegisterEnabled(env) || !domain) {
		return (
			<AuthGuard mode="public">
				<AuthShell
					icon={MailPlus}
					title="Rekisteröinti suljettu"
					footer={
						<Link href="/login" className="inline-flex items-center gap-2 hover:underline">
							Kirjaudu sisään
							<ArrowRight className="h-4 w-4" />
						</Link>
					}
				>
					<div className="space-y-5">
						<p className="text-sm leading-6 text-neutral-600">
							Uusia postilaatikoita ei voi luoda täällä juuri nyt. Jos tarvitset osoitteen, avaa tiketti
							Kotisivu.orgissa.
						</p>
						<Button asChild className="h-11 w-full rounded-full px-6">
							<a href="https://kotisivu.org/tuki/">Avaa Tuki</a>
						</Button>
						<Button asChild variant="outline" className="h-11 w-full rounded-full px-6">
							<Link href="/login">Kirjaudu</Link>
						</Button>
					</div>
				</AuthShell>
			</AuthGuard>
		);
	}

	return (
		<AuthGuard mode="public">
			<PublicRegisterClient domain={domain.hostname} />
		</AuthGuard>
	);
}
