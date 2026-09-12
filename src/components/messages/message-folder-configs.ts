import { Archive, Clock, MailOpen, Send, ShieldAlert, Star, Trash2 } from "lucide-react";
import type { MessageFolderConfig } from "./types";

export const inboxFolderConfig: MessageFolderConfig = {
	folder: "inbox",
	title: "Saapuneet",
	emptyText: "Ei viestejä",
	hrefPrefix: "/inbox",
	icon: Star,
	// headerIcons: [MailOpen, Clock],
	showRowBadge: false,
};

export const starredFolderConfig: MessageFolderConfig = {
	folder: "starred",
	title: "Tähdellä merkityt",
	emptyText: "Ei tähdellä merkittyjä viestejä",
	hrefPrefix: "/starred",
	icon: Star,
	badgeVariant: "outline",
};

export const snoozedFolderConfig: MessageFolderConfig = {
	folder: "snoozed",
	title: "Lykätty",
	emptyText: "Ei lykättyjä viestejä",
	hrefPrefix: "/snoozed",
	icon: Clock,
	badgeVariant: "outline",
};

export const sentFolderConfig: MessageFolderConfig = {
	folder: "sent",
	title: "Lähetetyt",
	emptyText: "Ei viestejä",
	hrefPrefix: "/sent",
	icon: Send,
	// headerIcons: [MailOpen, Clock],
	badgeVariant: "outline",
};

export const archivedFolderConfig: MessageFolderConfig = {
	folder: "archived",
	title: "Arkisto",
	emptyText: "Ei arkistoituja viestejä",
	hrefPrefix: "/archived",
	icon: Archive,
	badgeVariant: "outline",
};

export const spamFolderConfig: MessageFolderConfig = {
	folder: "spam",
	title: "Roskaposti",
	emptyText: "Ei roskapostia",
	hrefPrefix: "/spam",
	icon: ShieldAlert,
	badgeVariant: "outline",
};

export const trashFolderConfig: MessageFolderConfig = {
	folder: "trash",
	title: "Roskakori",
	emptyText: "Roskakorissa ei ole viestejä",
	hrefPrefix: "/trash",
	icon: Trash2,
	badgeVariant: "outline",
};
