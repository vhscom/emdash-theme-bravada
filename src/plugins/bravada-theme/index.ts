/**
 * Bravada theme settings plugin (inline, template-local).
 *
 * Exposes the theme's display toggles as real plugin settings so editors
 * get an auto-generated form in the admin (Plugins → Bravada Theme)
 * instead of hand-editing seed files. Templates read the values with
 * getPluginSetting("bravada-theme", key) ?? true — schema defaults are
 * UI defaults only and are not materialized into storage.
 */

import { definePlugin } from "emdash";
import type { PluginDefinition } from "emdash";

const definition: PluginDefinition = {
	id: "bravada-theme",
	version: "0.1.0",

	admin: {
		settingsSchema: {
			showPostAuthor: {
				type: "boolean",
				label: "Show post author",
				description:
					"Attribute posts to their byline: the avatar chip in the post hero, the byline in the article meta line, and the author card below the article. Turn off on single-author sites where attribution is noise.",
				default: true,
			},
			showPostNav: {
				type: "boolean",
				label: "Show prev/next buttons",
				description:
					"The docked previous/next post buttons that fade in beside the article on scroll. The full-bleed previous/next image band above the footer is unaffected.",
				default: true,
			},
		},
	},
};

export function createPlugin() {
	return definePlugin(definition);
}

export default createPlugin;
