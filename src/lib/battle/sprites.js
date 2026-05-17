/**
 * @param {Record<string, unknown>} globEntries
 * @param {string} promptPath e.g. `class 0/peasanant`
 * @param {string} spriteKey e.g. `female_idle_sw`
 */
function matchesClassSpritePath(path, promptPath, spriteKey) {
	return path.includes(`/classes/${promptPath}/sprites/`) && path.includes(`/${spriteKey}.`);
}

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
		if (path.includes(`/classes/${promptPath}/sprites/`) && path.includes(`/${gender}_idle_`)) {
			return /** @type {string} */ (url);
		}
	}

	return null;
}

export { resolveMonsterSpriteUrl } from '$lib/sprites/monsterSprite.js';
