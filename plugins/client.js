
import PouchDB from 'pouchdb'
//import { character } from '~/state'

export default ({ env }, inject) => {
	const database = new PouchDB(env.database)

	inject('db', database)
	//inject('characters', character(database))
}
