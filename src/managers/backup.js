
import trim from 'lodash/trim'
import { notEmptyString, isIn, isNull, notIn, notNull } from 'vue-daisy-ui/utils/assert'
import { map } from 'vue-daisy-ui/utils/list'
import DiffManager from '~/managers/diff'
import { category, ancestors } from '~/state/category'
import { element } from '~/state/element'
import { project } from '~/state/project'

export default {
	async restore(data) {
		// 1. if the project DOES exist diff elements and, if different it needs to save it to local storage for the user to address
		// 2. if a project with the extracted project id doesn't exist, just save it
		// 3. if the default project file isn't available it saves a new project
		// TODO - the different save methods may be better handled by separate classes
		// (possibly in a shallow hierarchy) which can be instantiated here rather than
		// having different options passed about
		if(notNull(data.project._id)) {
			const existing = await project().byId(data.project._id)

			if(notNull(existing)) {
				// option 1 - project exists so save new stuff and store a diff for existing stuff
				await this._saveAndDiffProjectData(existing._id, data.categories, data.elements)
			}
			else {
				// option 2 - project doesn't exist so create it
				const updated = await project().save(this._prepare(data.project))

				await this._saveProjectData(updated._id, data.categories, data.elements)
			}
		}
		else {
			// option 3 - no project so create a new one
			// TODO - would this be better if it tried to infer the project from an existing element?
			// it could try to load an element from the db and, if it exists, use the element's
			// project as a base. It would need to go through all elements and try to load them...
			const newProject = await project().create(data.project)

			await this._saveProjectData(newProject._id, data.categories, data.elements, true)
		}
	},

	// save the given categories and elements with the supplied project id
	async _saveProjectData(projectId, categories, elements, createElements = false) {
		// make a note of category title => id
		const categoryPathIdMap = await this._createOrUpdateCategories(categories, projectId)

		// save all elements with no concern for order
		await Promise.all(elements.map(async elm => {
			elm = this._prepare(elm, projectId, createElements)

			// get the category by its title, if the element has one
			if(notEmptyString(elm.category)) {
				elm.category = isIn(elm.category, categoryPathIdMap) ? categoryPathIdMap[elm.category] : ''
			}

			return createElements ? element().create(elm) : element().save(elm)
		}))
	},

	async _saveAndDiffProjectData(projectId, categories, elements) {
		// make a note of category title => id
		// load all categories for the project
		const existingCategories = await category().allByProject(projectId)
		const categoryIdMap = map(existingCategories, '_id')

		// update all categories to st the path
		existingCategories.forEach(cat => cat.path = ancestors(cat._id, categoryIdMap).map(({ title }) => title).join('/'))

		// loop through new categories and IF THEY DON'T EXIST create them
		// convert to a path => id map
		const categoryPathIdMap = await this._createOrUpdateCategories(categories, projectId, map(existingCategories, 'path', '_id'))

		// make a note of element id => element
		// load all elements for the project
		const existingElements = await element().allByProject(projectId)
		const elementIdObjectMap = map(existingElements, '_id')

		// save all elements with no concern for order
		await Promise.all(elements.map(async elm => {
			elm = this._prepare(elm, projectId)

			// get the category by its title, if the element has one
			if(notEmptyString(elm.category)) {
				elm.category = isIn(elm.category, categoryPathIdMap) ? categoryPathIdMap[elm.category] : ''
			}

			// if it doesn't exist create it
			if(notIn(elm._id, elementIdObjectMap)) {
				return element().save(elm)
			}

			// if it exists (id is in the map) save it as a diff
			else if(!DiffManager.equal(elm, elementIdObjectMap[elm._id], ['slug'])) {
				DiffManager.storeDiff(elm._id, elm)
			}

			return Promise.resolve()
		}))
	},

	async _createOrUpdateCategories(categories, projectId, categoryPathIdMap = {}) {
		// loop through categories in order and save
		// the zipper archive reads folders depth-first sequentially so
		// a nested category should never appear before its parent
		for(let i = 0, len = categories.length; i < len; ++i) {
			const cat = this._prepare(categories[i], projectId)
			const currentPath = trim([cat.parent, cat.title].join('/'), '/')

			// this category exists already, ignore it
			if(isIn(currentPath, categoryPathIdMap)) {
				continue
			}

			// get the parent category by its title, if the category has a parent
			if(notEmptyString(cat.parent)) {
				cat.parent = categoryPathIdMap[cat.parent]
			}

			// keep the id and title to map for nested categories and elements
			const { _id } = await category().create(cat)
			const newPath = await category().getPath(_id)

			categoryPathIdMap[newPath] = _id
		}

		return categoryPathIdMap
	},

	// prepare an object for creation by removing its _id and _rev properties
	// if a project id is passed, set that
	_prepare(obj, projectId, deleteId = false) {
		delete obj._rev

		if(deleteId) {
			delete obj._id
		}

		if(notNull(projectId)) {
			obj.project = projectId
		}

		return obj
	},
}
