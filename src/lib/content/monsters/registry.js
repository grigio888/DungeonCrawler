/** Monsters registry */

import fabreDefinition from './0002_fabre/definition';
import jellyDefinition from './0001_jelly/definition';

const MONSTERS = /** @type {const} */ ({
	[jellyDefinition.id]: jellyDefinition,
	[fabreDefinition.id]: fabreDefinition
});

export default MONSTERS;
