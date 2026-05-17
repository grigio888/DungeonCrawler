/**
 * Creates or updates database tables from Sequelize models.
 * Usage: npm run db:sync
 *
 * After changing the characters schema, delete data/game.sqlite and sync again.
 */
import { connectDatabase, disconnectDatabase } from '../src/db/index.js';

await connectDatabase({ sync: true });
console.log('Database synced.');
await disconnectDatabase();
