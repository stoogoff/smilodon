
import {
	DEFAULT_ENTITY,
	ENTITY_ID_PREFIX,
	ENTITIES_UPDATED,
	CATEGORY_ID_PREFIX,
	PROJECT_ID_PREFIX,
} from '~/utils/config'
import Access from '~/utils/access'
import { sortByProperty } from 'vue-daisy-ui/utils/list'

export default db => {
	const access = new Access(db, ENTITY_ID_PREFIX, DEFAULT_ENTITY, ENTITIES_UPDATED)

	access.allByCategory = async function(categoryId) {
		if(!categoryId.startsWith(CATEGORY_ID_PREFIX)) {
			categoryId = CATEGORY_ID_PREFIX + categoryId
		}

		return await this.allByProperty('category', categoryId)
	}

	access.tagsByProject = async function(projectId) {
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

	access.connections = async function(entity) {
		const entities = await this.allByProject(entity.project)

		return entities.filter(({ tags }) =>
			tags.filter(tag => entity.tags.includes(tag)).length > 0)
	}

	access.slugify = function(item) {
		return `/projects/${ item.project.replace(PROJECT_ID_PREFIX, '') }/entities/${ item._id.replace(this.prefix, '') }`
	}

	return access
}
