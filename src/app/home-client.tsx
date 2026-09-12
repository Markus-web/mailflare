"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { authFetch, getClientSessionToken } from "@/lib/auth/client";
import { ArrowRight, Inbox, Mail, Search } from "lucide-react";
import { useBranding } from "@/components/branding-provider";
import { heroMessages, sidebarItems } from "./utils";

type Props = {
	publicRegister: boolean;
};

export function HomeClient({ publicRegister }: Props) {
	const branding = useBranding();
	const [hasUser, setHasUser] = useState(false);

	useEffect(() => {
		let cancelled = false;
		if (!getClientSessionToken()) return;
		authFetch("/api/auth/me", { redirectOnUnauthorized: false })
			.then((response) => {
				if (!cancelled) setHasUser(response.ok);
			})
			.catch(() => {
				if (!cancelled) setHasUser(false);
			});
		return () => {
			cancelled = true;
		};
	}, []);

	const appName = branding.appName === "Mailflare" ? "Kotisivu Webmail" : branding.appName;

	return (
		<div className="min-h-dvh bg-[#f3efe6] text-[#1a1a1a]">
			<header className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Link href="/" className="flex items-center gap-3" aria-label="Kotisivu Webmail">
					<img src={branding.iconUrl} height={32} width={32} alt="" />
					<span className="text-base font-semibold tracking-tight">{appName}</span>
				</Link>

				<div className="flex items-center gap-2">
					{hasUser ? (
						<Button
							asChild
							className="rounded-xl bg-[#e4ae20] text-[#301018] hover:bg-[#3e5641] hover:text-[#f0f0f0]"
						>
							<Link href="/inbox">Avaa postilaatikko</Link>
						</Button>
					) : (
						<>
							<Button
								variant="outline"
								asChild
								className="rounded-xl border-[#756b5c]/40 bg-white hover:bg-[#ebe4d6]"
							>
								<Link href="/login">Kirjaudu</Link>
							</Button>
							{publicRegister && (
								<Button
									asChild
									className="rounded-xl bg-[#e4ae20] text-[#301018] hover:bg-[#3e5641] hover:text-[#f0f0f0]"
								>
									<Link href="/register">Luo tili</Link>
								</Button>
							)}
						</>
					)}
				</div>
			</header>

			<main>
				<section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pb-16 pt-10 sm:px-6 md:pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
					<div className="flex max-w-xl flex-col justify-center">
						<h1 className="text-5xl font-semibold leading-[0.96] tracking-tight text-[#1a1a1a] sm:text-6xl">
							Kotisivu.org webmail
						</h1>
						<p className="mt-5 max-w-md text-lg leading-8 text-[#3e5641]">
							Lue ja lähetä sähköpostia selaimessa.
						</p>
						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							{hasUser ? (
								<Button
									size="lg"
									asChild
									className="rounded-xl bg-[#e4ae20] px-6 text-[#301018] hover:bg-[#3e5641] hover:text-[#f0f0f0]"
								>
									<Link href="/inbox">
										Avaa postilaatikko
										<ArrowRight className="h-4 w-4" />
									</Link>
								</Button>
							) : (
								<>
									<Button
										size="lg"
										asChild
										className="rounded-xl bg-[#e4ae20] px-6 text-[#301018] hover:bg-[#3e5641] hover:text-[#f0f0f0]"
									>
										<Link href="/login">
											Kirjaudu
											<ArrowRight className="h-4 w-4" />
										</Link>
									</Button>
									{publicRegister ? (
										<Button
											size="lg"
											variant="outline"
											asChild
											className="rounded-xl border-[#756b5c]/40 bg-white px-6 hover:bg-[#ebe4d6]"
										>
											<Link href="/register">Luo tili</Link>
										</Button>
									) : null}
								</>
							)}
						</div>
					</div>

					<div className="relative min-h-[420px] overflow-hidden rounded-[2px] border-2 border-[#8a6a0c] bg-[#fff8ee] shadow-[0_6px_0_rgba(10,32,40,0.12)]">
						<div className="grid h-full min-h-[420px] grid-cols-[160px_1fr] bg-[#fff8ee]">
							<aside className="hidden flex-col gap-2 bg-[#ebe4d6] px-3 py-5 sm:flex">
								<div className="mb-3 flex items-center gap-3 px-3 text-[#1a1a1a]">
									<Inbox className="h-5 w-5" />
									<span className="font-semibold">Posti</span>
								</div>
								<div className="mb-2 flex h-11 w-fit items-center gap-2 rounded-[2px] bg-[#e4ae20] px-4 text-sm font-semibold text-[#301018]">
									<Mail className="h-4 w-4" />
									Kirjoita
								</div>
								{sidebarItems.map((item) => {
									const Icon = item.icon;
									return (
										<div
											key={item.label}
											className={`flex h-9 items-center gap-3 rounded-r-full px-3 text-sm font-medium ${
												item.active ? "bg-[#004d61] text-[#f0f0f0]" : "text-[#3e5641]"
											}`}
										>
											<Icon className="h-4 w-4" />
											{item.label}
										</div>
									);
								})}
							</aside>
							<div className="flex min-w-0 flex-col">
								<div className="flex h-14 items-center gap-3 bg-[#ebe4d6] px-4">
									<div className="flex h-10 flex-1 items-center gap-3 rounded-[2px] bg-white px-4 text-[#3e5641]">
										<Search className="h-4 w-4" />
										<span className="text-sm">Hae</span>
									</div>
								</div>
								<div className="divide-y divide-[#756b5c]/20">
									{heroMessages.map((message) => (
										<div
											key={message.subject}
											className="grid min-h-12 grid-cols-[24px_1fr] items-center gap-3 px-4 text-sm"
										>
											<message.icon className="h-4 w-4 text-[#756b5c]" />
											<span className="truncate text-[#1a1a1a]">
												<span className="font-semibold">{message.subject}</span>
												<span className="text-[#3e5641]"> — {message.preview}</span>
											</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
