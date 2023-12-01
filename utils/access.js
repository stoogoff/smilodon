
import { sortByProperty } from 'we-ui/utils/list'
import { createId } from 'we-ui/utils/string'
import { EventBus } from '~/utils/event-bus'

export default class Access {
	constructor(db, prefix, shape, event) {
		this.db = db
		this.prefix = prefix
		this.shape = shape
		this.event = event
	}

	async byId(id) {
		if(!id.startsWith(this.prefix)) id = this.prefix + id

		const result = await this.db.get(id)

		if(!result.slug) result.slug = result._id.replace(this.prefix, '')

		return result
	}

	async all() {
		// for some reason this is returning all docs for me
		const response = await this.db.allDocs({
			include_docs: true,
			startKey: this.prefix,
			endKey: `${this.prefix}\u1111`,
		})

		return response.rows
			.filter(row => row.id.startsWith(this.prefix))
			.map(row => ({ slug: row.id.replace(this.prefix, ''), ...row.doc }))
			.sort(sortByProperty('title'))
	}

	async allByProperty(property, value) {
		const all = await this.all()

		return all
			.filter(item => item[property] === value)
			.sort(sortByProperty('title'))
	}

	async create(data) {
		const id = createId(10)
		const item = {
			_id: this.prefix + id,
			...this.shape,
			...data,
		}

		const response = await this.db.put(item)

		if(!response.ok) throw 'Create failed'

		const created = await this.byId(id)

		EventBus.$emit(this.event, created)

		return created
	}

	async save(data) {
		const saved = await this.db.put(data)

		EventBus.$emit(this.event, saved)

		return saved
	}

	async delete(data) {
		const deleted = await this.db.remove(data)

		EventBus.$emit(this.event, deleted)

		return deleted
	}
}
