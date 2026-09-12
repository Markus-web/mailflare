import { cfRequest } from "@/lib/cloudflare-api";
import type { CfEmailRoutingRule } from "@/lib/cloudflare-api.types";
import { getEmailWorkerName } from "@/lib/cloudflare-api-utils";

export async function getEmailRoutingCatchAll(
	env: CloudflareEnv,
	zoneId: string,
): Promise<CfEmailRoutingRule | null> {
	try {
		return await cfRequest<CfEmailRoutingRule>(
			env,
			`/zones/${zoneId}/email/routing/rules/catch_all`,
		);
	} catch {
		// A zone without Email Routing has no catch-all to read; treat it as absent.
		return null;
	}
}

export async function ensureEmailRoutingCatchAllToWorker(
	env: CloudflareEnv,
	zoneId: string,
): Promise<CfEmailRoutingRule> {
	const workerName = getEmailWorkerName();
	try {
		return await cfRequest<CfEmailRoutingRule>(
			env,
			`/zones/${zoneId}/email/routing/rules/catch_all`,
			{
				method: "PUT",
				body: JSON.stringify({
					actions: [{ type: "worker", value: [workerName] }],
					enabled: true,
					matchers: [{ type: "all" }],
					name: `Route all email to ${workerName}`,
				}),
			},
		);
	} catch (error) {
		// Token may lack Email Routing Rules Edit (common with DNS-only tokens).
		// Operator can set catch-all via Wrangler OAuth / dash; do not abort mailbox create.
		const existing = await getEmailRoutingCatchAll(env, zoneId);
		if (existing) {
			console.warn(
				"ensureEmailRoutingCatchAllToWorker: CF_TOKEN cannot update catch-all; keeping existing rule",
				error,
			);
			return existing;
		}
		console.warn(
			"ensureEmailRoutingCatchAllToWorker: CF_TOKEN cannot update catch-all; assuming operator-managed routing",
			error,
		);
		return {
			id: "operator-managed",
			name: `Route all email to ${workerName}`,
			enabled: true,
			matchers: [{ type: "all" }],
			actions: [{ type: "worker", value: [workerName] }],
		} as CfEmailRoutingRule;
	}
}

/**
 * Put back a catch-all captured before `ensureEmailRoutingCatchAllToWorker`
 * overwrote it. The catch-all is a singleton per zone, so it cannot be deleted —
 * restoring means writing the previous rule back, or falling back to
 * Cloudflare's own default (a disabled drop) when the zone never had one.
 */
export async function restoreEmailRoutingCatchAll(
	env: CloudflareEnv,
	zoneId: string,
	previous: CfEmailRoutingRule | null,
): Promise<void> {
	const actions = previous?.actions?.length ? previous.actions : [{ type: "drop" as const }];
	const matchers = previous?.matchers?.length ? previous.matchers : [{ type: "all" as const }];
	await cfRequest<CfEmailRoutingRule>(
		env,
		`/zones/${zoneId}/email/routing/rules/catch_all`,
		{
			method: "PUT",
			body: JSON.stringify({
				actions,
				enabled: previous?.enabled ?? false,
				matchers,
				...(previous?.name ? { name: previous.name } : {}),
			}),
		},
	);
}
