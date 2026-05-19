/**
 * Monster classification (field mob, mini-boss, MVP, etc.).
 * @enum {string}
 */
export const MONSTER_KIND = {
	/** Standard field enemy. */
	NORMAL: 'normal',
	/** Mini boss. */
	MINI: 'mini',
	/** MVP / raid boss. */
	MVP: 'mvp'
};

/** @typedef {typeof MONSTER_KIND[keyof typeof MONSTER_KIND]} MonsterKind */
