
import { DEFAULT_ENTITY, ENTITY_ID_PREFIX, CATEGORY_ID_PREFIX } from '~/utils/config'
import Access from '~/utils/access'

export default db => {
	const access = new Access(db, ENTITY_ID_PREFIX, DEFAULT_ENTITY)

	access.allByCategory = async function(categoryId) {
		const all = await this.all()

		if(!categoryId.startsWith(CATEGORY_ID_PREFIX))
			categoryId = CATEGORY_ID_PREFIX + categoryId

		return all.filter(entity => entity.category === categoryId)
	}

	return access
}
