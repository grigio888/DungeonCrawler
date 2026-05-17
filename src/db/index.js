/** Database layer (server-side only). */

export {
	createInitialClassHistory,
	getCurrentClassId,
	isOnCurrentClass,
	normalizeClassHistory
} from './classHistory.js';
export { getDatabaseConfig } from './config.js';
export {
	connectDatabase,
	disconnectDatabase,
	getModels,
	getSequelize,
	syncDatabase
} from './connector.js';
