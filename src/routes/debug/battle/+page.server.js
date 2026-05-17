import { getCharacterById, listCharacters } from '$db/repositories/characterRepository.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const characters = await listCharacters();
	const first = characters[0] ?? null;
	const playerSpec = first ? await getCharacterById(first.id) : null;

	return { characters, playerSpec };
}
