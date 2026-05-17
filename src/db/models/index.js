import { defineCharacterModel } from './character.js';

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
export function registerModels(sequelize) {
	const Character = defineCharacterModel(sequelize);

	return {
		Character
	};
}
