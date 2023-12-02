
import { sortByProperty } from 'we-ui/utils/list'
import { createId } from 'we-ui/utils/string'
import { slugify } from '~/utils/string'
import { EventBus } from '~/utils/event-bus'
import { PROJECT_ID_PREFIX } from '~/utils/config'

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

		if(!result.slug) result.slug = this.slugify(result)

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
			.map(row => ({ slug: this.slugify(row.doc), ...row.doc }))
			.sort(sortByProperty('title'))
	}

	async allByProperty(property, value) {
		const all = await this.all()

		return all
			.filter(item => item[property] === value)
			.sort(sortByProperty('title'))
	}

	async allByProject(projectId) {
		if(!projectId.startsWith(PROJECT_ID_PREFIX)) {
			projectId = PROJECT_ID_PREFIX + projectId
		}

		return await this.allByProperty('project', projectId)
	}	

	async create(data) {
		const id = data.title ? slugify(data.title) + '-' + createId(4) : createId(10)
		const item = {
			_id: this.prefix + id,
			...this.shape,
			...data,
		}

		const response = await this.db.put(item)

		if(!response.ok) throw 'Create failed'

		const created = await this.byId(id)

		if(!created.slug) created.slug = this.slugify(created)

		EventBus.$emit(this.event, created)

		return created
	}

	async save(data) {
		const response = await this.db.put(data)

		if(!response.ok) throw 'Save failed'

		const saved = await this.byId(response.id)

		if(!saved.slug) saved.slug = this.slugify(saved)

		EventBus.$emit(this.event, saved)

		return saved
	}

	async delete(data) {
		const deleted = await this.db.remove(data)

		EventBus.$emit(this.event, deleted)

		return deleted
	}

	slugify(item) {
		return item._id.replace(this.prefix, '')
	}
}
