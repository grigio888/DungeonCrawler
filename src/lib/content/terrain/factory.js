import TERRAIN from './registry.js';

/** @typedef {keyof typeof TERRAIN} TerrainId */

/** @typedef {(typeof TERRAIN)[TerrainId]} TerrainDefinition */

export default class Terrain {
	/** @param {TerrainId | TerrainDefinition} idOrDefinition */
	constructor(idOrDefinition) {
		if (typeof idOrDefinition === 'string') {
			if (!(idOrDefinition in TERRAIN)) {
				throw new Error(`Invalid terrain ID: ${idOrDefinition}`);
			}
			this._definition = TERRAIN[/** @type {TerrainId} */ (idOrDefinition)];
		} else {
			this._definition = idOrDefinition;
		}
	}

	get definition() {
		return this._definition;
	}

	get id() {
		return this._definition.id;
	}

	get name() {
		return this._definition.name;
	}

	get description() {
		return this._definition.description;
	}

	get role() {
		return this._definition.role;
	}

	get color() {
		return this._definition.color;
	}
}

/**
 * @param {string} terrainId
 */
export function getTerrainDefinition(terrainId) {
	if (terrainId in TERRAIN) {
		return TERRAIN[/** @type {TerrainId} */ (terrainId)];
	}

	throw new Error(`Invalid terrain ID: ${terrainId}`);
}

/**
 * @param {import('$lib/core/enum/terrain.js').TerrainRole} role
 */
export function getTerrainIdsByRole(role) {
	return Object.values(TERRAIN)
		.filter((definition) => definition.role === role)
		.map((definition) => definition.id);
}

/**
 * @param {import('$lib/core/enum/terrain.js').TerrainRole} role
 */
export function getDefaultTerrainIdForRole(role) {
	const ids = getTerrainIdsByRole(role);
	if (ids.length === 0) {
		throw new Error(`No terrain registered for role: ${role}`);
	}

	return ids[0];
}
