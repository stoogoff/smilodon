
import intersectionWith from 'lodash/intersectionWith'
import { sortByProperty } from 'vue-daisy-ui/utils/list'
import {
	DEFAULT_ELEMENT,
	ELEMENT_ID_PREFIX,
	ELEMENTS_UPDATED,
	CATEGORY_ID_PREFIX,
	PROJECT_ID_PREFIX,
} from '~/utils/config'
import Access from './access'

let _access

// return the created instance
export const element = () => _access

// create a database Access instance for entities and add specific methods
export default db => {
	_access = new Access(db, ELEMENT_ID_PREFIX, DEFAULT_ELEMENT, ELEMENTS_UPDATED)

	// return all entities for a given category
	_access.allByCategory = async function(categoryId) {
		if(!categoryId.startsWith(CATEGORY_ID_PREFIX)) {
			categoryId = CATEGORY_ID_PREFIX + categoryId
		}

		return await this.allByProperty('category', categoryId)
	}

	// retrieve all tags from all entities in the given project
	// count tag usage and return as an array of { title, count }
	_access.tagsByProject = async function(projectId) {
		const entities = await this.allByProject(projectId)
		const tags = entities.flatMap(({ tags }) => tags)
		const tagCount = {}

		tags.forEach(tag => {
			tagCount[tag] = tagCount[tag] || 0
			tagCount[tag]++
		})

		return Object.keys(tagCount).map(key => ({
			title: key,
			count: tagCount[key]
		})).sort(sortByProperty('title'))
	}

	// return all entities connected to this element
	// connected entities include in the same category
	// or having one or more tag in common
	_access.connections = async function(element) {
		const entities = await this.allByProject(element.project)

		return entities
			// not itself
			.filter(({ _id }) => _id !== element._id)
			// add the connection type to the element
			.map(ent => {
				const matchingProperties = intersectionWith(element.properties, ent.properties, (a, b) => a.name === b.name && a.value == b.value)
				// match the title but not in the format used for a link title
				const matcher = new RegExp('[^"]' + ent.title + '[^"][^)]', 'gi')

				// TODO elements which mention this element

				return {
					...ent,
					// element contains this element's slug in its description
					isLink: element.description.includes(ent.slug),
					// element contains this element's title in its description
					isMention: element.description.match(matcher),
					// elements belong to the same  category
					isCategory: ent.category === element.category,
					// elements have a matching tag
					isTag: ent.tags.filter(tag => element.tags.includes(tag)).length > 0,
					// elements have a property with the same name and value
					hasMatchingProperty: matchingProperties.length > 0,
					matchingProperties,
				}
			})
			// has at least one matching field or is in the category
			.filter(({ isLink, isMention, isCategory, isTag, hasMatchingProperty }) => 
				isLink || isMention || isCategory || isTag || hasMatchingProperty)
	}

	// override slugify
	_access.slugify = function(item) {
		return `/projects/${ item.project.replace(PROJECT_ID_PREFIX, '') }/elements/${ item._id.replace(this.prefix, '') }`
	}

	return _access
}
