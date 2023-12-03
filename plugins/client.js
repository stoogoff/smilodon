
import PouchDB from 'pouchdb'
import entity from '~/state/entity'
import category from '~/state/category'
import project from '~/state/project'

// seed data
import projectData from '~/static/seed/projects'
import categoryData from '~/static/seed/categories'
import entityData from '~/static/seed/entities'

export default ({ env }, inject) => {
	const database = new PouchDB(env.database)

	inject('entities', entity(database))
	inject('categories', category(database))
	inject('projects', project(database))

	database.bulkDocs(projectData)
	database.bulkDocs(categoryData)
	database.bulkDocs(entityData)
}
