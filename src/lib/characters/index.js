export { default as BaseCharacter } from './controller.js';
export { GENDER, GENDER_VALUES } from './enums.js';
export {
	buildCharacterStats,
	createBaseCharacter,
	createCharacterSpec,
	createEmptyEquipment,
	isValidGender,
	resolveGender
} from './factory.js';
