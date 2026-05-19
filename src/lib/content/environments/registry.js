/** Environments registry */

import dungeonCorridorDefinition from './dungeon_corridor/definition';
import forestClearingDefinition from './forest_clearing/definition';
import townOutskirtsDefinition from './town_outskirts/definition';

const ENVIRONMENTS = /** @type {const} */ ({
	[forestClearingDefinition.id]: forestClearingDefinition,
	[townOutskirtsDefinition.id]: townOutskirtsDefinition,
	[dungeonCorridorDefinition.id]: dungeonCorridorDefinition
});

export default ENVIRONMENTS;
