"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChangePasswordForm } from "./change-password-form";
import { EmailClientsSettings } from "./email-clients-settings";
import { MfaSettings } from "./mfa-settings";
import { ForwardingEmailForm } from "./forwarding-email-form";
import { MailboxSignatureForm } from "./mailbox-signature-form";
import { ProfileForm } from "./profile-form";
import type { AccountSettingsResponse } from "./types";
import { loadAccountSettings } from "./utils";

export function AccountSettings() {
	const [user, setUser] = useState<AccountSettingsResponse["user"]>();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		loadAccountSettings()
			.then((nextUser) => {
				if (!cancelled) setUser(nextUser);
			})
			.catch((err) => {
				if (!cancelled) setError(err instanceof Error ? err.message : "Tilin lataus epäonnistui");
			});

		return () => {
			cancelled = true;
		};
	}, []);

	if (error) {
		return <p className="py-8 text-sm text-red-600">{error}</p>;
	}

	if (!user) {
		return (
			<div className="space-y-6 py-4">
				<Skeleton className="h-9 w-40" />
				<Skeleton className="h-72 w-full rounded-3xl" />
			</div>
		);
	}

	return (
		<div className="space-y-8 py-4">
			{/* <div>
				<h1 className="text-3xl font-medium text-neutral-900">Tili</h1>
				<p className="mt-1 text-sm text-neutral-500">Hallitse tilitietojasi ja kirjautumissalasanaasi.</p>
			</div> */}

			<section className="space-y-4">
				<div>
					<h2 className="text-xl font-semibold text-neutral-900">Tilin tiedot</h2>
					<p className="mt-1 text-sm text-neutral-500">Hallitse henkilöllisyyttäsi, palautusvaihtoehtojasi ja sähköpostiasetuksiasi.</p>
				</div>
				<div className="space-y-1 overflow-hidden rounded-3xl">
					<ProfileForm
						initialName={user.name}
						initialResetEmail={user.resetEmail ?? ""}
						email={user.email}
					/>

					{user.canForwardEmail && (
						<div className="space-y-4 rounded-lg bg-white p-6">
							<div>
								<h3 className="text-lg font-semibold text-neutral-900">Sähköpostin edelleenlähetys</h3>
								<p className="mt-1 text-sm text-neutral-500">Lähetä saapuvien viestien kopio toiseen sähköpostiosoitteeseen.</p>
							</div>
						<ForwardingEmailForm initialForwardingEmail={user.forwardingEmail ?? ""} />
						</div>
					)}

					<div className="space-y-4 rounded-b-3xl rounded-t-lg bg-white p-6">
						<div>
							<h3 className="text-lg font-semibold text-neutral-900">Sähköpostin allekirjoitus</h3>
							<p className="mt-1 text-sm text-neutral-500">Määritä allekirjoitus yläpuolella valitulle postilaatikolle.</p>
						</div>
					<MailboxSignatureForm />
					</div>
				</div>
			</section>

			<section className="space-y-4">
				<div>
					<h2 className="text-xl font-semibold text-neutral-900">Turvallisuus</h2>
					<p className="mt-1 text-sm text-neutral-500">Hallitse kirjautumistapojasi.</p>
				</div>
				<div className="space-y-4 rounded-3xl bg-white p-6">
					<div>
						<h3 className="text-lg font-semibold text-neutral-900">Vaihda salasana</h3>
						<p className="mt-1 text-sm text-neutral-500">Käytä uudessa salasanassa vähintään 8 merkkiä.</p>
					</div>
					<ChangePasswordForm />
				</div>
				<div className="space-y-4 rounded-3xl bg-white p-6">
					<div>
						<h3 className="text-lg font-semibold text-neutral-900">Kaksivaiheinen tunnistautuminen</h3>
						<p className="mt-1 text-sm text-neutral-500">Vaadi todennusohjelman koodi kirjautumisen yhteydessä.</p>
					</div>
					<MfaSettings />
				</div>
			</section>

			<section className="space-y-4">
				<div>
					<h2 className="text-xl font-semibold text-neutral-900">Sähköpostisovellukset</h2>
					<p className="mt-1 text-sm text-neutral-500">Käytä postiasi työpöytä- tai mobiilisovelluksella JMAP-yhteydellä.</p>
				</div>
				<div className="space-y-4 rounded-3xl bg-white p-6">
					<EmailClientsSettings />
				</div>
			</section>
		</div>
	);
}
