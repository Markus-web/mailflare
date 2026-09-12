import { FileText, Inbox, MailCheck, Send, ShieldAlert, Trash2 } from "lucide-react";
import type { HomeAction, LandingNavItem, LandingStat, MailPreview, SidebarItem } from "./types";

export const landingNavItems: LandingNavItem[] = [
	{ href: "https://kotisivu.org/hinnasto/", label: "Hinnasto" },
	{ href: "https://kotisivu.org/tuki/", label: "Tuki" },
];

export const sidebarItems: SidebarItem[] = [
	{ label: "Saapuneet", icon: Inbox, active: true, count: "3" },
	{ label: "Lähetetyt", icon: Send },
	{ label: "Luonnokset", icon: FileText, count: "1" },
	{ label: "Roskaposti", icon: ShieldAlert },
	{ label: "Roskakori", icon: Trash2 },
];

export const heroMessages: MailPreview[] = [
	{
		icon: MailCheck,
		sender: "tuki@kotisivu.org",
		subject: "Postilaatikko valmis",
		preview: "Webmail-lisäpalvelu on avattu tilillesi.",
		badge: "Saapunut",
	},
	{
		icon: MailCheck,
		sender: "noreply@postitus.kotisivu.org",
		subject: "Tilausvahvistus",
		preview: "WordPress-ilmoitukset kulkevat erillistä postituspolkua.",
		badge: "Järjestelmä",
	},
	{
		icon: MailCheck,
		sender: "hello@kotisivu.org",
		subject: "Tervetuloa",
		preview: "Kirjaudu webmailiin tunnuksillasi.",
		badge: "Tuki",
	},
];

export const inboxStats: LandingStat[] = [
	{ value: "Pro", label: "vaatii maksullisen paketin" },
	{ value: "15 €", label: "alk. / kk / laatikko" },
	{ value: "CF", label: "Email Routing + Workers" },
];

export const deliverySignals = [
	"Postilaatikot avaa ylläpito tukitiketin perusteella",
	"Ei julkista itsepalvelurekisteröintiä",
	"WordPress-ilmoitukset pysyvät postitus.kotisivu.org -polussa",
];

/** Public landing: login only. New mailboxes are provisioned by admins. */
export function getHomeActions(isLoggedIn: boolean): HomeAction[] {
	if (isLoggedIn) {
		return [{ href: "/inbox", label: "Avaa postilaatikko", variant: "default" }];
	}

	return [{ href: "/login", label: "Kirjaudu", variant: "default" }];
}
