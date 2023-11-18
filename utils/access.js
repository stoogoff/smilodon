
import { createId } from 'we-ui/utils/string'

export default class Access {
	constructor(db, prefix) {
		this.db = db
		this.prefix = prefix
	}

	async byId(id) {
		if(!id.startsWith(this.prefix)) id = this.prefix + id

		const result = await this.db.get(id)

		if(!result.slug) result.slug = result._id.replace(this.prefix, '')

		return result
	}

	async all() {
		// for some reason this returning all docs for me
		const response = await this.db.allDocs({
			include_docs: true,
			startKey: this.prefix,
			endKey: `${this.prefix}\u1111`,
		})

		return response.rows
			.filter(row => row.id.startsWith(this.prefix))
			.map(row => ({ slug: row.id.replace(this.prefix, ''), ...row.doc }))
	}

	async create(data) {
		const id = createId()
		const item = {
			_id: this.prefix + id,
			...data,
		}

		const response = await this.db.put(item)

		if(!response.ok) throw 'Create failed'

		return await this.byId(id)
	}

	async save(data) {
		return await this.db.put(data)
	}

	async delete(data) {
		return await this.db.remove(data)
	}
}
