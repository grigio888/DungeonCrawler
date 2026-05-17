import { resolvePromptPath } from '$lib/classes/index.js';
import { createCharacterSpec, createEmptyEquipment } from './specs.js';

/**
 * Owns a single character's runtime spec: identity, progression, vitals, stats.
 */
class BaseCharacter {
	/** @param {import('./specs.js').CharacterSpec | Record<string, unknown>} [input] */
	constructor(input = {}) {
		this._spec = createCharacterSpec(input);
	}

	get spec() {
		return this._spec;
	}

	get id() {
		return this._spec.id;
	}

	get name() {
		return this._spec.name;
	}

	get classId() {
		return this._spec.classId;
	}

	get subclassId() {
		return this._spec.subclassId;
	}

	get level() {
		return this._spec.level;
	}

	get hp() {
		return this._spec.hp;
	}

	get maxHp() {
		return this._spec.maxHp;
	}

	get sp() {
		return this._spec.sp;
	}

	get maxSp() {
		return this._spec.maxSp;
	}

	get stats() {
		return this._spec.stats;
	}

	get isAlive() {
		return this._spec.hp > 0;
	}

	/** Relative path under `classes/assets/prompts/` */
	get promptPath() {
		return resolvePromptPath(this._spec.classId, this._spec.subclassId);
	}

	get displayLabel() {
		const job = this._spec.subclassId
			? `${this._spec.classId} / ${this._spec.subclassId}`
			: this._spec.classId;
		return `${this._spec.name} (${job})`;
	}

	/**
	 * @param {Partial<import('./specs.js').CharacterSpec>} patch
	 */
	patch(patch) {
		this._spec = createCharacterSpec({ ...this._spec, ...patch });
		return this;
	}

	/**
	 * @param {number} amount
	 */
	heal(amount) {
		this._spec.hp = Math.min(this._spec.maxHp, this._spec.hp + amount);
		return this._spec.hp;
	}

	/**
	 * @param {number} amount
	 */
	restoreSp(amount) {
		this._spec.sp = Math.min(this._spec.maxSp, this._spec.sp + amount);
		return this._spec.sp;
	}

	/**
	 * @param {number} amount
	 * @returns {number}
	 */
	takeDamage(amount) {
		const applied = Math.max(0, amount);
		this._spec.hp = Math.max(0, this._spec.hp - applied);
		return applied;
	}

	/**
	 * @param {number} amount
	 */
	spendSp(amount) {
		if (this._spec.sp < amount) return false;
		this._spec.sp -= amount;
		return true;
	}

	toJSON() {
		return structuredClone(this._spec);
	}

	/**
	 * @param {import('./specs.js').CharacterSpec | Record<string, unknown>} data
	 */
	static fromJSON(data) {
		return new BaseCharacter(data);
	}

	static createEmptyEquipment() {
		return createEmptyEquipment();
	}
}

export default BaseCharacter;
