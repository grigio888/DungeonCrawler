/** @typedef {[string, number]} ClassHistoryEntry */
/** @typedef {ClassHistoryEntry[]} ClassHistory */

/**
 * @param {unknown} raw
 * @returns {ClassHistory}
 */
export function normalizeClassHistory(raw) {
	if (!Array.isArray(raw) || raw.length === 0) {
		return [];
	}

	/** @type {ClassHistory} */
	const history = [];

	for (const entry of raw) {
		if (!Array.isArray(entry) || entry.length < 2) continue;

		const classId = String(entry[0]).trim();
		const level = Number(entry[1]);

		if (!classId || !Number.isFinite(level) || level < 1) continue;

		history.push([classId, Math.floor(level)]);
	}

	return history;
}

/**
 * Last entry is the active class.
 * @param {ClassHistory} classHistory
 * @returns {string}
 */
export function getCurrentClassId(classHistory) {
	if (classHistory.length === 0) return 'peasant';
	return classHistory[classHistory.length - 1][0];
}

/**
 * True when the character's level matches the level recorded at the last job change.
 * @param {ClassHistory} classHistory
 * @param {number} characterLevel
 */
export function isOnCurrentClass(classHistory, characterLevel) {
	if (classHistory.length === 0) return false;
	const lastLevel = classHistory[classHistory.length - 1][1];
	return characterLevel === lastLevel;
}

/**
 * @param {string} classId
 * @param {number} level
 * @returns {ClassHistory}
 */
export function createInitialClassHistory(classId, level) {
	return [[classId, level]];
}
