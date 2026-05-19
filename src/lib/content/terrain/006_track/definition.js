/** Track tiles — paths from the map edge to the battle grid. */

import { TERRAIN_ROLE } from '$lib/core/enum/terrain.js';

export default {
	id: 't_006',
	name: 'Track',
	description: 'A worn path leading toward the arena.',
	role: TERRAIN_ROLE.TRACK,
	color: '#6b5344'
};
