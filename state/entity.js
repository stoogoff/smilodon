
import {
	DEFAULT_ENTITY,
	ENTITY_ID_PREFIX,
	ENTITIES_UPDATED,
	CATEGORY_ID_PREFIX,
} from '~/utils/config'
import Access from '~/utils/access'

export default db => {
	const access = new Access(db, ENTITY_ID_PREFIX, DEFAULT_ENTITY, ENTITIES_UPDATED)

	access.allByCategory = async function(categoryId) {
		if(!categoryId.startsWith(CATEGORY_ID_PREFIX)) {
			categoryId = CATEGORY_ID_PREFIX + categoryId
		}

		return await this.allByProperty('category', categoryId)
	}

	return access
}
