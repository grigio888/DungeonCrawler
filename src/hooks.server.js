import { connectDatabase } from '$db/index.js';

let databaseReady = false;

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	if (!databaseReady) {
		await connectDatabase();
		databaseReady = true;
	}

	return resolve(event);
}
