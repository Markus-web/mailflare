/**
 * Optional public signup after the first admin exists.
 * Set Worker var ALLOW_PUBLIC_REGISTER=true|1 to open /register for the primary domain.
 */

const TRUTHY = new Set(["1", "true", "yes", "on"]);

const RESERVED_LOCAL_PARTS = new Set([
	"abuse",
	"admin",
	"administrator",
	"hello",
	"hostmaster",
	"mailer-daemon",
	"noreply",
	"no-reply",
	"postmaster",
	"postitus",
	"root",
	"security",
	"webmaster",
	"www",
]);

export function isPublicRegisterEnabled(env: Pick<CloudflareEnv, "ALLOW_PUBLIC_REGISTER">): boolean {
	const raw = env.ALLOW_PUBLIC_REGISTER?.trim().toLowerCase();
	return !!raw && TRUTHY.has(raw);
}

export function isReservedLocalPart(username: string): boolean {
	return RESERVED_LOCAL_PARTS.has(username.toLowerCase().trim());
}
