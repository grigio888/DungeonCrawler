/** Default sprite file name (without extension) under `monsters/{id}/sprites/`. */
export const DEFAULT_MONSTER_SPRITE = 'idle';

const IMAGE_EXT_PATTERN = /\.(png|webp|gif)$/i;

/**
 * Expected folder for a monster sprite: `src/lib/content/monsters/{monsterId}/sprites/`.
 * @param {string} monsterId
 * @param {string} [fileName]
 */
export function getMonsterSpritePath(monsterId, fileName = `${DEFAULT_MONSTER_SPRITE}.png`) {
	return `src/lib/content/monsters/${monsterId}/sprites/${fileName}`;
}

/**
 * @param {Record<string, unknown>} globEntries
 * @param {string} monsterId
 * @returns {string[]}
 */
export function listMonsterSpriteFiles(globEntries, monsterId) {
	const prefix = `/content/monsters/${monsterId}/sprites/`;
	const files = [];

	for (const path of Object.keys(globEntries)) {
		if (!path.includes(prefix)) continue;
		const fileName = path.split('/').pop() ?? '';
		if (IMAGE_EXT_PATTERN.test(fileName)) {
			files.push(fileName);
		}
	}

	return files.sort();
}

/**
 * Resolves a monster sprite URL from Vite glob entries.
 * Prefers `{spriteName}.png` (default `idle`), then any other image in the folder.
 * @param {Record<string, unknown>} globEntries
 * @param {string} monsterId
 * @param {string} [spriteName]
 */
export function resolveMonsterSpriteUrl(globEntries, monsterId, spriteName = DEFAULT_MONSTER_SPRITE) {
	const prefix = `/content/monsters/${monsterId}/sprites/`;
	let fallback = null;

	for (const [path, url] of Object.entries(globEntries)) {
		if (!path.includes(prefix)) continue;

		const fileName = path.split('/').pop() ?? '';
		if (!IMAGE_EXT_PATTERN.test(fileName)) continue;

		if (fileName.startsWith(`${spriteName}.`)) {
			return /** @type {string} */ (url);
		}

		if (!fallback) {
			fallback = /** @type {string} */ (url);
		}
	}

	return fallback;
}
