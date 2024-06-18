
import { sortByProperty } from 'vue-daisy-ui/utils/list'
import { createId } from 'vue-daisy-ui/utils/string'
import { slugify } from '~/utils/string'
import { EventBus } from '~/utils/event-bus'
import { PROJECT_ID_PREFIX } from '~/utils/config'

// access PouchDb data only for objects with an id
// which begins with the given prefix
export default class Access {
	constructor(db, prefix, shape, event) {
		this.db = db

		// id prefix
		this.prefix = prefix

		// the basic structure of the object with all required properties
		this.shape = shape

		// event to emit when an object is created, updated, or deleted
		this.event = event
	}

	// return an object by its id with the Access object's prefix
	// add a slug (i.e. url) as a property
	async byId(id) {
		if(!id.startsWith(this.prefix)) id = this.prefix + id

		const result = await this.db.get(id)

		if(!result.slug) result.slug = this.slugify(result)

		return result
	}

	// retrieve all objects with the Access object's prefix
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

	// call all and filter resulting objects with the property matching the value
	async allByProperty(property, value) {
		const all = await this.all()

		return all
			.filter(item => item[property] === value)
			.sort(sortByProperty('title'))
	}

	// retrieve all objects with the prefix which belong to the given project
	async allByProject(projectId) {
		if(!projectId.startsWith(PROJECT_ID_PREFIX)) {
			projectId = PROJECT_ID_PREFIX + projectId
		}

		return await this.allByProperty('project', projectId)
	}	

	// create a new object by merging it with the default shape
	// return the new object and emit the event
	async create(data) {
		const id = data.title ? slugify(data.title) + '-' + createId(4) : createId(10)
		const item = {
			_id: this.prefix + id,
			...this.shape,
			...data,
		}

		const response = await this.db.put(item)

		if(!response.ok) throw new Error('Create failed')

		const created = await this.byId(id)

		if(!created.slug) created.slug = this.slugify(created)

		EventBus.$emit(this.event, created)

		return created
	}

	// save an existing object
	// return the updated object and emit the event
	async save(data) {
		const response = await this.db.put(data)

		if(!response.ok) throw new Error('Save failed')

		const saved = await this.byId(response.id)

		if(!saved.slug) saved.slug = this.slugify(saved)

		EventBus.$emit(this.event, saved)

		return saved
	}

	// delete an existing object
	// return the delete object and emit the event
	async delete(data) {
		const deleted = await this.db.remove(data)

		EventBus.$emit(this.event, deleted)

		return deleted
	}

	// default slug creator
	slugify(item) {
		return item._id.replace(this.prefix, '')
	}
}
