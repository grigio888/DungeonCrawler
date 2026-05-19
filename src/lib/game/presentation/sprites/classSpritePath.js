/**
 * Normalize Vite glob keys / asset URLs for stable string matching.
 * @param {string} path
 */
export function normalizeSpritePath(path) {
	return decodeURIComponent(path).replace(/\\/g, '/');
}

/**
 * @param {string} path
 * @param {string} promptPath e.g. `class 1/mage`
 */
export function pathMatchesClassSpriteFolder(path, promptPath) {
	if (!promptPath) return false;
	const normalized = normalizeSpritePath(path);
	const folder = `${promptPath}/sprites/`;
	return normalized.includes(folder);
}

/**
 * @param {string} path
 * @param {string} spriteKey e.g. `female_idle_sw`
 */
export function pathMatchesSpriteKey(path, spriteKey) {
	if (!spriteKey) return false;
	const normalized = normalizeSpritePath(path);
	return normalized.includes(`/${spriteKey}.`);
}

/**
 * @param {string} path
 * @param {string} promptPath
 * @param {string} spriteKey
 */
export function matchesClassSpritePath(path, promptPath, spriteKey) {
	return pathMatchesClassSpriteFolder(path, promptPath) && pathMatchesSpriteKey(path, spriteKey);
}
