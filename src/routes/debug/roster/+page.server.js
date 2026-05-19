import { fail, redirect } from '@sveltejs/kit';

import {
	createCharacter,
	deleteCharacter,
	getCharacterById,
	listCharacters
} from '$db/repositories/characterRepository.js';
import CLASSES from '$lib/content/classes';
import { isValidGender } from '$lib/game/entities/character';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const characters = await listCharacters();
	const selectedId = url.searchParams.get('id');
	const selected = selectedId ? await getCharacterById(selectedId) : null;

	return { characters, selected, selectedId };
}

/** @type {import('./$types').Actions} */
export const actions = {
	create: async ({ request, url }) => {
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim() || 'Adventurer';
		const classId = String(formData.get('classId') ?? 'peasant');
		const level = Number(formData.get('level') ?? 1);
		const gender = String(formData.get('gender') ?? 'female');

		if (!CLASSES[classId]) {
			return fail(400, { message: 'Invalid class.' });
		}

		if (!Number.isFinite(level) || level < 1 || level > 99) {
			return fail(400, { message: 'Level must be between 1 and 99.' });
		}

		if (!isValidGender(gender)) {
			return fail(400, { message: 'Invalid gender.' });
		}

		const spec = await createCharacter({ name, classId, level, gender });
		throw redirect(303, `${url.pathname}?id=${spec.id}`);
	},

	delete: async ({ request, url }) => {
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '').trim();

		if (!id) {
			return fail(400, { message: 'Missing character id.' });
		}

		const removed = await deleteCharacter(id);
		if (!removed) {
			return fail(404, { message: 'Character not found.' });
		}

		throw redirect(303, url.pathname);
	}
};
