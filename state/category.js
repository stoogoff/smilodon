
import { sortByProperty } from 'vue-daisy-ui/utils/list'
import {
	DEFAULT_CATEGORY,
	CATEGORY_ID_PREFIX,
	CATEGORIES_UPDATED,
	PROJECT_ID_PREFIX,
} from '~/utils/config'
import Access from '~/utils/access'

export default db => {
	const access = new Access(db, CATEGORY_ID_PREFIX, DEFAULT_CATEGORY, CATEGORIES_UPDATED)

	access.allWithParent = async function(project, parent) {
		const categories = await this.allByProject(project)

		return categories.filter(item => item.parent === parent)
	}

	access.slugify = function(item) {
		return `/projects/${ item.project.replace(PROJECT_ID_PREFIX, '') }/categories/${ item._id.replace(this.prefix, '') }`
	}

	return access
}
