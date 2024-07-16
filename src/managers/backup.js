
import { notEmptyString, isIn, notNull } from 'vue-daisy-ui/utils/assert'
import { category } from '~/state/category'
import { element } from '~/state/element'
import { project } from '~/state/project'

export default {
	async restore(data) {
		console.log('restore', data)
		// TODO this will return a project which needs to be saved
		// 1. if the project DOES exist it's more involved. It needs to diff element and, if different it needs to save it to local storage for the user to address
		// AND on that note, the auto-save stuff needs to show a diff of the content so the
		// user can make an  informed decision on what to do
		// 2. if a project with the extracted project id doesn't exist, just save it
		// 3. if the project.md file isn't available it should notify the user and let them create a new one (OR automatically create the new one and let them modify as they need to)
		if(notNull(data.project._id)) {
			const existing = await project().byId(data.project._id)

			if(notNull(existing)) {
				// TODO option 1
			}
			else {
				// option 2 - project doesn't exist so create it
				const updated = await project().create(this._prepare(data.project))

				await this._saveProjectData(updated._id, data.categories, data.elements)
			}
		}
		else {
			// option 3 - no project so create a new one
			const newProject = await project().create(data.project)

			await this._saveProjectData(newProject._id, data.categories, data.elements)
		}
	},

	// save the given categories and elements with the supplied project id
	async _saveProjectData(projectId, categories, elements) {
		// make a note of category title => id
		const categoryTitleIdMap = await this._createOrUpdateCategories(categories, projectId)

		// save all elements with no concern for order
		await Promise.all(elements.map(async elm => {
			elm = this._prepare(elm, projectId)

			// get the category by its title, if the element has one
			if(notEmptyString(elm.category)) {
				elm.category = categoryTitleIdMap[elm.category]
			}

			return element().create(elm)
		}))
	},

	async _saveAndDiffProjectData(projectId, categories, elements) {
		// make a note of category title => id
		let categoryTitleIdMap = {}

		// load all categories for the project
		const existingCategories = await category().allByProject(projectId)

		existingCategories.forEach(({ _id, title}) => categoryTitleIdMap[title] = _id)

		categoryTitleIdMap = this._createOrUpdateCategories(categories, projectId, categoryTitleIdMap)

		// make a note of element id => element
		const elementIdObjectMap = {}

		const existingElements = await element().allByProject(projectId)

		existingElements.forEach(elm => elementIdObjectMap[elm._id] = elm)

		// convert to a title => id map
		// loop through new categories and IF THEY DON'T EXIST create them

		// load all elements for the project
		// for ease, convert to a id => element map
		// loop through new elements
		// if it exists (id is in the map) save it as a diff
		// if it doesn't exist create it
	},

	async _createOrUpdateCategories(categories, projectId, categoryTitleIdMap = {}) {
		// loop through categories in order and save
		// the zipper archive reads folders depth-first sequentially so
		// a nested category should never appear before its parent
		for(let i = 0, len = categories.length; i < len; ++i) {
			// TODO - this doesn't account for nested categories
			if(isIn(categories[i].title, categoryTitleIdMap)) {
				continue
			}

			const cat = this._prepare(categories[i], projectId)

			// get the parent category by its title, if the category has a parent
			if(notEmptyString(cat.parent)) {
				cat.parent = categoryTitleIdMap[cat.parent]
			}

			// keep the id and title to map for nested categories and elements
			const { _id, title } = await category().create(cat)

			categoryTitleIdMap[title] = _id
		}

		return categoryTitleIdMap
	},

	// prepare an object for creation by removing its _id and _rev properties
	// if a project id is passed, set that
	_prepare(obj, projectId) {
		delete obj._id
		delete obj._rev

		if(notNull(projectId)) {
			obj.project = projectId
		}

		return obj
	},
}
