
import { sortByProperty } from 'we-ui/utils/list'
import { DEFAULT_PROJECT, PROJECT_ID_PREFIX, PROJECTS_UPDATED } from '~/utils/config'
import Access from '~/utils/access'

export default db => {
	const access = new Access(db, PROJECT_ID_PREFIX, DEFAULT_PROJECT, PROJECTS_UPDATED)

	access.slugify = function(item) {
		return `/projects/${ item._id.replace(this.prefix, '') }`
	}

	return access
}
