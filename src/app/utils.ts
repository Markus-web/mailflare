import { FileText, Inbox, MailCheck, Send, ShieldAlert, Trash2 } from "lucide-react";
import type { HomeAction, LandingNavItem, LandingStat, MailPreview, SidebarItem } from "./types";

export const landingNavItems: LandingNavItem[] = [
	{ href: "https://kotisivu.org/", label: "Kotisivu.org" },
];

export const sidebarItems: SidebarItem[] = [
	{ label: "Saapuneet", icon: Inbox, active: true },
	{ label: "Lähetetyt", icon: Send },
	{ label: "Luonnokset", icon: FileText },
	{ label: "Roskaposti", icon: ShieldAlert },
	{ label: "Roskakori", icon: Trash2 },
];

export const heroMessages: MailPreview[] = [
	{
		icon: MailCheck,
		sender: "tuki",
		subject: "Tervetuloa",
		preview: "Postilaatikkosi on valmis.",
		badge: "",
	},
	{
		icon: MailCheck,
		sender: "ilmoitus",
		subject: "Uusi viesti",
		preview: "Avaa saapuneet lukeaksesi.",
		badge: "",
	},
];

export const inboxStats: LandingStat[] = [];
export const deliverySignals: string[] = [];

export function getHomeActions(isLoggedIn: boolean, publicRegister = false): HomeAction[] {
	if (isLoggedIn) {
		return [{ href: "/inbox", label: "Avaa postilaatikko", variant: "default" }];
	}
	const actions: HomeAction[] = [{ href: "/login", label: "Kirjaudu", variant: "outline" }];
	if (publicRegister) {
		actions.push({ href: "/register", label: "Luo tili", variant: "default" });
	}
	return actions;
}
