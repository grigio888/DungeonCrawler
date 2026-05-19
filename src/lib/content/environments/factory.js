import ENVIRONMENTS from './registry.js';

/** @typedef {keyof typeof ENVIRONMENTS} EnvironmentId */

/** @typedef {(typeof ENVIRONMENTS)[EnvironmentId]} EnvironmentDefinition */

export default class Environment {
	/** @param {EnvironmentId | EnvironmentDefinition} idOrDefinition */
	constructor(idOrDefinition) {
		if (typeof idOrDefinition === 'string') {
			if (!(idOrDefinition in ENVIRONMENTS)) {
				throw new Error(`Invalid environment ID: ${idOrDefinition}`);
			}
			this._definition = ENVIRONMENTS[/** @type {EnvironmentId} */ (idOrDefinition)];
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

	get promptPath() {
		return this._definition.promptPath ?? this._definition.id;
	}
}

/**
 * @param {string} environmentId
 */
export function getEnvironmentDefinition(environmentId) {
	return ENVIRONMENTS[/** @type {EnvironmentId} */ (environmentId)] ?? ENVIRONMENTS.forest_clearing;
}
