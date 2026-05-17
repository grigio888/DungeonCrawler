import fs from 'node:fs';
import path from 'node:path';
import { Sequelize } from 'sequelize';

import { getDatabaseConfig } from './config.js';
import { registerModels } from './models/index.js';

/** @type {Sequelize | null} */
let sequelizeInstance = null;

/** @type {ReturnType<typeof registerModels> | null} */
let modelsInstance = null;

/**
 * @returns {Sequelize}
 */
export function getSequelize() {
	if (!sequelizeInstance) {
		throw new Error('Database not connected. Call connectDatabase() first.');
	}

	return sequelizeInstance;
}

/**
 * @returns {ReturnType<typeof registerModels>}
 */
export function getModels() {
	if (!modelsInstance) {
		throw new Error('Database not connected. Call connectDatabase() first.');
	}

	return modelsInstance;
}

/**
 * Opens the database connection and registers models.
 * @param {{ sync?: boolean }} [options]
 */
export async function connectDatabase(options = {}) {
	if (sequelizeInstance) {
		return { sequelize: sequelizeInstance, models: modelsInstance };
	}

	const config = getDatabaseConfig();

	if (config.dialect === 'sqlite' && config.storage) {
		fs.mkdirSync(path.dirname(config.storage), { recursive: true });
	}

	sequelizeInstance = new Sequelize(config);
	modelsInstance = registerModels(sequelizeInstance);

	await sequelizeInstance.authenticate();

	if (options.sync) {
		await sequelizeInstance.sync();
	}

	return { sequelize: sequelizeInstance, models: modelsInstance };
}

/** Creates tables for all registered models. */
export async function syncDatabase() {
	const sequelize = getSequelize();
	await sequelize.sync();
}

/** Closes the database connection. */
export async function disconnectDatabase() {
	if (!sequelizeInstance) return;

	await sequelizeInstance.close();
	sequelizeInstance = null;
	modelsInstance = null;
}
