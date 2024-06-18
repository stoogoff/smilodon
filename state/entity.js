
import {
	DEFAULT_ENTITY,
	ENTITY_ID_PREFIX,
	ENTITIES_UPDATED,
	CATEGORY_ID_PREFIX,
	PROJECT_ID_PREFIX,
} from '~/utils/config'
import Access from '~/utils/access'
import { sortByProperty } from 'vue-daisy-ui/utils/list'

let _access

// return the created instance
export const entity = () => _access

// create a database Access instance for entities and add specific methods
export default db => {
	_access = new Access(db, ENTITY_ID_PREFIX, DEFAULT_ENTITY, ENTITIES_UPDATED)

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

	// return all entities connected to this entity
	// connected entities include in the same category
	// or having one or more tag in common
	_access.connections = async function(entity) {
		const entities = await this.allByProject(entity.project)

		return entities
			// not itself
			.filter(({ _id }) => _id !== entity._id)
			// has at least one matching tag or is in the category
			.filter(({ category, tags }) => 
				category === entity.category || tags.filter(tag => entity.tags.includes(tag)).length > 0)
	}

	// override slugify
	_access.slugify = function(item) {
		return `/projects/${ item.project.replace(PROJECT_ID_PREFIX, '') }/entities/${ item._id.replace(this.prefix, '') }`
	}

	return _access
}
