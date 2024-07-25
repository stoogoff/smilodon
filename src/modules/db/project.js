
import { sortByProperty } from 'vue-daisy-ui/utils/list'
import { DEFAULT_PROJECT, PROJECT_ID_PREFIX, PROJECTS_UPDATED } from '~/utils/config'
import Access from './access'

let _access

// return the created instance
export const project = () => _access

// create a database Access instance for projects and add specific methods
export default db => {
	_access = new Access(db, PROJECT_ID_PREFIX, DEFAULT_PROJECT, PROJECTS_UPDATED)

	// override slugify
	_access.slugify = function(item) {
		return `/projects/${ item._id.replace(this.prefix, '') }`
	}

	return _access
}
