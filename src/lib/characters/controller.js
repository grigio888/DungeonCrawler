import { resolvePromptPath } from '$lib/classes';
import { createCharacterSpec, createEmptyEquipment } from './factory.js';

/**
 * Owns a single character's runtime spec: identity, progression, vitals, stats.
 */
export default class BaseCharacter {
	/** @param {import('./factory.js').CharacterSpec | Record<string, unknown>} [input] */
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

	get scales() {
		return this._spec.scales;
	}

	/** Allocated combat stats (same keys as `scales`). */
	get stats() {
		return this._spec.scales;
	}

	get skills() {
		return this._spec.skills;
	}

	get isAlive() {
		return this._spec.hp > 0;
	}

	/** Relative path under `classes/`. */
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
	 * @param {Partial<import('./factory.js').CharacterSpec>} patch
	 */
	patch(patch) {
		const prev = this._spec;
		this._spec = createCharacterSpec({
			...prev,
			...patch,
			scales: patch.scales ?? prev.scales,
			previousLevel: prev.level
		});
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
	 * @param {import('./factory.js').CharacterSpec | Record<string, unknown>} data
	 */
	static fromJSON(data) {
		return new BaseCharacter(data);
	}

	static createEmptyEquipment() {
		return createEmptyEquipment();
	}
}
