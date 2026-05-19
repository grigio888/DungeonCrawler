export { default as BaseCharacter } from './controller.js';
export { GENDER } from '$lib/core/enum/characters.js';

/** @typedef {import('$lib/core/enum/characters.js').Gender} Gender */
export { GENDER_VALUES } from '$lib/core/helpers/characters.js';
export {
	buildCharacterStats,
	createBaseCharacter,
	createCharacterSpec,
	createEmptyEquipment,
	isValidGender,
	resolveGender
} from './factory.js';
