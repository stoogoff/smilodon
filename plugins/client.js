
import PouchDB from 'pouchdb'
import entity from '~/state/entity'
import category from '~/state/category'
import project from '~/state/project'

export default ({ env }, inject) => {
	const database = new PouchDB(env.database)

	inject('entities', entity(database))
	inject('categories', category(database))
	inject('projects', project(database))
}
