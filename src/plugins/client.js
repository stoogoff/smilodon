
import PouchDB from 'pouchdb'
import element from '~/state/element'
import category from '~/state/category'
import project from '~/state/project'

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

	database.bulkDocs(projectData)
	database.bulkDocs(categoryData)
	database.bulkDocs(elementData)
}
