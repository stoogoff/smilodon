
import PouchDB from 'pouchdb'
import entity from '~/state/entity'
import category from '~/state/category'

export default ({ env }, inject) => {
	const database = new PouchDB(env.database)

	inject('entities', entity(database))
	inject('categories', category(database))
}
