
import { sortByProperty } from 'vue-daisy-ui/utils/list'
import { isNull, notEmptyString } from 'vue-daisy-ui/utils/assert'
import {
	DEFAULT_CATEGORY,
	CATEGORY_ID_PREFIX,
	CATEGORIES_UPDATED,
	PROJECT_ID_PREFIX,
} from '~/utils/config'
import Access from '~/utils/access'

let _access

// return the created instance
export const category = () => _access

// create a database Access instance for categories and add specific methods
export default db => {
	_access = new Access(db, CATEGORY_ID_PREFIX, DEFAULT_CATEGORY, CATEGORIES_UPDATED)

	function descendants(all, current) {
		const categories = all.filter(item => item.parent === current._id)
		let output = [...categories]

		categories.forEach(category => {
			output = [...output, ...descendants(all, category)]
		})

		return output
	}

	// retrieve all descendant categories of the given category
	_access.descendants = async function(category) {
		const all = await this.allByProject(category.project)

		return descendants(all, category).sort(sortByProperty('title'))
	}

	// recursively retrieve the category with the supplied ID
	// and all of its parent categories
	_access.ancestors = async function(id) {
		const root = await this.byId(id)

		if(isNull(root)) return []

		return notEmptyString(root.parent)
			? [ ...(await this.ancestors(root.parent)), root]
			: [root]
	}

	// override slugify
	_access.slugify = function(item) {
		return `/projects/${ item.project.replace(PROJECT_ID_PREFIX, '') }/categories/${ item._id.replace(this.prefix, '') }`
	}

	return _access
}
