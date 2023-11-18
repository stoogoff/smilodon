
import { DEFAULT_CATEGORY, CATEGORY_ID_PREFIX } from '~/utils/config'
import Access from '~/utils/access'

export default db => {
	const access = new Access(db, CATEGORY_ID_PREFIX, DEFAULT_CATEGORY)

	access.allWithParent = async function(parent) {
		const all = await this.all()

		return all.filter(category => category.parent === parent)
	}

	return access
}
