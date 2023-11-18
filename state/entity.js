
//import Vue from 'vue'
import { DEFAULT_ENTITY, ENTITY_ID_PREFIX } from '~/utils/config'
import { createId } from 'we-ui/utils/string'

export default db => {
	return {
		async byId(id) {
			if(!id.startsWith(ENTITY_ID_PREFIX)) id = ENTITY_ID_PREFIX + id

			return await db.get(id)
		},

		async all() {
			// for some reason this returning all docs for me
			const response = await db.allDocs({
				include_docs: true,
				startKey: ENTITY_ID_PREFIX,
				endKey: `${ENTITY_ID_PREFIX}\u1111`,
			})

			return response.rows
				.filter(row => row.id.startsWith(ENTITY_ID_PREFIX))
				.map(row => row.doc)
		},

		async create(data) {
			const id = createId()
			const entity = {
				...DEFAULT_ENTITY,
				_id: ENTITY_ID_PREFIX + id,
				...data,
			}

			const response = await db.put(entity)

			if(!response.ok) throw 'Unable to create entity'

			return await this.byId(id)
		},

		async save(data) {
			return await db.put(data)
		},

		async delete(data) {
			return await db.remove(data)
		},
	}
}
