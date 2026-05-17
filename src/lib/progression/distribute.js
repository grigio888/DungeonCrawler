/**
 * Splits `totalPoints` across `weights` deterministically (largest remainder).
 * @param {number} totalPoints
 * @param {Record<string, number>} weights
 * @returns {Record<string, number>}
 */
export function distributeStatPoints(totalPoints, weights) {
	const entries = Object.entries(weights).filter(([, weight]) => weight > 0);

	if (entries.length === 0 || totalPoints <= 0) {
		return {};
	}

	const weightSum = entries.reduce((sum, [, weight]) => sum + weight, 0);
	const exact = entries.map(([key, weight]) => ({
		key,
		quotient: (totalPoints * weight) / weightSum
	}));

	/** @type {Record<string, number>} */
	const result = Object.fromEntries(exact.map(({ key, quotient }) => [key, Math.floor(quotient)]));

	let leftover =
		totalPoints - Object.values(result).reduce((sum, value) => sum + value, 0);

	const byRemainder = [...exact].sort((a, b) => {
		const fractionDiff = (b.quotient % 1) - (a.quotient % 1);
		if (fractionDiff !== 0) return fractionDiff;
		return a.key.localeCompare(b.key);
	});

	for (let index = 0; leftover > 0; index++, leftover--) {
		const key = byRemainder[index % byRemainder.length].key;
		result[key] += 1;
	}

	return result;
}
