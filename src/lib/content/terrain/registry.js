import commonGroundDefinition from './001_common_ground/definition.js';
import grassDefinition from './002_grass/definition.js';
import dirtDefinition from './003_dirt/definition.js';
import mossDefinition from './004_moss/definition.js';
import gravelDefinition from './005_gravel/definition.js';
import trackDefinition from './006_track/definition.js';

const TERRAIN = /** @type {const} */ ({
	[commonGroundDefinition.id]: commonGroundDefinition,
	[grassDefinition.id]: grassDefinition,
	[dirtDefinition.id]: dirtDefinition,
	[mossDefinition.id]: mossDefinition,
	[gravelDefinition.id]: gravelDefinition,
	[trackDefinition.id]: trackDefinition
});

export default TERRAIN;
