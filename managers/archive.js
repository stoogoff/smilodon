
import JSZip from 'jszip'
import YAML from 'yaml'

import { entity } from '~/state/entity'
import { category } from '~/state/category'
import { project } from '~/state/project'
import { notEmptyString, throwIfNull, isEntity, isCategory } from '~/utils/assert'

export default {
	// create a ZIP archive and return it
	async create(projectId) {
		throwIfNull(projectId, 'projectId')

		const rootProject = await project().byId(projectId)
		const entities = await entity().allByProject(projectId)
		const categories = await category().allByProject(projectId)

		const byParent = {}
		const combine = property => {
			return item => {
				if(!(item[property] in byParent)) {
					byParent[item[property]] = []
				}

				byParent[item[property]].push(item)
			}
		}

		entities.forEach(combine('category'))
		categories.forEach(combine('parent'))

		const recurseTree = (folder, current) => {
			if(!(current in byParent)) return

			const tree = byParent[current]

			tree.forEach(leaf => {
				if(isEntity(leaf)) {
					folder.file(`${leaf.title}.md`, this.createMarkdownFile(leaf))
				}

				if(isCategory(leaf)) {
					const subfolder = folder.folder(leaf.title)

					recurseTree(subfolder, leaf._id)
				}
			})
		}

		const archive = new JSZip()
		const root = archive.folder(rootProject.title)

		root.file(`${rootProject.title}.md`, this.createMarkdownFile(rootProject))

		recurseTree(root, '')

		return await archive.generateAsync({ type: 'blob' })
	},

	createMarkdownFile(obj) {
		const copy = { ...obj }
		const ignore = ['_id', '_rev', 'slug', 'project', 'category', 'icon', 'description']

		Object.keys(copy).filter(key => ignore.includes(key)).forEach(key => delete copy[key])

		const header = YAML.stringify(copy)
		const buffer = []

		if(notEmptyString(header)) {
			buffer.push('---')
			buffer.push(header)
			buffer.push('---\n')
		}

		if(obj.title)
			buffer.push(`# ${obj.title}\n`)

		if(obj.description)
			buffer.push(`${obj.description}\n`)

		return buffer.join('\n')
	},
}
