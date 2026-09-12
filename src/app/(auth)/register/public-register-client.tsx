"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, MailPlus } from "lucide-react";
import { useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TurnstileField } from "@/components/auth/turnstile";
import { submitRegistration } from "./utils";

type Props = {
	domain: string;
};

export function PublicRegisterClient({ domain }: Props) {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [turnstileReset, setTurnstileReset] = useState(0);

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const form = new FormData(e.currentTarget);
		const { ok, data } = await submitRegistration(form, {
			firstRun: false,
			domain,
		});
		setLoading(false);
		if (!ok) {
			setError(typeof data.error === "string" ? data.error : "Rekisteröinti epäonnistui");
			setTurnstileReset((value) => value + 1);
			return;
		}
		router.push(data.redirect ?? "/inbox");
	}

	return (
		<AuthShell
			icon={MailPlus}
			title="Luo postilaatikko"
			footer={
				<Link href="/login" className="inline-flex items-center gap-2 hover:underline">
					Kirjaudu sisään
					<ArrowRight className="h-4 w-4" />
				</Link>
			}
		>
			<form method="post" onSubmit={onSubmit} className="space-y-5">
				<div className="space-y-2">
					<Label htmlFor="username">Käyttäjätunnus</Label>
					<div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
						<Input
							id="username"
							name="username"
							placeholder="nimi"
							autoComplete="username"
							required
							className="pr-40"
						/>
						<span className="absolute right-5 top-2.5 max-w-36 truncate text-sm font-medium text-neutral-500">
							@{domain}
						</span>
					</div>
				</div>
				<div className="space-y-2">
					<Label htmlFor="password">Salasana</Label>
					<Input
						id="password"
						name="password"
						type="password"
						minLength={8}
						autoComplete="new-password"
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="resetEmail">Palautussähköposti</Label>
					<Input
						id="resetEmail"
						name="resetEmail"
						type="email"
						placeholder="sinä@esimerkki.fi"
						autoComplete="email"
						required
					/>
				</div>
				<TurnstileField resetKey={turnstileReset} />
				{error && (
					<p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
						{error}
					</p>
				)}
				<Button type="submit" className="h-11 w-full rounded-full px-6 active:scale-[0.98]" disabled={loading}>
					{loading ? "Luodaan…" : "Luo tili"}
				</Button>
			</form>
		</AuthShell>
	);
}
