
import trim from 'lodash/trim'
import { notEmptyString, isIn, isNull, notIn, notNull } from 'vue-daisy-ui/utils/assert'
import { category } from '~/state/category'
import { element } from '~/state/element'

export default class RestoreNew {
	constructor(projectId, categories, elements) {
		this.projectId = projectId
		this.categories = categories
		this.elements = elements
	}

	async save() {
		// make a note of category title => id
		const categoryPathIdMap = await this._createOrUpdateCategories()

		// save all elements with no concern for order
		await Promise.all(this.elements.map(async elm => {
			elm = this._prepare(elm, this.projectId)

			// get the category by its title, if the element has one
			if(notEmptyString(elm.category)) {
				elm.category = isIn(elm.category, categoryPathIdMap) ? categoryPathIdMap[elm.category] : ''
			}

			return this._saveElement(elm)
		}))
	}

	_saveElement(elm) {
		return element().save(elm)
	}

	async _createOrUpdateCategories(categoryPathIdMap = {}) {
		// loop through categories in order and save
		// the zipper archive reads folders depth-first sequentially so
		// a nested category should never appear before its parent
		for(let i = 0, len = this.categories.length; i < len; ++i) {
			const cat = this._prepare(this.categories[i], this.projectId)
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
	}

	// prepare an object for creation by removing its _id and _rev properties
	// if a project id is passed, set that
	_prepare(obj, projectId, deleteId = false) {
		delete obj._rev

		if(notNull(projectId)) {
			obj.project = projectId
		}

		return obj
	}
}
