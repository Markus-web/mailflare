import type { SettingsNavSection } from "./settings-nav-types";

export const settingsNavSections: SettingsNavSection[] = [
	{
		label: "Asetukset",
		items: [
			{
				href: "/settings/account",
				label: "Tili",
			},
			{
				href: "/settings/inbox",
				label: "Saapuneet",
			},
			{
				href: "/settings/rules",
				label: "Säännöt ja reititys",
			},
		],
	},
	{
		label: "Postilaatikko",
		items: [
			{
				href: "/settings/import",
				label: "Tuonti",
			},
			{
				href: "/settings/export",
				label: "Vienti",
			},
		],
	},
];

export function isActiveSettingsPath(pathname: string, href: string): boolean {
	return pathname === href || pathname.startsWith(`${href}/`);
}
