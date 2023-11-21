
import { sortByProperty } from 'we-ui/utils/list'
import { DEFAULT_CATEGORY, CATEGORY_ID_PREFIX } from '~/utils/config'
import Access from '~/utils/access'

export default db => {
	const access = new Access(db, CATEGORY_ID_PREFIX, DEFAULT_CATEGORY)

	access.allWithParent = async function(parent) {
		return this.allByProperty('parent', parent)
	}

	return access
}
