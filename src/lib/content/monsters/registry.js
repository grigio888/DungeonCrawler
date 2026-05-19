/** Monsters registry */

import caterDefinition from './0002_cater/definition';
import jellyDefinition from './0001_jelly/definition';

const MONSTERS = /** @type {const} */ ({
	[jellyDefinition.id]: jellyDefinition,
	[caterDefinition.id]: caterDefinition
});

export default MONSTERS;
