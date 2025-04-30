
import PouchDB from 'pouchdb'
import { local } from 'vue-daisy-ui/utils/storage'
import element from '~/modules/db/element'
import category from '~/modules/db/category'
import project from '~/modules/db/project'
import { DEMO_SAVED } from '~/utils/config'

// seed data
import projectData from '~/static/seed/projects'
import categoryData from '~/static/seed/categories'
import elementData from '~/static/seed/elements'

export default ({ env }, inject) => {
	const database = new PouchDB(env.database)

	inject('db', database)
	inject('elements', element(database))
	inject('categories', category(database))
	inject('projects', project(database))

	if(!local.has(DEMO_SAVED)) {
		database.bulkDocs(projectData)
		database.bulkDocs(categoryData)
		database.bulkDocs(elementData)

		local.set(DEMO_SAVED, true)
	}
}
