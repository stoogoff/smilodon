
import { createId } from 'we-ui/utils/string'
import { DEFAULT_ENTITY, ENTITY_ID_PREFIX } from '~/utils/config'
import Access from '~/utils/access'

export default db => {
	const access = new Access(db, ENTITY_ID_PREFIX)

	access.create = function(data) {
		const entity = {
			...DEFAULT_ENTITY,
			...data
		}

		return Access.prototype.create.call(this, entity)
	}

	return access
}
