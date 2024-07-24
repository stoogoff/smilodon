
import { notEmptyString, isIn, notIn } from 'vue-daisy-ui/utils/assert'
import { map } from 'vue-daisy-ui/utils/list'
import Diff from '~/modules/diff'
import { category, ancestors } from '~/state/category'
import { element } from '~/state/element'
import RestoreNew from './restore-new'

export default class RestoreExisting extends RestoreNew {
	// override save to use existing categories, where available
	// and store updated elements as a diff rather than overrwriting
	async save() {
		// make a note of category title => id
		// load all categories for the project
		const existingCategories = await category().allByProject(this.projectId)
		const categoryIdMap = map(existingCategories, '_id')

		// update all categories to st the path
		existingCategories.forEach(cat => cat.path = ancestors(cat._id, categoryIdMap).map(({ title }) => title).join('/'))

		// loop through new categories and IF THEY DON'T EXIST create them
		// convert to a path => id map
		const categoryPathIdMap = await this._createOrUpdateCategories(map(existingCategories, 'path', '_id'))

		// make a note of element id => element
		// load all elements for the project
		const existingElements = await element().allByProject(this.projectId)
		const elementIdObjectMap = map(existingElements, '_id')

		// save all elements with no concern for order
		await Promise.all(this.elements.map(async elm => {
			elm = this._prepare(elm, this.projectId)

			// get the category by its title, if the element has one
			if(notEmptyString(elm.category)) {
				elm.category = isIn(elm.category, categoryPathIdMap) ? categoryPathIdMap[elm.category] : ''
			}

			// if it doesn't exist create it
			if(notIn(elm._id, elementIdObjectMap)) {
				return this._saveElement(elm)
			}
			// if it exists (id is in the map) and it different to the existing, save it as a diff
			else if(!Diff.equal(elm, elementIdObjectMap[elm._id], ['slug'])) {
				Diff.storeDiff(elm._id, elm)
			}

			return Promise.resolve()
		}))
	}
}
