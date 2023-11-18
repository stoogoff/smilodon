
import PouchDB from 'pouchdb'
import entity from '~/state/entity'

export default ({ env }, inject) => {
	const database = new PouchDB(env.database)

	inject('db', database)
	inject('entities', entity(database))
}
