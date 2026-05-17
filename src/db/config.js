import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

/**
 * @returns {import('sequelize').Options}
 */
export function getDatabaseConfig() {
	const databaseUrl = process.env.DATABASE_URL ?? 'sqlite:./data/game.sqlite';
	const logging = process.env.DATABASE_LOGGING === 'true';

	if (databaseUrl.startsWith('sqlite:')) {
		const storagePath = databaseUrl.replace(/^sqlite:/, '');
		const storage = path.isAbsolute(storagePath)
			? storagePath
			: path.resolve(projectRoot, storagePath);

		return {
			dialect: 'sqlite',
			storage,
			logging
		};
	}

	throw new Error(`Unsupported DATABASE_URL: ${databaseUrl}`);
}
