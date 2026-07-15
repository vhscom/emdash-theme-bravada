/**
 * Bravada theme settings plugin (inline, template-local).
 *
 * Gives editors real toggles for the theme's display options at
 * admin → Bravada Theme. The form is a Block Kit page served from the
 * plugin's admin route; saves go to the plugin KV store under
 * `settings:` keys, which land in the options table as
 * `plugin:bravada-theme:settings:<key>` — exactly what the templates
 * read via getPluginSetting("bravada-theme", key). Missing values mean
 * "on" (defaults are not materialized).
 */

import { definePlugin } from "emdash";
import type { PluginDefinition, RouteContext } from "emdash";

const TOGGLES = [
	{
		key: "showPostAuthor",
		label: "Show post author",
		hint: "Byline attribution on posts: the avatar chip in the hero, the byline in the article meta line, and the author card below the article. Turn off on single-author sites.",
	},
	{
		key: "showPostNav",
		label: "Show prev/next buttons",
		hint: "The docked previous/next buttons that fade in beside the article on scroll. The full-bleed previous/next image band above the footer is unaffected.",
	},
] as const;

type Interaction = {
	type: string;
	action_id?: string;
	values?: Record<string, unknown>;
};

async function settingsBlocks(ctx: RouteContext<unknown>) {
	const fields = [];
	for (const t of TOGGLES) {
		const stored = await ctx.kv.get<boolean>(`settings:${t.key}`);
		fields.push({
			type: "toggle",
			action_id: t.key,
			label: t.label,
			hint: t.hint,
			initial_value: stored !== false,
		});
	}
	return [
		{ type: "header", text: "Bravada Theme" },
		{
			type: "text",
			text: "Display toggles for the theme's post pages. Changes apply on the next page view.",
		},
		{
			type: "form",
			block_id: "theme-settings",
			fields,
			submit: { label: "Save", action_id: "save" },
		},
	];
}

const definition: PluginDefinition = {
	id: "bravada-theme",
	version: "0.3.0",

	admin: {
		pages: [{ path: "/settings", label: "Bravada Theme", icon: "settings" }],
	},

	routes: {
		admin: {
			handler: async (ctx: RouteContext<unknown>) => {
				const interaction = ctx.input as Interaction;

				if (interaction?.type === "form_submit" && interaction.action_id === "save") {
					const values = interaction.values ?? {};
					for (const t of TOGGLES) {
						await ctx.kv.set(`settings:${t.key}`, values[t.key] !== false);
					}
					return {
						blocks: await settingsBlocks(ctx),
						toast: { message: "Theme settings saved", type: "success" },
					};
				}

				return { blocks: await settingsBlocks(ctx) };
			},
		},
	},
};

export function createPlugin() {
	return definePlugin(definition);
}

export default createPlugin;
