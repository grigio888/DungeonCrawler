import { matchesClassSpritePath, pathMatchesClassSpriteFolder } from './classSpritePath.js';

/**
 * @param {Record<string, unknown>} globEntries
 * @param {string} promptPath
 * @param {string} spriteKey
 * @param {string} [gender] used for fallback lookup
 */
export function resolveClassSpriteUrl(globEntries, promptPath, spriteKey, gender) {
	for (const [path, url] of Object.entries(globEntries)) {
		if (matchesClassSpritePath(path, promptPath, spriteKey)) {
			return /** @type {string} */ (url);
		}
	}

	if (!gender) return null;

	for (const [path, url] of Object.entries(globEntries)) {
		if (pathMatchesClassSpriteFolder(path, promptPath) && path.includes(`/${gender}_idle_`)) {
			return /** @type {string} */ (url);
		}
	}

	return null;
}
