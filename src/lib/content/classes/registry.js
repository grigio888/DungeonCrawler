/** Classes registry */

import mageDefinition from './class 1/mage/definition';
import swordsmanDefinition from './class 1/swordsman/definition';
import peasantDefinition from './class 0/peasanant/definition';

const CLASSES = /** @type {const} */ ({
	[peasantDefinition.id]: peasantDefinition,
	[swordsmanDefinition.id]: swordsmanDefinition,
	[mageDefinition.id]: mageDefinition
});

export default CLASSES;
